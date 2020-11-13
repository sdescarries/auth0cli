import {
  convertToCamelCase,
  convertToUnderscore,
  Params,
  validateParams,
} from "./helpers.ts";

import {
  ClientConfig,
  LoginParams,
  MachineParams,
  RefreshParams,
  Session,
} from "./types.ts";

export function machine(
  params: MachineParams,
  config?: ClientConfig,
): Promise<Session> {
  return authFetch({
    // expanding to avoid globing of all env parameters
    audience: params.audience,
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    domain: params.domain,

    // static parameters from the API
    grantType: "client_credentials",
  }, config);
}

export function login(
  params: LoginParams,
  config?: ClientConfig,
): Promise<Session> {
  return authFetch({
    // expanding to avoid globing of all env parameters
    audience: params.audience,
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    domain: params.domain,
    password: params.password,
    realm: params.realm,
    username: params.username,

    // static parameters from the API
    grantType: "http://auth0.com/oauth/grant-type/password-realm",
    scope: "offline_access",
  }, config);
}

export function refresh(
  params: RefreshParams,
  config?: ClientConfig,
) {
  return authFetch({
    // expanding to avoid globing of all env parameters
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    domain: params.domain,

    // stub to be filled by old session
    refreshToken: "",

    // static parameters from the API
    grantType: "refresh_token",
  }, config);
}

const stubLoadSession = () => Promise.resolve(<Session> ({}));
const stubSaveSession = (session: Session) =>
  Promise.resolve(<Session> (session));

export async function authFetch(
  { ...params }: Params,
  config?: ClientConfig,
): Promise<Session> {
  const {
    apiFetch,
    getCurrentTime = Date.now,
    loadSession = stubLoadSession,
    saveSession = stubSaveSession,
    logger,
  } = config || {};

  if (apiFetch == null) {
    const error = new Error(`missing fetch implementation`);
    return Promise.reject(error);
  }

  const oldSession = <Params> <unknown> await loadSession();
  const valiationErrors = validateParams(params, oldSession);

  if (valiationErrors.length) {
    const error = new Error(
      `parameter validation failed\n\n${valiationErrors.join("\n")}`,
    );
    return Promise.reject(error);
  }

  const url = `https://${params.domain}/oauth/token`;
  const data = convertToUnderscore(params);
  const body = JSON.stringify(data);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
  };

  const now = getCurrentTime();
  const response = await apiFetch(
    url,
    {
      body,
      headers,
      method,
    },
  );

  const { status, statusText } = response;
  const sessionRaw = await response.json();
  const session = <Session> <unknown> {
    ...oldSession,
    ...convertToCamelCase(sessionRaw),
  };

  if (status !== 200) {
    const details = JSON.stringify(session, null, 2);
    const error = new Error(
      `request failed: ${status} ${statusText}\n\n${details}`,
    );
    return Promise.reject(error);
  }

  session.expiresAt = new Date(now + session.expiresIn * 1000);
  logger?.info(JSON.stringify(session, null, 2));

  return saveSession(session);
}
