#!/usr/bin/env deno run --quiet --allow-env --allow-net --allow-read --allow-write

import config from "./ts/Config.ts";
import { login, machine, refresh } from "./ts/Client.ts";
import { loadSession, Session } from "./ts/Session.ts";

export interface Hooks {
  log: (message: string) => void;
  error: (message: string) => void;
}

export async function doMachine(
  hooks: Hooks = console,
): Promise<Session> {
  const result = await machine(config);
  hooks.log(`Machine successful, please handle these tokens carefully`);
  hooks.log(JSON.stringify(result, null, 2));
  return result;
}

export async function doLogin(
  hooks: Hooks = console,
): Promise<Session> {
  const result = await login(config);
  hooks.log(`Login successful, please handle these tokens carefully`);
  hooks.log(JSON.stringify(result, null, 2));
  return result;
}

export async function doRefresh(
  hooks: Hooks = console,
): Promise<Session> {
  const session = await loadSession();
  const { refreshToken } = session;
  const result = await refresh({
    ...config,
    refreshToken,
  });
  hooks.log(`Refresh successful, please handle these tokens carefully`);
  hooks.log(JSON.stringify(result, null, 2));
  return result;
}

export function main(
  [cmd, ...args]: string[],
  hooks: Hooks = console,
): Promise<Session | void> {
  if (cmd != null) {
    switch (cmd.toLocaleLowerCase()) {
      case "login":
        return doLogin(hooks);
      case "machine":
        return doMachine(hooks);
      case "refresh":
        return doRefresh(hooks);
      default:
        hooks.error(`unknown command [${cmd}]`);
        break;
    }
  }
  return Promise.resolve();
}

await main(Deno.args);
