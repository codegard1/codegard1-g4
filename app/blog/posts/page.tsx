import type { Metadata } from "next";
import Link from "next/link";
import TagLinks from "@/components/TagLinks";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "All Blog Posts",
  description: "Every post on Codegard1, sorted by date.",
};

export default async function PostsPage() {
  const posts = await getAllPosts();
  return (
    <>
      <h2>
        <Link href="/blog/1">Blog</Link>
      </h2>
      <h4>All Posts</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col" className="nowrap">
              Date
            </th>
            <th scope="col">Published</th>
            <th scope="col">Tags</th>
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
              <td>{post.published ? "Yes" : "No"}</td>
              <td>
                <TagLinks tags={post.tags} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
