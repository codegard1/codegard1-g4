import { Feed } from "feed";
import { renderMarkdown } from "@/lib/markdown";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getAllPosts();
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
    // Render with absolute asset URLs so images resolve inside feed readers.
    const html = await renderMarkdown(post.body, `${site.url}${post.assetBase}`);
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

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
