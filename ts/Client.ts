import config from "./Config.ts";
import {
  convertToCamelCase,
  convertToUnderscore,
  Params,
  validateParams,
} from "./Helpers.ts";
import { loadSession, saveSession, Session } from "./Session.ts";

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

export const login = ({
  audience,
  clientId,
  clientSecret,
  domain,
  password,
  realm,
  username,
}: LoginParams) =>
  authFetch({
    audience,
    clientId,
    clientSecret,
    domain,
    grantType: "http://auth0.com/oauth/grant-type/password-realm",
    password,
    realm,
    scope: "offline_access",
    username,
  });

export interface RefreshParams extends BasicParams {
  refreshToken?: string;
}

export const refresh = ({
  clientId,
  clientSecret,
  domain,
  refreshToken,
}: RefreshParams) =>
  authFetch({
    clientId,
    clientSecret,
    domain,
    grantType: "refresh_token",
    refreshToken,
  });

export async function authFetch(params: Params): Promise<boolean> {
  if (!validateParams(params)) {
    return Promise.resolve(false);
  }

  const url = `https://${params.domain}/oauth/token`;
  const data = convertToUnderscore(params);
  const body = JSON.stringify(data);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
  };

  console.debug(
    {
      url,
      body: data,
      headers,
      method,
    },
  );

  const now = Date.now();
  const response = await fetch(
    url,
    {
      body,
      headers,
      method,
    },
  );

  const sessionRaw = await response.json();
  const session = <Session> <unknown> convertToCamelCase(sessionRaw);
  session.expiresAt = new Date(now + session.expiresIn);

  if (response.status == 200) {
    await saveSession(session);
    console.log(session);
  } else {
    console.error(session);
  }

  return Promise.resolve(true);
}
