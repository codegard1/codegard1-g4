import { Link, navigate } from "gatsby";
import React, { useEffect, useState } from "react";

// props
// initialQuery: string
// numResults: number

const Search = props => {
  const [query, setQuery] = useState(props.initialQuery);

  useEffect(() => {
    setQuery(props.initialQuery);
  }, [props.initialQuery]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await navigate(`/blog/search?q=${query}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Search Blog Posts"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {!!props.initialQuery && <Link to="/blog/search">&#10005;</Link>}
        {props.initialQuery && (
          <div>
            Found {props.numResults} matching post
            {props.numResults === 1 ? "" : "s"}
            <hr/>
          </div>
        )}
        {!props.initialQuery && (
          <div>
            Search results appear below.
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
