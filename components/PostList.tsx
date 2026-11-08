import Link from "next/link";
import type { Post } from "@/lib/posts";
import TagLinks from "./TagLinks";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <article itemScope itemType="http://schema.org/Article">
            <header>
              <h2>
                <Link href={`/${post.slug}`} itemProp="url">
                  <span itemProp="headline">{post.title}</span>
                </Link>
              </h2>
              <small>
                <time dateTime={post.dateIso}>{post.dateLong}</time>
              </small>
              <br />
              <small>
                tags:&nbsp;
                <TagLinks tags={post.tags} />
              </small>
            </header>
            <section>
              <p itemProp="description">{post.description || post.excerpt}</p>
            </section>
          </article>
        </li>
      ))}
    </ol>
  );
}
