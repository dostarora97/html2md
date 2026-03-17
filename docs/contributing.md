# Contributing

## Prerequisites

- [Deno v2+](https://deno.land) — `curl -fsSL https://deno.land/install.sh | sh`
- [lefthook](https://github.com/evilmartians/lefthook) — `brew install lefthook`
- [mise](https://mise.jdx.dev) (optional) — pins the Deno version via
  `.mise.toml`

After cloning:

```bash
lefthook install          # wire up git hooks
deno install              # cache dependencies
deno task install         # install global html2md command (optional)
```

VS Code: install the **Deno** extension (`denoland.vscode-deno`) — prompted
automatically — and format-on-save works out of the box.

## Workflow

```bash
deno task test   # fast inner loop
deno task ci     # full pipeline: fmt + lint + doc:lint + check + test
```

The `pre-commit` hook runs `deno task ci` automatically.

## Adding a new conversion flag

Touch these five things in order:

1. **`mod.ts`** — add the option to `ConvertOptions` with JSDoc + `@default`,
   destructure it in `convert()`, and implement the behaviour in the appropriate
   `src/` module (`src/extract.ts`, `src/markdown.ts`, or `src/frontmatter.ts`)
2. **`cli.ts`** — add to the `parseArgs` config (`boolean`/`string`/`negatable`
   as appropriate), pass to `convert()`
3. **`mod_test.ts`** — at minimum: flag=true, flag=false (default)
4. **`docs/cli.md`** — add a usage example if the pattern is non-obvious
5. **`CHANGELOG.md`** — one line under `## [Unreleased]`

## Commits

[Conventional Commits](https://conventionalcommits.org) — enforced by the
`commit-msg` hook. Types: `feat` `fix` `docs` `refactor` `test` `chore` `ci`
`perf` `revert`.
