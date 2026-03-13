# Publishing

How to cut a release and publish to JSR.

## Before your first publish

1. Create an account at [jsr.io](https://jsr.io)
2. Replace `@placeholder` in `deno.json` with your JSR username:
   ```json
   "name": "@yourname/html2md"
   ```
3. Create the package on JSR (first publish does this automatically)
4. Log in: `deno login` (opens browser)

## Cutting a release

Use the built-in `/release` skill (requires Claude Code):

```
/release 0.2.0
```

The skill will:

1. Run `deno task ci` — stops if anything fails
2. Bump `"version"` in `deno.json`
3. Move `[Unreleased]` items in `CHANGELOG.md` to `[0.2.0] - <date>`
4. Commit: `chore: release v0.2.0`
5. Tag: `v0.2.0`
6. Ask for confirmation before pushing

Or do it manually:

```bash
# 1. Verify CI is green
deno task ci

# 2. Bump version
#    Edit "version" in deno.json

# 3. Update CHANGELOG.md
#    Move [Unreleased] items to a new [0.2.0] section

# 4. Commit and tag
git add deno.json CHANGELOG.md
git commit -m "chore: release v0.2.0"
git tag v0.2.0

# 5. Push (triggers GitHub Actions publish workflow)
git push && git push --tags
```

## What happens on tag push

The `.github/workflows/publish.yml` workflow fires:

1. Checks out the code
2. Sets up Deno v2.x
3. Runs `deno task ci` (full checks again)
4. Runs `deno publish` using OIDC (no API key needed — GitHub Actions
   authenticates automatically via `id-token: write` permission)

The package appears on
[jsr.io/@placeholder/html2md](https://jsr.io/@placeholder/html2md) within a
minute.

## Manual publish (local)

```bash
deno task publish-dry   # dry run — shows what would be published
deno task publish       # publish (requires deno login)
```

## Versioning policy

This project follows [Semantic Versioning](https://semver.org):

| Change                                                 | Version bump    |
| ------------------------------------------------------ | --------------- |
| New CLI flag or option                                 | `0.x.0` (minor) |
| Bug fix, internal change                               | `0.0.x` (patch) |
| Breaking change to `ConvertOptions` or `ConvertResult` | `x.0.0` (major) |

Until v1.0.0, minor bumps may include breaking changes per semver spec.

## Release notes

Release notes are auto-drafted by the
[release-drafter](https://github.com/release-drafter/release-drafter) GitHub
Action whenever a commit lands on `main`. When you push a tag, edit the draft
release on GitHub and publish it.

The drafter categorises commits by conventional commit prefix:

- `feat:` → ✨ Features
- `fix:` → 🐛 Bug Fixes
- `chore(deps):` → 📦 Dependencies
- `docs:`, `chore:`, `refactor:` → 🔧 Maintenance

## Dependency updates

[Dependabot](https://docs.github.com/dependabot) opens monthly PRs to bump npm
dependencies (`turndown`, `@mozilla/readability`, `linkedom`).

To manually check for updates:

```bash
deno task upgrade
```

This runs [udd](https://github.com/hayd/deno-udd) to check and update import
specifiers in `mod.ts`, `cli.ts`, and `mod_test.ts`.
