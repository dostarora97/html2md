# html2md

A CLI tool and Deno library that converts HTML to Markdown, optimised for
providing web content as context to LLMs.

## Orientation

Read these files to understand the project — they are the source of truth:

- @docs/README.md — overview, features, installation, quick-start examples
- @docs/architecture.md — internal data flow, the three dependencies, design
  decisions
- @docs/api.md — `convert()` function, all `ConvertOptions` fields, TypeScript
  types
- @docs/cli.md — all CLI flags, exit codes, usage examples
- @docs/contributing.md — setup, full workflow, how to add a new flag end-to-end
- @docs/publishing.md — JSR publishing, versioning policy, release workflow

## Quick commands

```bash
./scripts/bootstrap.sh  # first-time setup (installs deno, hooks, global command)
deno task ci            # full pipeline: fmt + lint + doc:lint + typecheck + test
deno task test          # tests only — no permissions needed, library is pure
deno task fmt           # auto-format all files
deno task coverage      # depends on test:coverage; outputs coverage/lcov.info
deno task coverage:html # depends on test:coverage; outputs coverage/html/
deno task test:doc      # test JSDoc @example blocks in mod.ts
deno task setup         # re-run bootstrap (idempotent)
deno task doc:gen       # generate HTML API docs into docs/api/
deno task outdated      # show outdated deps (native deno outdated)
deno task update        # update deps to compatible versions
deno task update:latest # update deps to latest
deno task install       # reinstall global `html2md` command
deno task publish-dry   # dry-run publish to see what would be uploaded
deno task publish       # publish to JSR
```

## File map

```
mod.ts          Public library API — exports convert(html, opts): ConvertResult
cli.ts          CLI entry — reads stdin, parses flags, calls mod.ts
mod_test.ts     14 unit tests (deno test)
deno.json       Config, import map, tasks, JSR publish metadata
lefthook.yml    Git hook definitions (pre-commit, commit-msg) — managed by lefthook
.mise.toml      Pinned tool versions (Deno 2.5.1)
package.json    npm script shims delegating to deno task (for Node user discoverability)
.gitattributes  LF line endings, linguist overrides
scripts/
  bootstrap.sh          First-time environment setup (Deno, mise, lefthook, Entire)
  hooks/pre-commit      Fallback hook (used when lefthook is unavailable)
  hooks/commit-msg      Fallback hook (used when lefthook is unavailable)
.claude/
  settings.json         Permissions + lint-on-save hook + Entire hooks
  rules/typescript.md   Deno/TS conventions (scoped to .ts files)
  rules/testing.md      Test naming + assertion rules (scoped to mod_test.ts)
  skills/release/       /release skill — bump version, tag, push
  agents/reviewer.md    read-only Sonnet reviewer subagent
.github/
  workflows/ci.yml          Lint + typecheck + test + coverage on push/PR
  workflows/publish.yml     JSR publish on git tag push
  workflows/release-drafter.yml  Auto-draft release notes
  dependabot.yml            Monthly npm dep bump PRs
  release-drafter.yml       Release notes categories config
  ISSUE_TEMPLATE/           Bug report and feature request forms
  pull_request_template.md  PR checklist
  CODEOWNERS                Code owners config
docs/                   Human + agent documentation (see Orientation above)
.vscode/                Format-on-save, Deno extension config
.editorconfig           Universal indentation and whitespace config
.entire/                AI session checkpoints (entire enable --agent claude-code)
LICENSE                 MIT
SECURITY.md             Vulnerability reporting policy
CONTRIBUTING.md         Quick-start redirect to docs/contributing.md
CODE_OF_CONDUCT.md      Contributor Covenant 2.1
```

## Code conventions (summary — full details in @docs/contributing.md)

- Deno-native TypeScript; no Node APIs (`process`, `require`, `__dirname`)
- Import bare specifiers from `deno.json` import map — no inline `npm:` or
  `jsr:` specifiers
- `deno fmt` style enforced — run `deno task fmt` to fix
- `deno lint` enforced — `deno-lint-ignore` only at npm interop boundaries
- All exports in `mod.ts` must have JSDoc (`deno task doc:lint` checks this)
- Tests: one `Deno.test` per behaviour, named `"topic: what it does"`
- Commits: Conventional Commits enforced by `commit-msg` hook

## Session checkpoints (Entire)

This repo uses [Entire](https://entire.io) for AI session checkpoints. Hooks are
wired in `.claude/settings.json`.

```bash
entire status           # check state
entire rewind           # browse and restore checkpoints interactively
entire rewind --list    # list checkpoints as JSON
```
