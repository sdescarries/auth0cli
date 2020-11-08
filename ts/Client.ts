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
  domain?: string;
  clientSecret?: string;
}

export interface LoginParams extends BasicParams {
  audience?: string;
  password?: string;
  realm?: string;
  username?: string;
}

export const login = (params: LoginParams) =>
  authFetch({
    ...params,
    grantType: "http://auth0.com/oauth/grant-type/password-realm",
    scope: "offline_access",
  });

export interface RefreshParams extends BasicParams {
  refreshToken?: string;
}

export const refresh = (params: RefreshParams) =>
  authFetch({
    ...params,
    grantType: "refresh_token",
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

  if (response.status == 200) {
    await saveSession(session);
    console.log(session);
  } else {
    console.error(session);
  }

  return Promise.resolve(true);
}
