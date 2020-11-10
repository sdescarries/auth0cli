import {
  convertToCamelCase,
  convertToUnderscore,
  Params,
  validateParams,
} from "./Helpers.ts";

import {
  SaveSession,
  saveSession as implementation,
  Session,
} from "./Session.ts";

export interface BasicParams {
  clientId?: string;
  clientSecret?: string;
  domain?: string;
}

export interface LoginParams extends BasicParams {
  audience?: string;
  password?: string;
  realm?: string;
  username?: string;
}

export interface RefreshParams extends BasicParams {
  refreshToken?: string;
}

export interface ApiFetch {
  (
    input: Request | URL | string,
    init?: RequestInit,
  ): Promise<Response>;
}

export interface Hooks {
  apiFetch?: ApiFetch;
  getCurrentTime?: () => number;
  saveSession?: SaveSession;
}

export function machine(
  params: LoginParams,
  hooks: Hooks = {},
): Promise<Session> {
  return authFetch({
    // expanding to avoid globing of all env parameters
    audience: params.audience,
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    domain: params.domain,

    // static parameters from the API
    grantType: "client_credentials",
  }, hooks);
}

export function login(
  params: LoginParams,
  hooks: Hooks = {},
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
  }, hooks);
}

export function refresh(params: RefreshParams, hooks: Hooks = {}) {
  return authFetch({
    // expanding to avoid globing of all env parameters
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    domain: params.domain,
    refreshToken: params.refreshToken,

    // static parameters from the API
    grantType: "refresh_token",
  }, hooks);
}

export async function authFetch(
  params: Params,
  {
    apiFetch = fetch,
    getCurrentTime = Date.now,
    saveSession = implementation,
  }: Hooks = {},
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
  const session = <Session> <unknown> convertToCamelCase(sessionRaw);

  if (status !== 200) {
    const details = JSON.stringify(session, null, 2);
    const error = new Error(
      `request failed: ${response.status} ${response.statusText}\n\n${details}`,
    );
    return Promise.reject(error);
  }

  session.expiresAt = new Date(now + session.expiresIn);
  return saveSession(session);
}
