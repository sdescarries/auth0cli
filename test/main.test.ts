import { Logger, main } from "../auth0cli.ts";

const lastLogs: string[] = [];
const lastErrors: string[] = [];

const logger: Logger = {
  log: (message: string) => lastLogs.push(message),
  error: (message: string) => lastErrors.push(message),
};

await Deno.test("auth0cli handles empty command", () =>
  main([], logger)
    .then(() => {}));

await Deno.test("auth0cli handles bad command", () =>
  main(["foo"], logger)
    .then(() => {}));

await Deno.test("auth0cli handles machine", () =>
  main(["machine"], logger)
    .then(() => {}));

await Deno.test("auth0cli handles login", () =>
  main(["login"], logger)
    .then(() => {}));

await Deno.test("auth0cli handles refresh", () =>
  main(["refresh"], logger)
    .then(() => {}));
