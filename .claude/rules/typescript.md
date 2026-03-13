---
paths:
  - "mod.ts"
  - "mod_test.ts"
  - "cli.ts"
---

# TypeScript / Deno conventions

- Prefer explicit types on public API boundaries; internal helpers can rely on
  inference where it's clear.
- Use `const` over `let`. `var` has no place in modern TypeScript.
- Use `for...of` or array methods rather than `for...in`.
- When reading stdin, accumulate `Uint8Array` chunks with `for await` and decode
  once at the end — avoids splitting UTF-8 codepoints at chunk boundaries.
- Export only what belongs to the public API from `mod.ts`. Internal helpers
  stay unexported.
- Use `Deno.exit` with an appropriate exit code. `process` is a Node API and
  does not exist in Deno.
