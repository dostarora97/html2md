---
paths:
  - "mod_test.ts"
---

# Testing conventions

- One `Deno.test` per behaviour — small and focused.
- Name pattern: `"topic: what it does"` e.g.
  `"frontmatter: includes title by default"`.
- Use `@std/assert` helpers (`assertEquals`, `assertStringIncludes`,
  `assertMatch`) — they give clearer failure messages than manual assertions.
- When adding a new `ConvertOptions` flag, cover at minimum: flag=true,
  flag=false (default), and any meaningful interaction with `reader` mode.
