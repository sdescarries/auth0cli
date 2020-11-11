import { config, main } from "../auth0cli.ts";

const stubLogger = (...data: []) => undefined;

config.logger = {
  debug: stubLogger,
  error: stubLogger,
  info: stubLogger,
  log: stubLogger,
  warn: stubLogger,
};

await Deno.test(
  "auth0cli handles empty command",
  () => main([]).then(() => {}),
);

await Deno.test(
  "auth0cli handles bad command",
  () => main(["foo"]).then(() => {}),
);

await Deno.test(
  "auth0cli handles machine",
  () => main(["machine"]).then(() => {}),
);

await Deno.test(
  "auth0cli handles login",
  () => main(["login"]).then(() => {}),
);

await Deno.test(
  "auth0cli handles refresh",
  () => main(["refresh"]).then(() => {}),
);
