# html2md

A CLI tool and library that converts HTML to Markdown, optimised for providing
web content as context to LLMs.

## Quick commands

```bash
deno task ci          # full pipeline: fmt + lint + typecheck + test
deno task test        # tests only
deno task fmt         # auto-format all files
deno task lint        # lint
deno task check       # typecheck mod.ts + cli.ts
deno task install     # reinstall global `html2md` command
deno task publish     # publish to JSR
```

## Architecture

```
mod.ts          Library entry — exports convert(html, opts): ConvertResult
cli.ts          CLI entry — reads stdin, parses flags, calls mod.ts
mod_test.ts     Unit tests (deno test)
deno.json       Config, import map, tasks, JSR publish metadata
```

`mod.ts` is the public API surface. `cli.ts` is a thin wrapper around it.

## Code conventions

- Deno-native TypeScript; no Node APIs
- Import bare specifiers from `deno.json` import map only (no inline `npm:` or
  `jsr:` specifiers)
- `deno fmt` style enforced — run `deno task fmt` to fix
- `deno lint` enforced — no `deno-lint-ignore` unless genuinely unavoidable
- All exports in `mod.ts` must be documented with JSDoc
- Tests live in `mod_test.ts` — one `Deno.test` per behaviour, named
  `"topic: what it does"`

## Testing

```bash
deno task test
```

14 unit tests covering: frontmatter, reader mode, full mode, stripImages,
stripLinks, strikethrough, tables, code blocks, result shape.

## Dependencies

- `npm:turndown@7.2.2` — HTML → Markdown conversion
- `npm:@mozilla/readability@0.6.0` — reader-mode content extraction
- `npm:linkedom@0.18.10` — DOM parsing (no Node/jsdom required)
- `jsr:@std/assert@1.0.14` — test assertions

## Publishing

Before publishing, update the `version` field in `deno.json` and add a new entry
to `CHANGELOG.md`.

```bash
deno task publish-dry   # dry run
deno task publish       # publish to JSR (requires deno login)
```

Or push a version tag (`git tag v0.x.x && git push --tags`) to trigger the
GitHub Actions publish workflow.

## Session checkpoints (Entire)

This repo uses [Entire](https://entire.io) for AI session checkpoints. Hooks are
in `.claude/settings.json`. Use `entire rewind` to browse and restore
checkpoints. Use `entire status` to check state.
