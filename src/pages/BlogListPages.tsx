import { Link, useParams } from "react-router-dom";
import { useDocumentTitle } from "../components/Layout";
import PageButtons from "../components/PageButtons";
import PostList from "../components/PostList";
import TagLinks from "../components/TagLinks";
import { getAllPosts, getAllTags, getPostsByTagSlug, getPostsPage } from "../data/content";
import NotFoundPage from "./NotFoundPage";

export function BlogListPage() {
  const { page = "1" } = useParams<{ page: string }>();
  const valid = /^\d+$/.test(page);
  const current = valid ? Number(page) : 0;
  const { posts, numPages } = getPostsPage(Math.max(1, current));
  const isNotFound = !valid || current < 1 || current > numPages;
  useDocumentTitle(isNotFound ? undefined : `Blog: Page ${current}`);

  if (isNotFound) return <NotFoundPage />;

  return (
    <>
      <PostList posts={posts} />
      <PageButtons numPages={numPages} currentPage={current} />
    </>
  );
}

export function PostsIndexPage() {
  useDocumentTitle("All Blog Posts");
  const posts = getAllPosts();

  return (
    <>
      <h2>
        <Link to="/blog/1">Blog</Link>
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
                <Link to={`/${post.slug}`}>{post.title}</Link>
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

export function TagsIndexPage() {
  useDocumentTitle("All Blog Post Tags");
  const tags = getAllTags();

  return (
    <>
      <h2>
        <Link to="/blog/1">Blog</Link>
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
                <Link to={`/blog/tags/${t.slug}`}>{t.tag}</Link>
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

export function TagPostsPage() {
  const { tag } = useParams<{ tag: string }>();
  const result = tag ? getPostsByTagSlug(tag) : null;
  useDocumentTitle(result ? `Tags: ${result.tag}` : undefined);

  if (!result) return <NotFoundPage />;

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
                <Link to={`/${post.slug}`}>{post.title}</Link>
              </td>
              <td className="nowrap">
                <time dateTime={post.dateIso}>{post.dateIso}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Link to="/blog/tags">All tags</Link>
      </p>
    </>
  );
}
