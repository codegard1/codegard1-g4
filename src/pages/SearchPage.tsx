import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDocumentTitle } from "../components/Layout";
import PostList from "../components/PostList";
import { searchPosts } from "../data/content";

export default function SearchPage() {
  useDocumentTitle("Search Blog Posts");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const results = query ? searchPosts(query) : [];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  }

  return (
    <>
      <h2>
        <Link to="/blog/1">Blog</Link>
      </h2>
      <h4>Search Posts</h4>
      <ul className="search-links">
        <li>
          <Link to="/blog/posts" className="accent-link">
            All Posts (sorted by date)
          </Link>
        </li>
        <li>
          <Link to="/blog/tags" className="accent-link">
            All Tags
          </Link>
        </li>
      </ul>
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="blog-search-input" className="visually-hidden">
          Search blog posts
        </label>
        <input
          id="blog-search-input"
          type="search"
          name="q"
          placeholder="Search Blog Posts"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Search</button>
        {query && (
          <Link to="/blog/search" aria-label="Clear search">
            &#10005;
          </Link>
        )}
      </form>
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
