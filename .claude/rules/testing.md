---
paths:
  - "mod_test.ts"
---

# Testing conventions

- One `Deno.test` per behaviour — small and focused
- Name pattern: `"topic: what it does"` e.g.
  `"frontmatter: includes title by default"`
- Always use `@std/assert` helpers — `assertEquals`, `assertStringIncludes`,
  `assertMatch`
- Never use `--no-check`; all tests must type-check cleanly
- When adding a new `ConvertOptions` flag, add tests for: flag=true, flag=false
  (default), and interaction with reader/full mode if relevant
- Run `deno task test` to verify before committing
