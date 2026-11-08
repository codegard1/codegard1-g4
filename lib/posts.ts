import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { markdownToExcerpt, renderMarkdown } from "./markdown";
import { formatIsoDate, formatLongDate, kebabCase, parseDate } from "./format";
import { site } from "./site";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const EXCERPT_LENGTH = 300;

export interface Post {
  /** URL slug; posts live at the site root, e.g. /site-status */
  slug: string;
  title: string;
  description?: string;
  date: Date;
  dateLong: string;
  dateIso: string;
  tags: string[];
  published: boolean;
  excerpt: string;
  /** Public base path for the post's colocated images */
  assetBase: string;
  /** Raw markdown body */
  body: string;
}

export interface TagSummary {
  tag: string;
  slug: string;
  count: number;
  lastPostDate: string;
}

interface Frontmatter {
  title?: string;
  description?: string;
  date?: string | Date;
  tags?: string[] | string | null;
  published?: boolean;
}

function normalizeTags(tags: Frontmatter["tags"]): string[] {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return [...new Set(list.map((t) => String(t).trim()).filter(Boolean))];
}

/** Drafts are hidden in production builds and shown during local development. */
export const includeDrafts = process.env.NODE_ENV !== "production";

async function loadPost(slug: string): Promise<Post | null> {
  const file = path.join(BLOG_DIR, slug, "index.md");
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;
  const date = fm.date ? parseDate(fm.date) : new Date(0);
  const excerpt = await markdownToExcerpt(content, EXCERPT_LENGTH);
  return {
    slug,
    title: fm.title?.trim() || slug,
    description: fm.description?.trim() || undefined,
    date,
    dateLong: formatLongDate(date),
    dateIso: formatIsoDate(date),
    tags: normalizeTags(fm.tags),
    published: fm.published !== false,
    excerpt,
    assetBase: `/blog/${slug}`,
    body: content,
  };
}

const loadAllPosts = cache(async (): Promise<Post[]> => {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const posts = await Promise.all(
    entries.filter((e) => e.isDirectory()).map((e) => loadPost(e.name))
  );
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
});

/** All visible posts, newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await loadAllPosts();
  return includeDrafts ? posts : posts.filter((p) => p.published);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Previous (older) and next (newer) posts relative to `slug`. */
export async function getAdjacentPosts(slug: string): Promise<{ older: Post | null; newer: Post | null }> {
  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { older: null, newer: null };
  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export async function renderPost(post: Post): Promise<string> {
  return renderMarkdown(post.body, post.assetBase);
}

export function getPageCount(totalPosts: number): number {
  return Math.max(1, Math.ceil(totalPosts / site.postsPerPage));
}

export async function getPostsPage(page: number): Promise<{ posts: Post[]; numPages: number }> {
  const all = await getAllPosts();
  const numPages = getPageCount(all.length);
  const start = (page - 1) * site.postsPerPage;
  return { posts: all.slice(start, start + site.postsPerPage), numPages };
}

export function tagSlug(tag: string): string {
  return kebabCase(tag);
}

export async function getAllTags(): Promise<TagSummary[]> {
  const posts = await getAllPosts();
  const map = new Map<string, TagSummary>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const existing = map.get(tag);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(tag, { tag, slug: tagSlug(tag), count: 1, lastPostDate: post.dateIso });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getPostsByTagSlug(slug: string): Promise<{ tag: string; posts: Post[] } | null> {
  const tags = await getAllTags();
  const match = tags.find((t) => t.slug === slug);
  if (!match) return null;
  const posts = (await getAllPosts()).filter((p) => p.tags.includes(match.tag));
  return { tag: match.tag, posts };
}
