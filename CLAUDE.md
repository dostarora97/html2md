# html2md

A CLI tool and Deno library that converts HTML to Markdown, optimised for
providing web content as context to LLMs.

## Orientation

Start here to understand the project:

- @docs/README.md — what it does, installation, quick usage
- @docs/architecture.md — data flow, dependency choices, design decisions
- @docs/api.md — how to import and use as a library
- @docs/cli.md — CLI usage patterns and frontmatter format
- @docs/contributing.md — prerequisites, workflow, how to add a new flag
- @docs/publishing.md — versioning, JSR publishing, release workflow

The three source files are the primary source of truth: `mod.ts` (library),
`cli.ts` (CLI entry point), `mod_test.ts` (tests). Read them directly — they are
small and self-documenting.

Tasks are defined in `deno.json` with descriptions — run `deno task --help` for
the full list. Coding conventions are in `.claude/rules/`.
