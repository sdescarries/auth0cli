#!/usr/bin/env deno run --quiet --log-level info --allow-env --allow-net --allow-read --allow-write

import config from "./ts/Config.ts";
import { login, refresh } from "./ts/Client.ts";
import { loadSession } from "./ts/Session.ts";

const [cmd, ...args] = Deno.args;

if (cmd != null) {
  switch (cmd.toLocaleLowerCase()) {
    case "login":
      await login(config);
      break;

    case "refresh": {
      const session = await loadSession();
      const { refreshToken } = session;

      await refresh({
        ...config,
        refreshToken,
      });
      break;
    }

    default:
      console.error(`unknown command [${cmd}]`);
      break;
  }
}
