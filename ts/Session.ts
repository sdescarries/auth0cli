#!/usr/bin/env deno run --allow-read

import config from "./Config.ts";

export function getSessionFilePath(clientId: string = config.clientId): string {
  const home = Deno.env.get("HOME") ?? "";

  if (clientId == "") {
    throw new Error(`required parameter clientId is empty`);
  }

  return `${home}/auth0cli-${clientId}.json`;
}

export interface Session {
  accessToken: string;
  expiresAt: Date;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
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
): Promise<void> {
  const data = JSON.stringify(session, null, 2);
  return Deno.writeTextFile(sessionFilePath, data);
}
