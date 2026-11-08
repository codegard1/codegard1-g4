import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/PostList";
import SearchForm from "@/components/SearchForm";
import { searchPosts } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search Blog Posts",
  description: "Search Codegard1 blog posts by title, tag or content.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const results = query ? await searchPosts(query) : [];

  return (
    <>
      <h2>
        <Link href="/blog/1">Blog</Link>
      </h2>
      <h4>Search Posts</h4>
      <ul className="search-links">
        <li>
          <Link href="/blog/posts" className="accent-link">
            All Posts (sorted by date)
          </Link>
        </li>
        <li>
          <Link href="/blog/tags" className="accent-link">
            All Tags
          </Link>
        </li>
      </ul>
      <SearchForm query={query} />
      {query ? (
        <>
          <p>
            Found {results.length} matching post{results.length === 1 ? "" : "s"} for{" "}
            <q>{query}</q>
          </p>
          <hr />
          <PostList posts={results} />
        </>
      ) : (
        <p>Search results appear below.</p>
      )}
    </>
  );
}
