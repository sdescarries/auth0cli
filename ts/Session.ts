#!/usr/bin/env deno run --allow-read

import config from "./Config.ts";

export interface Session {
  accessToken: string;
  expiresAt: Date;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
}

export interface LoadSession {
  (sessionFilePath?: string): Promise<Session>;
}

export interface SaveSession {
  (
    session: Session,
    sessionFilePath?: string,
  ): Promise<Session>;
}

export function getSessionFilePath(clientId: string = config.clientId): string {
  const home = Deno.env.get("HOME") ?? "";

  if (clientId == "") {
    throw new Error(`required parameter clientId is empty`);
  }

  return `${home}/.auth0cli-${clientId}.json`;
}

export async function loadSession(
  sessionFilePath: string = getSessionFilePath(),
): Promise<Session> {
  const data = await Deno
    .readTextFile(sessionFilePath)
    .catch(() => "{}");

  const session = <Session> JSON.parse(data);
  return Promise.resolve(session);
}

export async function saveSession(
  session: Session,
  sessionFilePath: string = getSessionFilePath(),
): Promise<Session> {
  const previous = await loadSession(sessionFilePath);
  session = { ...previous, ...session };
  const data = JSON.stringify(session, null, 2);
  await Deno.writeTextFile(sessionFilePath, data);
  return Promise.resolve(session);
}
