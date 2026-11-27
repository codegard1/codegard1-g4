import { Link, useParams } from "react-router-dom";
import Bio from "../components/Bio";
import { useDocumentTitle } from "../components/Layout";
import TagLinks from "../components/TagLinks";
import { getAdjacentPosts, getPostBySlug } from "../data/content";
import NotFoundPage from "./NotFoundPage";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  useDocumentTitle(post?.title);

  if (!post) return <NotFoundPage />;

  const { older, newer } = getAdjacentPosts(post.slug);

  return (
    <>
      <article itemScope itemType="http://schema.org/Article">
        <header className="post-header">
          <h3 itemProp="headline">{post.title}</h3>
          <h4>
            <time dateTime={post.dateIso}>{post.dateLong}</time>
          </h4>
          <h5>
            tags:&nbsp;
            <TagLinks tags={post.tags} />
          </h5>
          {!post.published && <p className="accent-link">Draft (not published)</p>}
        </header>
        <Bio />
        <section itemProp="articleBody" dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr />
      </article>
      <nav className="post-nav" aria-label="Adjacent posts">
        <ul>
          <li>
            {newer && (
              <Link to={`/${newer.slug}`} rel="prev">
                ← {newer.title}
              </Link>
            )}
          </li>
          <li>
            <Link to="/blog/posts">Index</Link>
          </li>
          <li>
            {older && (
              <Link to={`/${older.slug}`} rel="next">
                {older.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
