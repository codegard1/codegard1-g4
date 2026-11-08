import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageButtons from "@/components/PageButtons";
import PostList from "@/components/PostList";
import { getAllPosts, getPageCount, getPostsPage } from "@/lib/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return Array.from({ length: getPageCount(posts.length) }, (_, i) => ({ page: String(i + 1) }));
}

function parsePage(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return { title: `Blog: Page ${page}` };
}

export default async function BlogListPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const current = parsePage(page);
  if (current === null) notFound();
  const { posts, numPages } = await getPostsPage(current);
  if (current > numPages) notFound();

  return (
    <>
      <PostList posts={posts} />
      <PageButtons numPages={numPages} currentPage={current} />
    </>
  );
}
