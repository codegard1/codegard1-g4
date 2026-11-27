import fs from "node:fs/promises";
import path from "node:path";
import { Feed } from "feed";
import matter from "gray-matter";
import type { Element, Root as HastRoot } from "hast";
import type { Root as MdastRoot } from "mdast";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkSmartypants from "remark-smartypants";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { site } from "../src/config/site";
import { formatIsoDate, formatLongDate, kebabCase, parseDate } from "../src/utils/format";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const DATA_DIR = path.join(ROOT, "content", "data");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_FILE = path.join(ROOT, "src", "generated", "content.json");

const EXCERPT_LENGTH = 300;
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
const includeDrafts = process.env.NODE_ENV !== "production";

interface Frontmatter {
  title?: string;
  description?: string;
  date?: string | Date;
  tags?: string[] | string | null;
  published?: boolean;
}

export interface PostData {
  slug: string;
  title: string;
  description?: string;
  dateIso: string;
  dateLong: string;
  dateTimestamp: number;
  tags: string[];
  published: boolean;
  excerpt: string;
  html: string;
  searchText: string;
}

export interface GalleryPhoto {
  src: string;
  title: string | null;
  timestamp: string | null;
  dateLabel: string | null;
  alt: string;
}

export interface Release {
  title: string;
  artist: string;
  releaseDate: string | null;
  url: string | null;
  artwork: string | null;
  tracks: { title: string; url: string | null }[];
}

function remarkRewriteRelativeUrls(options: { base: string }) {
  return (tree: MdastRoot) => {
    visit(tree, ["image", "link", "definition"], (node) => {
      if (!("url" in node) || typeof node.url !== "string") return;
      const url = node.url;
      if (url.startsWith("./")) {
        node.url = `${options.base}/${url.slice(2)}`;
      } else if (!/^(?:[a-z]+:|\/|#)/i.test(url)) {
        node.url = `${options.base}/${url}`;
      }
    });
  };
}

function rehypeMediaAttributes() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img") {
        node.properties.loading ??= "lazy";
        node.properties.decoding ??= "async";
      }
      if (node.tagName === "iframe") {
        node.properties.loading ??= "lazy";
      }
    });
  };
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
  defaultLang: "plaintext",
};

async function renderMarkdown(markdown: string, assetBase: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRewriteRelativeUrls, { base: assetBase })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeMediaAttributes)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

async function markdownToPlainText(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  return String(file)
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function pruneText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function normalizeTags(tags: Frontmatter["tags"]): string[] {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return [...new Set(list.map((t) => String(t).trim()).filter(Boolean))];
}

async function loadPosts(): Promise<(PostData & { rawBody: string; date: Date })[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const results = await Promise.all(
    entries
      .filter((e) => e.isDirectory())
      .map(async (e) => {
        const slug = e.name;
        const file = path.join(BLOG_DIR, slug, "index.md");
        let raw: string;
        try {
          raw = await fs.readFile(file, "utf8");
        } catch {
          return null;
        }
        const { data, content } = matter(raw);
        const fm = data as Frontmatter;
        const published = fm.published !== false;
        if (!includeDrafts && !published) return null;

        const date = fm.date ? parseDate(fm.date) : new Date(0);
        const [html, plainText] = await Promise.all([
          renderMarkdown(content, `/blog/${slug}`),
          markdownToPlainText(content),
        ]);
        const excerpt = pruneText(plainText, EXCERPT_LENGTH);

        return {
          slug,
          title: fm.title?.trim() || slug,
          description: fm.description?.trim() || undefined,
          date,
          dateIso: formatIsoDate(date),
          dateLong: formatLongDate(date),
          dateTimestamp: date.getTime(),
          tags: normalizeTags(fm.tags),
          published,
          excerpt,
          html,
          searchText: plainText,
          rawBody: content,
        };
      })
  );

  return results
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.dateTimestamp - a.dateTimestamp);
}

const galleryDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function labelFor(timestamp: string | null): string | null {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  return Number.isNaN(d.getTime()) ? null : galleryDateFormatter.format(d);
}

async function loadGalleries(): Promise<Record<"instagram" | "microscope" | "shoes", GalleryPhoto[]>> {
  async function listFiles(collection: string) {
    const dir = path.join(PUBLIC_DIR, "gallery", collection);
    const names = (await fs.readdir(dir)).filter((n) => IMAGE_EXT.test(n)).sort();
    return names.map((name) => ({
      name,
      stem: name.replace(/\.[^.]+$/, ""),
      src: `/gallery/${collection}/${name}`,
    }));
  }

  const [instaFiles, microFiles, shoesFiles, instaRaw, microRaw] = await Promise.all([
    listFiles("instagram"),
    listFiles("microscope"),
    listFiles("shoes"),
    fs.readFile(path.join(DATA_DIR, "instagram.json"), "utf8"),
    fs.readFile(path.join(DATA_DIR, "microscope.json"), "utf8"),
  ]);

  const instaEntries = JSON.parse(instaRaw) as {
    title: string;
    creation_timestamp: string;
    name: string;
  }[];
  const instagram: GalleryPhoto[] = [];
  for (const entry of instaEntries) {
    const file = instaFiles.find((f) => entry.name.startsWith(f.stem));
    if (!file) continue;
    const title = entry.title?.trim() || null;
    instagram.push({
      src: file.src,
      title,
      timestamp: entry.creation_timestamp,
      dateLabel: labelFor(entry.creation_timestamp),
      alt: title ?? `Instagram photo ${file.stem}`,
    });
  }
  instagram.sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? ""));

  const microEntries = JSON.parse(microRaw) as {
    name: string;
    creation_timestamp: string;
    title: string | null;
  }[];
  const byName = new Map(microEntries.map((e) => [e.name, e]));
  const microscope: GalleryPhoto[] = microFiles.map((file) => {
    const entry = byName.get(file.name);
    const title = entry?.title?.trim() || null;
    return {
      src: file.src,
      title,
      timestamp: entry?.creation_timestamp ?? null,
      dateLabel: labelFor(entry?.creation_timestamp ?? null),
      alt: title ?? `Microscope photo ${file.stem}`,
    };
  });

  const shoes: GalleryPhoto[] = shoesFiles.map((file) => ({
    src: file.src,
    title: null,
    timestamp: null,
    dateLabel: null,
    alt: `Shoe photo ${file.stem}`,
  }));

  return { instagram, microscope, shoes };
}

async function loadMusic(): Promise<Release[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, "soundcloud.json"), "utf8");
  const tracks = JSON.parse(raw) as {
    artist: string;
    title: string;
    album: string;
    releasedate: string;
    trackurl: string;
    albumurl: string;
    artwork: string;
  }[];

  const clean = (v: string | undefined) => {
    const t = v?.trim();
    return t && t.toLowerCase() !== "n/a" ? t : null;
  };

  const releases = new Map<string, Release>();
  for (const t of tracks) {
    let release = releases.get(t.album);
    if (!release) {
      release = {
        title: t.album,
        artist: t.artist,
        releaseDate: clean(t.releasedate),
        url: clean(t.albumurl),
        artwork: clean(t.artwork) ? `/gallery/music/${t.artwork}` : null,
        tracks: [],
      };
      releases.set(t.album, release);
    }
    release.tracks.push({ title: t.title, url: clean(t.trackurl) });
  }
  return [...releases.values()];
}

async function writeRssFeed(posts: (PostData & { rawBody: string; date: Date })[]) {
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: `${site.url}/`,
    link: `${site.url}/`,
    language: "en",
    image: `${site.url}/images/icon.png`,
    favicon: `${site.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${site.author.name}`,
    updated: posts[0]?.date,
    feedLinks: { rss: `${site.url}/rss.xml` },
    author: { name: site.author.name, link: site.url },
  });

  for (const post of posts.slice(0, 20)) {
    const url = `${site.url}/${post.slug}`;
    const html = await renderMarkdown(post.rawBody, `${site.url}/blog/${post.slug}`);
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description || post.excerpt,
      content: html,
      date: post.date,
      category: post.tags.map((name) => ({ name })),
      author: [{ name: site.author.name, link: site.url }],
    });
  }

  await fs.writeFile(path.join(PUBLIC_DIR, "rss.xml"), feed.rss2(), "utf8");
}

async function writeSitemap(posts: PostData[]) {
  const tagSlugs = [...new Set(posts.flatMap((p) => p.tags.map(kebabCase)))];
  const pageCount = Math.max(1, Math.ceil(posts.length / site.postsPerPage));

  const urls = [
    "/",
    "/blog/posts",
    "/blog/tags",
    "/blog/search",
    "/gallery",
    "/gallery/instagram",
    "/gallery/microscope",
    "/gallery/shoes",
    "/music",
    "/blackjack",
    "/contact",
    ...Array.from({ length: pageCount }, (_, i) => `/blog/${i + 1}`),
    ...posts.map((p) => `/${p.slug}`),
    ...tagSlugs.map((t) => `/blog/tags/${t}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}${u}</loc></url>`).join("\n")}
</urlset>
`;
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf8");
}

async function writeStaticMetadata() {
  const robots = `User-agent: *
Allow: /
Sitemap: ${site.url}/sitemap.xml
`;
  const manifest = JSON.stringify(
    {
      name: site.title,
      short_name: site.shortName,
      description: site.description,
      start_url: "/",
      display: "minimal-ui",
      background_color: site.themeColor,
      theme_color: site.themeColor,
      icons: [
        { src: "/images/icon.png", sizes: "512x512", type: "image/png" },
        { src: "/images/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    null,
    2
  );
  const redirects = `/blog /blog/1 301
/posts /blog/posts 301
/collection / 301
/* /index.html 200
`;

  await Promise.all([
    fs.writeFile(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8"),
    fs.writeFile(path.join(PUBLIC_DIR, "manifest.webmanifest"), manifest, "utf8"),
    fs.writeFile(path.join(PUBLIC_DIR, "_redirects"), redirects, "utf8"),
  ]);
}

async function main() {
  const [postsWithRaw, galleries, releases] = await Promise.all([
    loadPosts(),
    loadGalleries(),
    loadMusic(),
  ]);

  const posts: PostData[] = postsWithRaw.map(({ rawBody: _raw, date: _date, ...rest }) => rest);

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify({ posts, galleries, releases }), "utf8");

  await Promise.all([
    writeRssFeed(postsWithRaw),
    writeSitemap(posts),
    writeStaticMetadata(),
  ]);

  console.log(
    `Generated content: ${posts.length} posts, ${Object.values(galleries).reduce((s, g) => s + g.length, 0)} gallery photos, ${releases.length} music releases.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
