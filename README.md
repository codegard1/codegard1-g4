# codegard1.com

Source for [codegard1.com](https://codegard1.com), Chris Odegard's personal site and dev blog.

Built with [Vite](https://vite.dev), [React](https://react.dev), [React Router](https://reactrouter.com),
and TypeScript as a static single-page application deployed on Netlify. The site was migrated from
Gatsby 4 (`676b49f`).

## Develop

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Script                  | What it does                                              |
| ----------------------- | --------------------------------------------------------- |
| `npm run build:content` | Generate `src/generated/content.json`, RSS, and sitemap   |
| `npm run build`         | Generate production content and build `dist/` with Vite   |
| `npm run preview`       | Serve the production `dist/` build locally                |
| `npm run typecheck`     | `tsc --noEmit`                                            |
| `npm run test:e2e`      | Playwright smoke test over routes (needs a build)         |
| `npm run format`        | Prettier                                                  |

## Content

### Blog posts

Each post is a folder under `content/blog/<slug>/` containing `index.md`. The folder name is the
URL: `content/blog/site-status/index.md` is served at `/site-status`.

```yaml
---
title: "Post title"
tags: ["powershell", "sharepoint"]
published: true
date: "2024-11-26"
---
```

- `published: false` hides a post from production builds (`npm run build`), while still showing it
  in `npm run dev`.
- Images that belong to a post go in `public/blog/<slug>/` and are referenced from the markdown as
  `./image.png`; `scripts/build-content.ts` rewrites the path.
- Code fences are highlighted at build time with Shiki. Raw HTML (for example SoundCloud or
  Spotify embeds) is allowed.
- Tags with spaces or capitals are fine; tag URLs are kebab-cased (`/blog/tags/command-line`).

### Galleries

Photos live in `public/gallery/{instagram,microscope,shoes}/`. Captions and dates for the
Instagram and Microscope galleries come from `content/data/instagram.json` and
`content/data/microscope.json` (matched by file name). Shoes needs no metadata; drop a JPG in the
folder.

### Music

`content/data/soundcloud.json` drives the release list on `/music`; artwork files live in
`public/gallery/music/`.

## Routes

| Route                              | Description                             |
| ---------------------------------- | --------------------------------------- |
| `/`                                | Seven most recent posts                 |
| `/<slug>`                          | A blog post                             |
| `/blog/<n>`                        | Paginated post list (`/blog` redirects) |
| `/blog/posts`                      | All posts                               |
| `/blog/tags`                       | All tags                                |
| `/blog/tags/<tag>`                 | Posts with a tag                        |
| `/blog/search?q=`                  | Client-side full-text search            |
| `/gallery/<collection>`            | Photo galleries                         |
| `/music`, `/blackjack`, `/contact` | Static pages                            |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Generated static files |

## Deploy

`netlify.toml` configures the build (`npm run build`, Node 22) and publishes `dist/` as static
files, with `public/_redirects` handling legacy redirects and SPA fallback routing.
