import { assertEquals } from "../deps/asserts.ts";
import {
  convertToCamelCase,
  convertToUnderscore,
  toCamelCase,
  toUnderscore,
  validateParams,
} from "../mod/helpers.ts";

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

Deno.test("validateParams success", () => {
  const res = validateParams({ foo: "foo", bar: "bar" });
  assertEquals(res, []);
});

Deno.test("validateParams failure", () => {
  const res = validateParams({ foo: undefined, bar: "" });
  assertEquals(res.length, 2);
});
