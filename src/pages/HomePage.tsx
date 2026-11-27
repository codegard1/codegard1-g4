import { Link } from "react-router-dom";
import { useDocumentTitle } from "../components/Layout";
import PostList from "../components/PostList";
import { getPostsPage } from "../data/content";

export default function HomePage() {
  useDocumentTitle();
  const { posts } = getPostsPage(1);

  if (posts.length === 0) {
    return <p>No blog posts found.</p>;
  }

  return (
    <>
      <h3>Most recent Blog Posts</h3>
      <PostList posts={posts} />
      <h3>
        <Link to="/blog/posts" className="accent-link">
          More
        </Link>
      </h3>
    </>
  );
}
