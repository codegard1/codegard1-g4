import type { MetadataRoute } from "next";
import { galleryCollections } from "@/lib/gallery";
import { getAllPosts, getAllTags, getPageCount } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  const latest = posts[0]?.date ?? new Date();
  const url = (p: string) => `${site.url}${p}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: url("/blog/posts"), lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/blog/tags"), lastModified: latest, changeFrequency: "weekly", priority: 0.5 },
    { url: url("/blog/search"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/gallery"), changeFrequency: "monthly", priority: 0.6 },
    ...galleryCollections.map((c) => ({
      url: url(`/gallery/${c}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: url("/music"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/blackjack"), changeFrequency: "yearly", priority: 0.4 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const pageRoutes: MetadataRoute.Sitemap = Array.from(
    { length: getPageCount(posts.length) },
    (_, i) => ({ url: url(`/blog/${i + 1}`), lastModified: latest, changeFrequency: "weekly", priority: 0.5 })
  );

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: url(`/${p.slug}`),
    lastModified: p.date,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
    url: url(`/blog/tags/${t.slug}`),
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...pageRoutes, ...postRoutes, ...tagRoutes];
}
