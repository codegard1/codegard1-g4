# codegard1.com

Source for [codegard1.com](https://codegard1.com), Chris Odegard's personal site and dev blog.

Built with [Next.js](https://nextjs.org) (App Router, TypeScript, React Server Components) and
deployed on Netlify. The site was migrated from Gatsby 4 in 2026; the last Gatsby version is
commit `676b49f` (tagged locally as `v0.3.0-gatsby`).

## Develop

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run build`     | Production build                                          |
| `npm start`         | Serve the production build                                |
| `npm run lint`      | ESLint                                                    |
| `npm run typecheck` | `tsc --noEmit`                                            |
| `npm run test:e2e`  | Playwright smoke test over every route (needs a build)    |
| `npm run format`    | Prettier                                                  |

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

- `published: false` hides a post from production builds (it still renders in `next dev`).
- Images that belong to a post go in `public/blog/<slug>/` and are referenced from the markdown as
  `./image.png`; the build rewrites the path.
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

| Route                    | Description                              |
| ------------------------ | ---------------------------------------- |
| `/`                      | Seven most recent posts                  |
| `/<slug>`                | A blog post                              |
| `/blog/<n>`              | Paginated post list (`/blog` redirects)  |
| `/blog/posts`            | All posts                                |
| `/blog/tags`             | All tags                                 |
| `/blog/tags/<tag>`       | Posts with a tag                         |
| `/blog/search?q=`        | Server-rendered full-text search         |
| `/gallery/<collection>`  | Photo galleries                          |
| `/music`, `/blackjack`, `/contact` | Static pages                   |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Generated |

## Deploy

`netlify.toml` configures the build (`npm run build`, Node 22) and the Netlify Next.js runtime,
which provides server rendering for the search page and on-demand image optimization. Every other
route is pre-rendered at build time.
