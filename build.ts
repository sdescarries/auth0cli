await Deno.mkdir("build", { recursive: true });

await Deno.run({
  cmd: [
    "deno",
    "bundle",
    "mod/client.ts",
    "index.ts",
  ],
}).status();

await Deno.run(
  {
    cmd: [
      "./node_modules/.bin/tsc",
      "--target",
      "es2020",
      "--lib",
      "es2020",
      "--module",
      "commonjs",
      "index.ts",
    ],
  },
).status();
