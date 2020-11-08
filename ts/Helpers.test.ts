#!/usr/bin/env deno test --unstable --coverage

import { assertEquals } from "https://deno.land/std@0.76.0/testing/asserts.ts";
import {
  convertToCamelCase,
  convertToUnderscore,
  toCamelCase,
  toUnderscore,
} from "./Helpers.ts";

Deno.test("toUnderscore", () => {
  const res = toUnderscore("fooIsTheNewBar");
  assertEquals(res, "foo_is_the_new_bar");
});

Deno.test("toCamelCase", () => {
  const res = toCamelCase("foo_is_the_new_bar");
  assertEquals(res, "fooIsTheNewBar");
});

Deno.test("convertToUnderscore", () => {
  const res = convertToUnderscore({ fooBar: "is baz" });
  assertEquals(res, { "foo_bar": "is baz" });
});

Deno.test("convertToCamelCase", () => {
  const res = convertToCamelCase({ "foo_bar": "is baz" });
  assertEquals(res, { fooBar: "is baz" });
});
