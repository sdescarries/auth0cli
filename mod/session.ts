import { Session } from "./types.ts";

export function getSessionFilePath(sessionId = "default"): string {
  const home = Deno.env.get("HOME") ?? "";
  if (sessionId == "") {
    throw new Error(`required parameter clientId is empty`);
  }
  return `${home}/.auth0cli-${sessionId}.json`;
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
  const data = JSON.stringify(session, null, 2);
  await Deno.writeTextFile(sessionFilePath, data);
  return Promise.resolve(session);
}

export default {
  getSessionFilePath,
  loadSession,
  saveSession,
};
