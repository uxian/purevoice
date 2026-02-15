# Pure Voice Beta

## Beta site

This repo deploys a **beta** build from the `beta` branch to GitHub Pages at:

- https://uxian.github.io/purevoice/beta/

## How it works

- Push to `beta` → GitHub Actions runs `npm run check` and builds with base `/purevoice/beta/`.
- The output is deployed to GitHub Pages.

## Promote changes to beta

```bash
git checkout beta
# merge or cherry-pick from your work branch
npm run check
git push origin beta
```
