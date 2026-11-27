import MiniSearch from "minisearch";
import generated from "../generated/content.json";
import { site } from "../config/site";
import { kebabCase } from "../utils/format";

export interface Post {
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

export interface TagSummary {
  tag: string;
  slug: string;
  count: number;
  lastPostDate: string;
}

export const galleryCollections = ["instagram", "microscope", "shoes"] as const;
export type GalleryCollection = (typeof galleryCollections)[number];

export interface GalleryPhoto {
  src: string;
  title: string | null;
  timestamp: string | null;
  dateLabel: string | null;
  alt: string;
}

export interface GalleryInfo {
  slug: GalleryCollection;
  name: string;
  emoji: string;
  blurb: string;
}

export const galleryInfo: Record<GalleryCollection, GalleryInfo> = {
  instagram: {
    slug: "instagram",
    name: "Instagram Feed",
    emoji: "🤳",
    blurb: "Selection of images from my own Instagram feed.",
  },
  microscope: {
    slug: "microscope",
    name: "Microscope",
    emoji: "🔬",
    blurb: "Photos of small things up close",
  },
  shoes: {
    slug: "shoes",
    name: "Shoes",
    emoji: "👞",
    blurb:
      "I notice shoes fairly often, and when I see an abandoned pair, or, more often, a single, I always take a moment to imagine how it might have ended up there. This is my collection of discarded shoe photos.",
  },
};

export interface Release {
  title: string;
  artist: string;
  releaseDate: string | null;
  url: string | null;
  artwork: string | null;
  tracks: { title: string; url: string | null }[];
}

const data = generated as {
  posts: Post[];
  galleries: Record<GalleryCollection, GalleryPhoto[]>;
  releases: Release[];
};

export function getAllPosts(): Post[] {
  return data.posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return data.posts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): { older: Post | null; newer: Post | null } {
  const index = data.posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { older: null, newer: null };
  return {
    newer: index > 0 ? data.posts[index - 1] : null,
    older: index < data.posts.length - 1 ? data.posts[index + 1] : null,
  };
}

export function getPageCount(totalPosts: number): number {
  return Math.max(1, Math.ceil(totalPosts / site.postsPerPage));
}

export function getPostsPage(page: number): { posts: Post[]; numPages: number } {
  const numPages = getPageCount(data.posts.length);
  const start = (page - 1) * site.postsPerPage;
  return { posts: data.posts.slice(start, start + site.postsPerPage), numPages };
}

export function tagSlug(tag: string): string {
  return kebabCase(tag);
}

let cachedTags: TagSummary[] | null = null;
export function getAllTags(): TagSummary[] {
  if (cachedTags) return cachedTags;
  const map = new Map<string, TagSummary>();
  for (const post of data.posts) {
    for (const tag of post.tags) {
      const existing = map.get(tag);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(tag, { tag, slug: tagSlug(tag), count: 1, lastPostDate: post.dateIso });
      }
    }
  }
  cachedTags = [...map.values()].sort((a, b) => a.tag.localeCompare(b.tag));
  return cachedTags;
}

export function getPostsByTagSlug(slug: string): { tag: string; posts: Post[] } | null {
  const match = getAllTags().find((t) => t.slug === slug);
  if (!match) return null;
  return {
    tag: match.tag,
    posts: data.posts.filter((p) => p.tags.includes(match.tag)),
  };
}

let searchIndex: MiniSearch<{ slug: string; title: string; tags: string; excerpt: string; searchText: string }> | null =
  null;

export function searchPosts(query: string): Post[] {
  const q = query.trim();
  if (!q) return [];
  if (!searchIndex) {
    searchIndex = new MiniSearch({
      idField: "slug",
      fields: ["title", "tags", "excerpt", "searchText"],
      searchOptions: {
        boost: { title: 4, tags: 3, excerpt: 2 },
        prefix: true,
        fuzzy: 0.15,
      },
    });
    searchIndex.addAll(
      data.posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        tags: p.tags.join(" "),
        excerpt: p.excerpt,
        searchText: p.searchText,
      }))
    );
  }
  const bySlug = new Map(data.posts.map((p) => [p.slug, p]));
  return searchIndex
    .search(q)
    .map((r) => bySlug.get(r.id as string))
    .filter((p): p is Post => p !== undefined);
}

export function isGalleryCollection(value: string): value is GalleryCollection {
  return (galleryCollections as readonly string[]).includes(value);
}

export function getGalleryPhotos(collection: GalleryCollection): GalleryPhoto[] {
  return data.galleries[collection] ?? [];
}

export function getGalleryCounts(): Record<GalleryCollection, number> {
  return {
    instagram: data.galleries.instagram.length,
    microscope: data.galleries.microscope.length,
    shoes: data.galleries.shoes.length,
  };
}

export function getReleases(): Release[] {
  return data.releases;
}
