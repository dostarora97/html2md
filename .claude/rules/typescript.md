---
paths:
  - "mod.ts"
  - "mod_test.ts"
  - "cli.ts"
---

# TypeScript / Deno conventions

- All types must be explicit — no implicit `any`. Use
  `// deno-lint-ignore no-explicit-any` with a comment only when interfacing
  with untyped npm packages.
- Prefer `const` over `let`. Never use `var`.
- Use `for...of` or array methods over `for...in`.
- Async functions that read stdin should accumulate chunks and decode once at
  the end.
- Export only what belongs to the public API from `mod.ts`. Internal helpers are
  unexported.
- Never use `process.exit` — use `Deno.exit` with an appropriate exit code (0 =
  ok, 1 = usage error).
