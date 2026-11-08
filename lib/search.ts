import MiniSearch from "minisearch";
import { cache } from "react";
import { getAllPosts, type Post } from "./posts";

interface SearchDoc {
  slug: string;
  title: string;
  tags: string;
  excerpt: string;
  body: string;
}

const buildIndex = cache(async () => {
  const posts = await getAllPosts();
  const index = new MiniSearch<SearchDoc>({
    idField: "slug",
    fields: ["title", "tags", "excerpt", "body"],
    searchOptions: {
      boost: { title: 4, tags: 3, excerpt: 2 },
      prefix: true,
      fuzzy: 0.15,
    },
  });
  index.addAll(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      tags: p.tags.join(" "),
      excerpt: p.excerpt,
      body: p.body,
    }))
  );
  return { index, posts };
});

/** Full-text search over visible posts; results ordered by relevance. */
export async function searchPosts(query: string): Promise<Post[]> {
  const q = query.trim();
  if (!q) return [];
  const { index, posts } = await buildIndex();
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  return index
    .search(q)
    .map((r) => bySlug.get(r.id as string))
    .filter((p): p is Post => p !== undefined);
}
