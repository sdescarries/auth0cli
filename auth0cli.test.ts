#!/usr/bin/env deno test --unstable --coverage --allow-env --allow-net --allow-read --allow-write

import { assertEquals } from "https://deno.land/std@0.76.0/testing/asserts.ts";
import { Hooks, main } from "./auth0cli.ts";

const lastLogs: string[] = [];
const lastErrors: string[] = [];

const hooks: Hooks = {
  log: (message: string) => lastLogs.push(message),
  error: (message: string) => lastErrors.push(message),
};

await Deno.test("empty command", async () => {
  await main([], hooks);
});

await Deno.test("bad command", async () => {
  await main(["foo"], hooks);
});

await Deno.test("machine with current config", async () => {
  const result = await main(["machine"], hooks);
});

await Deno.test("login with current config", async () => {
  const result = await main(["login"], hooks);
});

await Deno.test("refresh with current config", async () => {
  const result = await main(["refresh"], hooks);
});
