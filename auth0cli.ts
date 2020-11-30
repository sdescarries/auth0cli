import params from "./mod/params.ts";
import { getSessionFilePath, loadSession, saveSession } from "./mod/session.ts";
import { Logger, Session } from "./mod/types.ts";
import { login, machine, refresh } from "./mod/client.ts";

const sessionFilePath = getSessionFilePath(params.clientId);

export const config = {
  apiFetch: fetch,
  base64Decode: atob,
  logger: <Logger> console,
  loadSession: () => loadSession(sessionFilePath),
  saveSession: (s: Session) => saveSession(s, sessionFilePath),
};

export function main([cmd]: string[]): Promise<Session | void> {
  if (cmd != null) {
    switch (cmd.toLocaleLowerCase()) {
      case "login":
        return login(params, config);
      case "machine":
        return machine(params, config);
      case "refresh":
        return refresh(params, config);
      default:
        config.logger.error(`unknown command [${cmd}]`);
        break;
    }
  }
  return Promise.resolve();
}

await main(Deno.args);
