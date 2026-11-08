import Link from "next/link";
import PostList from "@/components/PostList";
import { getPostsPage } from "@/lib/posts";

export default async function HomePage() {
  const { posts } = await getPostsPage(1);

  if (posts.length === 0) {
    return <p>No blog posts found.</p>;
  }

  return (
    <>
      <h3>Most recent Blog Posts</h3>
      <PostList posts={posts} />
      <h3>
        <Link href="/blog/posts" className="accent-link">
          More
        </Link>
      </h3>
    </>
  );
}
