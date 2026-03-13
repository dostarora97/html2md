---
name: release
description: Cut a new release — bump version, update CHANGELOG, tag, and publish to JSR. Use when asked to release or publish a new version.
disable-model-invocation: true
allowed-tools: Read, Edit, Bash(git *), Bash(deno *)
---

Cut a new release for html2md. Version argument: $ARGUMENTS (e.g. `0.2.0`).

## Steps

1. **Verify CI is green first**
   ```
   deno task ci
   ```
   Stop if anything fails.

2. **Bump version in `deno.json`** Update `"version"` field to `$ARGUMENTS`.

3. **Update CHANGELOG.md**
   - Move items from `[Unreleased]` into a new
     `## [$ARGUMENTS] - <today's date>` section.
   - Leave an empty `## [Unreleased]` section at the top.

4. **Commit**
   ```
   git add deno.json CHANGELOG.md
   git commit -m "chore: release v$ARGUMENTS"
   ```

5. **Tag**
   ```
   git tag v$ARGUMENTS
   ```

6. **Confirm before pushing** Show the user the tag and ask for confirmation
   before running `git push --tags`. The GitHub Actions `publish.yml` workflow
   will publish to JSR automatically on tag push.
