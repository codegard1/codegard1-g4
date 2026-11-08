import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "All Blog Post Tags",
  description: "Browse Codegard1 blog posts by tag.",
};

export default async function TagsPage() {
  const tags = await getAllTags();
  return (
    <>
      <h2>
        <Link href="/blog/1">Blog</Link>
      </h2>
      <h4>All Post Tags</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col" className="nowrap">
              Post Count
            </th>
            <th scope="col" className="nowrap">
              Last Post
            </th>
          </tr>
        </thead>
        <tbody>
          {tags.map((t) => (
            <tr key={t.slug}>
              <td>
                <Link href={`/blog/tags/${t.slug}`}>{t.tag}</Link>
              </td>
              <td>{t.count}</td>
              <td className="nowrap">{t.lastPostDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
