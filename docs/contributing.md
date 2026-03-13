# Contributing

Everything you need to go from zero to a merged pull request.

## Prerequisites

- **Deno v2+** — https://deno.land
- **Git**
- **lefthook** (git hooks manager) — `brew install lefthook` or
  https://github.com/evilmartians/lefthook
- **mise** (tool version manager, optional) — `brew install mise` or
  https://mise.jdx.dev
- **Entire** (optional, for AI session checkpoints) — https://entire.io

## First-time setup

Run the bootstrap script. It checks / installs Deno and Entire, installs the
`html2md` global command, wires up git hooks, and caches dependencies:

```bash
git clone <repo-url> html2md
cd html2md
./scripts/bootstrap.sh
```

That's it. The script is idempotent — safe to re-run.

### What the bootstrap does

1. Checks for Deno; installs it if missing
2. Checks for Git (fatal if absent)
3. Runs `mise install` to activate the pinned Deno version (if mise is
   installed)
4. Installs Entire if missing (non-fatal)
5. Runs `lefthook install` to wire up git hooks; falls back to manual copy if
   lefthook is absent
6. Runs `deno task install` to install the global `html2md` command
7. Runs `deno cache` to warm up the module cache

### VS Code

Open the project folder — VS Code will prompt to install the **Deno** extension
(`denoland.vscode-deno`). Settings are pre-configured in
`.vscode/settings.json`: format-on-save, lint-as-you-type, correct formatter.

## Development workflow

```bash
deno task test        # run unit tests
deno task ci          # full pipeline (fmt + lint + doc:lint + typecheck + test)
deno task fmt         # auto-format
deno task lint        # lint only
deno task check       # typecheck only
deno task coverage    # run tests with coverage → coverage/lcov.info
```

Tests run in under a second — `deno task test` is your inner loop.

## How to add a new conversion flag

This is the most common change. Here is the complete checklist:

### 1. Add the option to `ConvertOptions` in `mod.ts`

```ts
/**
 * Your new flag description.
 * @default false
 */
myNewFlag?: boolean;
```

### 2. Implement the logic in `convert()`

Destructure the new option with its default, then use it:

```ts
const { ..., myNewFlag = false } = opts;
// ... use myNewFlag where appropriate
```

### 3. Add a CLI flag in `cli.ts`

In `parseArgs()`:

```ts
case "--my-new-flag":
  result.myNewFlag = true;
  break;
```

Add it to the `flags` result type and the `convert()` call.

### 4. Update `--help` text in `cli.ts`

Add a line to the `OPTIONS` section.

### 5. Write tests in `mod_test.ts`

- `"myNewFlag: does X when flag is set"`
- `"myNewFlag: default behaviour without flag"`

Follow the naming pattern `"topic: what it does"`.

### 6. Update docs

- `docs/cli.md` — add to the options table and add an example
- `docs/api.md` — add to the `ConvertOptions` table

### 7. Add a CHANGELOG entry

Under `## [Unreleased]` → `### Added`:

```markdown
- `--my-new-flag`: description of what it does
```

### 8. Run CI

```bash
deno task ci
```

All 14+ tests should pass, fmt/lint/typecheck should be clean.

## Commit message format

This project uses [Conventional Commits](https://conventionalcommits.org). The
`commit-msg` git hook enforces this.

```
<type>(<optional scope>): <description>
```

Valid types: `feat` `fix` `docs` `style` `refactor` `test` `chore` `ci` `build`
`perf` `revert`

Examples:

```
feat: add --strip-tables flag
fix(cli): handle empty stdin gracefully
docs: update cli.md with new flags
chore(deps): bump turndown to 7.2.3
test: add coverage for stripImages in reader mode
```

## Pre-commit hook

The `pre-commit` hook runs `deno task ci` before every commit. If CI fails the
commit is blocked. Fix the issue and retry. To bypass in an emergency:
`git commit --no-verify` (not recommended).

## Project structure

```
mod.ts              Public library API — convert(html, opts)
cli.ts              CLI wrapper — stdin → stdout
mod_test.ts         Unit tests
deno.json           Config, import map, all tasks
CLAUDE.md           Claude Code project memory
docs/               Human + agent readable documentation
  README.md         Overview and quick start
  cli.md            CLI flag reference
  api.md            TypeScript API reference
  architecture.md   Internal design and data flow
  contributing.md   This file
  publishing.md     Release and JSR publishing guide
.claude/            Claude Code configuration
  settings.json     Permissions, hooks (Entire + lint-on-save)
  rules/            Path-scoped coding conventions
  skills/release/   /release skill for cutting versions
  agents/reviewer   Read-only code review subagent
scripts/
  bootstrap.sh      One-shot environment setup
  hooks/pre-commit  Runs CI before commits
  hooks/commit-msg  Enforces conventional commits
.github/
  workflows/ci.yml          Lint + test on push/PR
  workflows/publish.yml     JSR publish on version tag
  workflows/release-drafter.yml  Auto-draft release notes
  dependabot.yml            Monthly npm dep bumps
  release-drafter.yml       Release notes config
.vscode/            VS Code settings (format on save, Deno extension)
.editorconfig       Universal editor settings
```
