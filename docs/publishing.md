# Publishing

## How it works

Pushing a `v*` tag triggers `.github/workflows/publish.yml`, which runs the full
CI pipeline then publishes to JSR via OIDC — no tokens or secrets needed. The
JSR package settings link this repo, so GitHub Actions is trusted automatically.

## Cutting a release

```bash
# 1. Bump version in deno.json and update CHANGELOG.md, then:
git add deno.json CHANGELOG.md
git commit -m "chore: release v0.2.0"
git tag v0.2.0
git push && git push origin v0.2.0
```

GitHub Actions takes it from there: CI → `deno publish` with provenance.

To preview what gets uploaded before tagging:

```bash
deno task publish-dry
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
