# SilverkeepStudiosSite

The Project Silverkeep website. It has three parts:
- a landing page;
- a devlog;
- the modding documentation, much of it generated straight from the game.

It's a static [Astro](https://astro.build/) site that uses [Starlight](https://starlight.astro.build/) for the docs and the devlog. It deploys to GitHub Pages at **https://breedurbin.github.io/SilverkeepStudiosSite/**.

- [What's on the site](#whats-on-the-site)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Writing a devlog post](#writing-a-devlog-post)
- [Writing a docs page](#writing-a-docs-page)
- [The generated reference](#the-generated-reference)
- [Styling and theme](#styling-and-theme)
- [Deployment](#deployment)
- [Changing the URL](#changing-the-url)
- [Troubleshooting](#troubleshooting)

---

## What's on the site

| Page | URL | What it is | Built from |
|---|---|---|---|
| Landing page | `/` | Hero with links to the devlog and docs, the modding and multiplayer pitch with a sample script, and the three latest devlog posts | `src/pages/index.astro` with `BaseLayout` |
| Devlog | `/blog/` | Paged post list (5 per page) with excerpts, reading time and a sidebar of recent posts and tags | [starlight-blog](https://starlight-blog-docs.vercel.app/) |
| Devlog post | `/blog/<slug>/` | One post, with date, reading time, tags and previous/next links | `src/content/docs/blog/<slug>.md(x)` |
| Tag pages | `/blog/tags/<tag>/` | Every post with that tag. Created automatically once a post uses `tags` | starlight-blog |
| RSS feed | `/blog/rss.xml` | The devlog feed. Its only link is the RSS icon beside the site title in the docs and blog header; every docs page's `<head>` also advertises it to feed readers | starlight-blog |
| Docs redirect | `/docs/` | No page of its own: redirects to the Silverscript getting-started page, where every Docs link goes | `redirects` in `astro.config.mjs` |
| Silverscript topic | `/docs/silverscript/…`, `/docs/reference/silverscript/…` | Getting started, then the generated API reference: one page per API namespace, plus types, enums, globals and containers | Hand-written page plus generated pages |
| Data formats topic | `/docs/data/…`, `/docs/reference/data/…` | Data files overview, then one generated page per TOML data format, each with a downloadable schema | Hand-written page plus generated pages |
| Console commands topic | `/docs/reference/console/…` | One generated page per custom console command | Generated pages only |
| Schemas | `/schemas/<name>.schema.toml` | The game's TOML Schema files, linked from each data format page | Copied into `public/schemas/` by the data format renderer |
| 404 | any missing page | Starlight's not-found page | Starlight |

**Features across the site**
- **Search.** The search box in the docs header searches every docs page and every devlog post ([Pagefind](https://pagefind.app/), built in by Starlight). The landing page isn't indexed.
- **Sidebar topics.** Each docs topic has its own sidebar, switched at the top of the sidebar ([starlight-sidebar-topics](https://github.com/HiDeoo/starlight-sidebar-topics)). Devlog pages use the blog's sidebar instead.
- **Light and dark themes.** Both use the game's palette.
  - The landing page has its own toggle; the docs and devlog use Starlight's theme picker.
  - Both read and write the same `starlight-theme` key in local storage, so the choice carries across the whole site.
  - With nothing chosen, the site follows the system setting.
- **Code highlighting.** [Expressive Code](https://expressive-code.com/) (built into Starlight) highlights code in docs and posts; the landing page uses Astro's `<Code>`. Script samples are marked `cpp`, because there's no AngelScript grammar yet.
- **Sitemap.** `sitemap-index.xml` is generated at build time (built in by Starlight).
- **Link previews and metadata.**
  - Every page has a title, description, canonical URL and Open Graph tags.
  - Devlog posts also carry structured data that marks them as blog posts for search engines (starlight-blog).
  - No page has a preview image yet.
- **Header navigation.**
  - Landing page: Home, Blog and Docs, plus the theme toggle.
  - Docs and devlog: on the left, the site title and the devlog's RSS icon; in the middle, search; on the right, Home, Blog and Docs (styled like the landing page's links, the current section highlighted), then the theme picker. On narrow screens, where Starlight hides the right-hand side, Home, Blog and Docs move beside the RSS icon and the title text is hidden to make room.

---

## Tech stack

| Package | Version | Role |
|---|---|---|
| `astro` | 7.4 | Static site generator |
| `@astrojs/starlight` | 0.42 | Docs framework. It also brings Pagefind search, the sitemap, MDX and Expressive Code |
| `starlight-blog` | 0.30 | The devlog: post list, tags, RSS, reading time |
| `starlight-sidebar-topics` | 0.9 | One sidebar per docs topic |
| Python | 3.11+ | The reference renderers in the Silverkeep repo (`Tools/DocGen`, standard library only) |

Node 22+ is required (CI uses 22).

---

## Project structure

```
SilverkeepStudiosSite/
├── astro.config.mjs            Site config: URL and base path, Starlight, the plugins, docs topics
├── package.json                Dependencies and scripts (dev, build, preview, docs:gen*)
├── tsconfig.json               Astro's strict TypeScript preset
├── .github/workflows/
│   └── deploy.yml              Generates the reference, builds and deploys to GitHub Pages
├── public/                     Copied to the site as-is
│   ├── favicon.svg             Favicon, also the header logo
│   └── schemas/                (generated, gitignored) downloadable TOML schemas
└── src/
    ├── content.config.ts       The docs collection: Starlight's schema extended with starlight-blog's frontmatter
    ├── components/
    │   ├── SiteLinks.astro             Home, Blog and Docs links for the docs and blog header
    │   ├── StarlightSiteTitle.astro    Header left: site title, RSS icon (and the links on narrow screens)
    │   └── StarlightSocialIcons.astro  Header right, before the theme picker: the links on wider screens
    ├── routeData.ts            Starlight route middleware: drops starlight-blog's RSS link from the blog sidebar
    ├── layouts/
    │   └── BaseLayout.astro    The landing page's layout: head metadata, header, footer, theme toggle
    ├── pages/
    │   └── index.astro         Landing page
    ├── styles/
    │   ├── fonts.css           Cinzel display font (Google Fonts) as --font-display
    │   ├── site.css            Landing page palette and styles
    │   └── starlight.css       Starlight's colours mapped to the palette, Cinzel headings
    └── content/docs/           Everything Starlight renders; the path below it is the URL
        ├── blog/               Devlog posts → /blog/<file name>/
        └── docs/               Docs → /docs/…
            ├── silverscript/   Hand-written Silverscript guides
            ├── data/           Hand-written data format guides
            └── reference/      (generated, gitignored) silverscript/, data/, console/
```

`dist/`, `.astro/` and `node_modules/` are build output and caches, and are gitignored.

---

## Local development

**You need:**
- Node 22+;
- Python 3.11+;
- the Silverkeep repo checked out next to this one, as `../Silverkeep`. The `docs:gen` scripts read it from there.

```bash
npm install
npm run docs:gen        # render all three reference topics from ../Silverkeep
npm run dev             # http://localhost:4321/SilverkeepStudiosSite/ (reloads as you edit)
npm run build           # production build into dist/ (also builds the search index and sitemap)
npm run preview         # serve dist/ locally
```

| Script | What it does |
|---|---|
| `dev` | Dev server. Shows draft posts |
| `build` | Static build into `dist/`. Leaves drafts out |
| `preview` | Serves the last build |
| `docs:gen` | Runs the three renderers below |
| `docs:gen:silverscript` | Silverscript API reference → `src/content/docs/docs/reference/silverscript/` |
| `docs:gen:data` | Data format reference → `src/content/docs/docs/reference/data/`, schemas → `public/schemas/` |
| `docs:gen:console` | Console command reference → `src/content/docs/docs/reference/console/` |

The site builds without `docs:gen`:
- the generated groups are left out of the Silverscript and Data formats topics;
- the Console commands topic, which is all generated, is left out entirely.

That makes it quick to work on the landing page or the devlog.

Search only works in a build (`npm run build && npm run preview`), not in `npm run dev`.

---

## Writing a devlog post

Create `src/content/docs/blog/<slug>.md`. The file name becomes the URL (`/blog/<slug>/`), so use lowercase words separated by hyphens.

```markdown
---
title: Spellbooks and resting
description: How prepared spells, slots and resting work, and why.
date: 2026-11-21
tags:
  - Magic
  - Design
---

The opening paragraph or two, which the blog list shows as the post's preview.

<!-- excerpt -->

## The rest of the post

…
```

### Frontmatter

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Post title on the page, the list, the feed and link previews |
| `date` | yes | Publication date (`YYYY-MM-DD`). Posts are sorted newest first |
| `description` | recommended | Used in link previews (Discord, Bluesky, …), search results and the RSS feed |
| `tags` | no | List of tags, shown on the post and the list. Each tag gets a page under `/blog/tags/` |
| `excerpt` | no | Preview text for the blog list (basic Markdown). Overrides the `<!-- excerpt -->` line |
| `draft` | no | `true` keeps the post out of the build. It still shows in `npm run dev`, on the blog and on the landing page |
| `featured` | no | `true` lists the post under "Featured posts" at the top of the blog sidebar |
| `cover` | no | Image at the top of the post: `{ alt: "…", image: ./cover.png }`, or separate `dark` and `light` images |
| `lastUpdated` | no | A date shown beside the publication date when the post is revised |
| `authors` | no | Post authors. Configure them in `starlightBlog({ authors })` in `astro.config.mjs` first |

**The excerpt.** The blog list shows each post's excerpt, taken from the first of these that exists:
1. the `excerpt` field;
2. everything above a `<!-- excerpt -->` line (`{/* excerpt */}` in MDX);
3. the whole post.

Always add one of the first two. The text above the line must make sense on its own.

**The landing page** shows the three newest posts, with their `title`, `date` and `description`.

### Images

Put screenshots next to the post, or in a folder of their own, and use relative paths. Astro resizes them, converts them to modern formats and adds sizes at build time:

```markdown
![The spellbook panel](./spellbooks/panel.png)
```

Files in `public/` are served untouched at `/SilverkeepStudiosSite/<path>`. Use that only for files that shouldn't be processed, such as downloads.

### Code

Fenced code blocks support titles, highlighted lines and diff markers:

````markdown
```cpp title="Content/Angelscripts/Guard_OnHeartbeat.as" {3}
void OnHeartbeat(FEntityId Self)
{
    Log::Info("Keeping watch.");
}
```
````

### MDX

Name the file `.mdx` to use components inside the post, for example Starlight's:

```mdx
import { Aside, Tabs, TabItem } from '@astrojs/starlight/components';

<Aside type="caution">This changes in the next build.</Aside>
```

Starlight's notes and warnings also work in plain Markdown:

```markdown
:::note
Only the host can do this.
:::
```

### Links

Astro doesn't add the `/SilverkeepStudiosSite` base path to links in Markdown. Use either:
- **a relative link**, such as `[the docs](../../docs/silverscript/getting-started/)`;
- **a full path** that includes the base, such as `/SilverkeepStudiosSite/docs/silverscript/getting-started/`.

A plain `/docs/…` path points outside the site.

---

## Writing a docs page

Hand-written docs go in `src/content/docs/docs/<topic folder>/`. The path is the URL: `docs/silverscript/getting-started.md` is served at `/docs/silverscript/getting-started/`.

```markdown
---
title: Getting started with Silverscript
description: Where scripts live, how creatures run them, and a first script.
sidebar:
  label: Silverscript basics   # shorter name for the sidebar (optional)
  order: 1                     # position in an autogenerated group (optional)
---
```

**Every docs page must belong to a topic, or the build fails.** The topics are the `topics` array in `astro.config.mjs`. To add a page:
1. Create the file.
2. Add its path without the extension (e.g. `'docs/silverscript/scripting-items'`) to the right topic's `items`.

Pages under `/blog/` are left out of every topic.

**To add a topic,** add an entry with a `label`, the `link` to its first page, an `icon` ([Starlight icon names](https://starlight.astro.build/reference/icons/)) and its `items`. The topic switcher at the top of the sidebar lists it automatically.

Starlight's [frontmatter reference](https://starlight.astro.build/reference/frontmatter/) and [components](https://starlight.astro.build/components/using-components/) apply to docs pages. The same goes for code blocks, MDX and the base path rule for links described under [Writing a devlog post](#writing-a-devlog-post).

---

## The generated reference

Three reference topics are generated from the Silverkeep repo. Their pages are never edited by hand, and they're gitignored here.

| Topic | Source in Silverkeep | Renderer (`Tools/DocGen/`) | Output here |
|---|---|---|---|
| Silverscript API | `Generated_Documentation/silverscript_api.toml`, written by the `DocsExport` commandlet from the AngelScript bindings and their doc comments | `render_silverscript.py` | `reference/silverscript/` |
| Data formats | `Content/Data/Schemas/*.schema.toml` (hand-written TOML Schemas) | `render_data_formats.py` | `reference/data/` and `public/schemas/` |
| Console commands | `Generated_Documentation/console_commands.toml`, written by the `ConsoleCommandsExport` commandlet from every `UFUNCTION(Exec)` | `render_console_commands.py` | `reference/console/` |

**How the renderers work**
- Each renderer empties its output folder before writing.
- It writes a `.generated-by-docgen` marker into the folder, and refuses to write into a folder without one, so it can't wipe hand-written pages.
- Links between generated pages are full paths that include the base path (the `--link-base` argument).

**To change what the reference says,** change the game, not this repo:
- Silverscript: the doc comments on the API and the script-visible structs and enums.
- Data formats: the schemas.
- Console commands: the `Exec` functions' doc comments.

Then rerun the commandlet and commit the export. `Tools/DocGen/README.md` in Silverkeep covers how to write those comments, and the specs that fail while an export is out of date.

**How a change reaches the site**
1. A push to Silverkeep's `main` that touches `Generated_Documentation/`, `Content/Data/Schemas/` or `Tools/DocGen/` runs Silverkeep's `Docs` workflow.
2. That workflow checks the schemas parse and tests the renderers.
3. It then sends a `silverkeep-docs` event to this repo.
4. That event runs `deploy.yml` here, which regenerates the reference and redeploys.

---

## Styling and theme

- **Palette.** The game's sepia palette:
  - dark: charcoal backgrounds, sepia panels, parchment text, antique gold accents;
  - light: ivory backgrounds, sepia text, burgundy accents.
- **Where the colours are set.**
  - The landing page's colours are CSS variables in `src/styles/site.css` (`--bg`, `--panel`, `--text`, `--accent`, …), per `data-theme`.
  - The docs and devlog map the same colours onto Starlight's variables in `src/styles/starlight.css`.
  - Change a colour in both files.
- **Fonts.**
  - Headings use Cinzel, the game's display face, loaded from Google Fonts in `src/styles/fonts.css` and exposed as `--font-display`.
  - Body text uses the system font.
- **Component styles.** Landing page sections are styled in `index.astro`'s own `<style>` block. Shared pieces (buttons, eyebrow labels, section titles, header, footer) are in `site.css`.
- **Starlight overrides.** `astro.config.mjs` sets `customCss` (the two Starlight style files) replaces Starlight's `SiteTitle` and `SocialIcons` components with `StarlightSiteTitle.astro` and `StarlightSocialIcons.astro`, and adds `src/routeData.ts` as route middleware. starlight-blog's own header link is turned off (`navigation: 'none'`).
  - starlight-blog overrides `MarkdownContent`.
  - starlight-sidebar-topics overrides `Sidebar`.
  - Don't override `MarkdownContent` or `Sidebar` yourself without building on the plugins' versions.

---

## Deployment

`.github/workflows/deploy.yml` builds and deploys the site.

**It runs on:**
- every push to `main`;
- a `silverkeep-docs` event from Silverkeep;
- a manual run (Actions → Deploy → Run workflow).

**What it does:**
1. Checks out this repo, plus a sparse checkout of Silverkeep's `Generated_Documentation`, `Content/Data/Schemas` and `Tools/DocGen`.
2. Runs the three renderers with Python 3.12.
3. Runs `npm ci` and `npm run build` with Node 22.
4. Uploads `dist/` and deploys it to GitHub Pages.

### One-time GitHub setup

1. In this repo: **Settings → Pages → Source: GitHub Actions**.
2. Create a fine-grained token with **Contents: read** on `BreeDurbin/Silverkeep`, and add it here as the secret `SILVERKEEP_READ_TOKEN`.
3. Create a fine-grained token with **Contents: read and write** on this repo (GitHub requires that to send `repository_dispatch`), and add it to Silverkeep as the secret `SITE_DISPATCH_TOKEN`.

---

## Changing the URL

The site is served from the repo's GitHub Pages path, `/SilverkeepStudiosSite`. That path appears in:
- `astro.config.mjs`: `site`, `base` and the `/docs` redirect's destination;
- `package.json`: the `--link-base` and `--schema-url-base` arguments of the `docs:gen:*` scripts;
- `.github/workflows/deploy.yml`: the same arguments in the render steps;
- hand-written content that links with full paths.

Update all of them if the site moves, for example to a custom domain, which would use `base: '/'`.

---

## Troubleshooting

| Problem | Cause and fix |
|---|---|
| Build fails saying a page doesn't belong to any topic | A new docs page isn't in the `topics` array in `astro.config.mjs`. Add it to a topic (see [Writing a docs page](#writing-a-docs-page)) |
| The reference or Console commands topic is missing locally | Run `npm run docs:gen`. It needs `../Silverkeep` |
| A renderer refuses to write its output folder | The folder has no `.generated-by-docgen` marker, so the renderer won't empty it. Move any hand-written files out, delete the folder and rerun |
| A link works in dev but 404s on the live site, or the reverse | The link is missing the `/SilverkeepStudiosSite` base path. Use a relative link or the full path |
| A post doesn't appear | It has `draft: true`, a bad `date`, or isn't in `src/content/docs/blog/`. Drafts only show in `npm run dev` |
| The blog list shows a whole post | Add an `excerpt` field or a `<!-- excerpt -->` line |
| Search finds nothing in dev | Search is built at build time. Use `npm run build && npm run preview` |
| A frontmatter error on build | A field has the wrong type, e.g. a date that isn't `YYYY-MM-DD`. The error names the file and the field |
