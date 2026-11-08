import Link from "next/link";

/** Plain GET form: works without JavaScript and keeps the /blog/search?q= URL contract. */
export default function SearchForm({ query }: { query: string }) {
  return (
    <form className="search-form" action="/blog/search" method="get" role="search">
      <label htmlFor="blog-search-input" className="visually-hidden">
        Search blog posts
      </label>
      <input
        id="blog-search-input"
        type="search"
        name="q"
        placeholder="Search Blog Posts"
        defaultValue={query}
        autoComplete="off"
      />
      <button type="submit">Search</button>
      {query && (
        <Link href="/blog/search" aria-label="Clear search">
          &#10005;
        </Link>
      )}
    </form>
  );
}
