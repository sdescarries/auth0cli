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
    refreshToken: params.refreshToken,

    // static parameters from the API
    grantType: "refresh_token",
  }, config);
}

export async function authFetch(
  params: Params,
  {
    apiFetch = fetch,
    getCurrentTime = Date.now,
    oldSession,
    saveSession,
  }: ClientConfig = {},
): Promise<Session> {
  const valiationErrors = validateParams(params);
  if (valiationErrors.length) {
    return Promise.reject(
      new Error(`parameter validation failed\n\n${valiationErrors.join("\n")}`),
    );
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

  session.expiresAt = new Date(now + session.expiresIn);

  if (saveSession != null) {
    return saveSession(session);
  }

  return Promise.resolve(session);
}
