# TODO

Things that require a human decision before this project is ready to publish.

## Before publishing to JSR

- [ ] **Choose your JSR scope** — replace every `@placeholder` occurrence with
      your actual JSR scope (e.g. `@yourname`). Affected files:
  - `deno.json` — package name
  - `mod.ts` — JSDoc `@example` import
  - `docs/README.md` — installation URL
  - `docs/api.md` — import example
  - `SECURITY.md` — JSR package link

- [ ] **Create the GitHub repo** — replace `<repo-url>` with the real URL.
      Affected files:
  - `CONTRIBUTING.md`
  - `docs/README.md`

- [ ] **Set your GitHub username** in `.github/CODEOWNERS` — replace
      `@placeholder` with your GitHub handle.
