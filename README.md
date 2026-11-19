# SilverkeepStudiosSite

The Project Silverkeep website: a landing page, a devlog and the modding docs. It's a static [Astro](https://astro.build/) site with [Starlight](https://starlight.astro.build/) for the docs, deployed to GitHub Pages at https://breedurbin.github.io/SilverkeepStudiosSite/.

## Layout

| Path | What it is |
|---|---|
| `src/pages/index.astro` | Landing page |
| `src/pages/blog/` | Blog list and post pages |
| `src/content/blog/*.md` | Blog posts (`title`, `description`, `pubDate`, optional `draft: true`) |
| `src/content/docs/docs/` | Hand-written docs, served under `/docs/` |
| `src/content/docs/docs/reference/` | Generated reference pages (gitignored) |
| `src/layouts/BaseLayout.astro`, `src/styles/` | Shared layout, palette and fonts |

## Local development

Needs Node 22+ and Python 3.11+, with the Silverkeep repo checked out next to this one (`../Silverkeep`).

```bash
npm install
npm run docs:gen   # render the Silverscript, data format and console command reference from ../Silverkeep
                   # (or one of them: docs:gen:silverscript, docs:gen:data, docs:gen:console)
npm run dev        # http://localhost:4321/SilverkeepStudiosSite/
npm run build && npm run preview
```

The site builds without `docs:gen`: the generated groups are left out of the Silverscript and Data formats topics, and the Console commands topic (all generated) goes.

The docs have one sidebar per topic (Silverscript, Data formats, Console commands), picked with the switcher at the top of the sidebar ([starlight-sidebar-topics](https://github.com/HiDeoo/starlight-sidebar-topics)). The topics are in `astro.config.mjs`; a new docs page must belong to one, or the build fails. The docs home (`docs/index.md`) is a splash page with no sidebar that links to all three.

## How the docs get here

1. In Silverkeep, the `SilverkeepDocsExport` commandlet writes `Docs/Generated/silverscript_api.toml`, the `ConsoleCommandsExport` commandlet writes `Docs/Generated/console_commands.toml`, and the TOML schemas live in `Content/Data/Schemas/`.
2. Pushing any of them to Silverkeep's `main` runs its `Docs` workflow, which sends a `silverkeep-docs` event here.
3. `.github/workflows/deploy.yml` checks those folders out, runs the three renderers in `Tools/DocGen/` (`render_silverscript.py`, `render_data_formats.py`, `render_console_commands.py`) into `src/content/docs/docs/reference/<silverscript|data|console>/`, builds the site and deploys it. It also runs on every push to `main` here.

## One-time GitHub setup

1. This repo: **Settings → Pages → Source: GitHub Actions**.
2. Create a fine-grained token with **Contents: read** on `BreeDurbin/Silverkeep`, and add it here as the secret `SILVERKEEP_READ_TOKEN`.
3. Create a fine-grained token with **Contents: read and write** on this repo (GitHub requires that to send `repository_dispatch`), and add it to Silverkeep as the secret `SITE_DISPATCH_TOKEN`.

## Changing the URL

The base path `/SilverkeepStudiosSite` appears in `astro.config.mjs` (`base`), in the `docs:gen:*` scripts in `package.json`, and in the render steps of `deploy.yml`. Update all three if the site moves, e.g. to a custom domain.
