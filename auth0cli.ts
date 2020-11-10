import config from "./mod/config.ts";
import { Session } from "./mod/types.ts";
import { loadSession, saveSession } from "./mod/session.ts";
import { login, machine, refresh } from "./mod/client.ts";

export interface Logger {
  log: (message: string) => void;
  error: (message: string) => void;
}

export async function doMachine(
  logger: Logger = console,
): Promise<Session> {
  const session = await loadSession();
  const result = await machine(config, {
    oldSession: session,
    saveSession,
  });
  logger.log(`Machine successful, please handle these tokens carefully`);
  logger.log(JSON.stringify(result, null, 2));
  return result;
}

export async function doLogin(
  logger: Logger = console,
): Promise<Session> {
  const session = await loadSession();
  const result = await login(config, {
    oldSession: session,
    saveSession,
  });
  logger.log(`Login successful, please handle these tokens carefully`);
  logger.log(JSON.stringify(result, null, 2));
  return result;
}

export async function doRefresh(
  logger: Logger = console,
): Promise<Session> {
  const session = await loadSession();
  const { refreshToken } = session;
  const result = await refresh({
    ...config,
    refreshToken,
  }, {
    oldSession: session,
    saveSession,
  });
  logger.log(`Refresh successful, please handle these tokens carefully`);
  logger.log(JSON.stringify(result, null, 2));
  return result;
}

export function main(
  [cmd, ...args]: string[],
  logger: Logger = console,
): Promise<Session | void> {
  if (cmd != null) {
    switch (cmd.toLocaleLowerCase()) {
      case "login":
        return doLogin(logger);
      case "machine":
        return doMachine(logger);
      case "refresh":
        return doRefresh(logger);
      default:
        logger.error(`unknown command [${cmd}]`);
        break;
    }
  }
  return Promise.resolve();
}

await main(Deno.args);
