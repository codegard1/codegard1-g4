import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTagSlug } from "@/lib/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const result = await getPostsByTagSlug(tag);
  if (!result) return {};
  return {
    title: `Tags: ${result.tag}`,
    description: `Blog posts tagged "${result.tag}"`,
    keywords: ["Ciaervo", "Blog", result.tag],
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const result = await getPostsByTagSlug(tag);
  if (!result) notFound();
  const { posts } = result;
  const header = `${posts.length} post${posts.length === 1 ? "" : "s"} tagged with "${result.tag}"`;

  return (
    <>
      <h2>{header}</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col" className="nowrap">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug}>
              <td>
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </td>
              <td className="nowrap">
                <time dateTime={post.dateIso}>{post.dateIso}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Link href="/blog/tags">All tags</Link>
      </p>
    </>
  );
}
