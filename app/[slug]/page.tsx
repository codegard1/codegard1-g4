import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Bio from "@/components/Bio";
import TagLinks from "@/components/TagLinks";
import { getAdjacentPosts, getAllPosts, getPostBySlug, renderPost } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const description = post.description || post.excerpt.slice(0, 160);
  return {
    title: post.title,
    description,
    keywords: ["Ciaervo", "Blog", ...post.tags],
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${site.url}/${post.slug}`,
      publishedTime: post.date.toISOString(),
      authors: [site.author.name],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [html, { older, newer }] = await Promise.all([renderPost(post), getAdjacentPosts(slug)]);

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
        <section itemProp="articleBody" dangerouslySetInnerHTML={{ __html: html }} />
        <hr />
      </article>
      <nav className="post-nav" aria-label="Adjacent posts">
        <ul>
          <li>
            {newer && (
              <Link href={`/${newer.slug}`} rel="prev">
                ← {newer.title}
              </Link>
            )}
          </li>
          <li>
            <Link href="/blog/posts">Index</Link>
          </li>
          <li>
            {older && (
              <Link href={`/${older.slug}`} rel="next">
                {older.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
