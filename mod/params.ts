#!/usr/bin/env deno run --allow-env --allow-read

import { dotEnvLoad } from "../deps/dotenv.ts";
import { toUnderscore } from "./helpers.ts";

const dotEnvConfig = dotEnvLoad();

export function loadOneConfig(key: string): string {
  const envKey = `AUTH_${toUnderscore(key).toLocaleUpperCase()}`;
  return dotEnvConfig[envKey] ?? Deno.env.get(envKey) ?? "";
}

export const audience: string = loadOneConfig("audience");
export const clientId: string = loadOneConfig("clientId");
export const clientSecret: string = loadOneConfig("clientSecret");
export const domain: string = loadOneConfig("domain");
export const password: string = loadOneConfig("password");
export const realm: string = loadOneConfig("realm");
export const username: string = loadOneConfig("username");

export default {
  audience,
  clientId,
  clientSecret,
  domain,
  password,
  realm,
  username,
};
