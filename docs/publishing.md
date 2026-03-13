# Publishing

## First-time setup

1. Create an account at [jsr.io](https://jsr.io) and replace `@placeholder` in
   `deno.json` with your scope
2. `deno login` (opens browser)

## Cutting a release

```bash
/release 0.2.0   # Claude Code skill: CI → bump version → update CHANGELOG → commit → tag → push
```

Or manually: bump `"version"` in `deno.json`, update `CHANGELOG.md`, commit as
`chore: release v0.2.0`, tag `v0.2.0`, push. The `.github/workflows/publish.yml`
workflow picks up the tag and runs `deno publish` via OIDC — no API key needed.

```bash
deno task publish-dry   # preview what gets uploaded before committing
```

## Versioning

Follows [semver](https://semver.org). Until v1.0.0, minor bumps may break.

| Change                                       | Bump    |
| -------------------------------------------- | ------- |
| New flag or option                           | `0.x.0` |
| Bug fix, internal change                     | `0.0.x` |
| Breaking change to `ConvertOptions`/`Result` | `x.0.0` |

## Dependencies

Dependabot opens monthly PRs for npm deps. To update manually:

```bash
deno task outdated       # what's stale
deno task update         # update to latest compatible
deno task update:latest  # update to latest (may break)
```
