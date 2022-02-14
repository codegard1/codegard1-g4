import React, { useEffect, useState } from "react";
import { graphql, Link } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import PostList from "../../components/post-list";
import useJsSearch from "../../util/useJSSearch";
import Search from "../../components/search";

const SearchPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  const { search } = useJsSearch(data.allMarkdownRemark.nodes);
  const [blogs, setBlogs] = useState(data.allMarkdownRemark.nodes);
  const [searched, setSearched] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  // Handles query state and prevents unnecessary rerendering
  useEffect(() => {
    const q = location.search ? location.search.slice(1).split("&").filter(v => v[0] === `q`)[0].slice(2) : "";

    // Check if we have searched
    if (q !== initialQuery) { setSearched(false); }
    setInitialQuery(q);

    // If no query, reset blogs
    if (!q) {
      setBlogs(data.allMarkdownRemark.nodes);
      return;
    }
    // If query exists and we haven't searched yet, execute search
    if (q && !searched) {
      const results = search(q);
      setBlogs(results);
      setSearched(true);
    }
  }, [
    searched,
    data.allMarkdownRemark.nodes,
    search,
    location.search,
    initialQuery,
  ]);

  if (blogs.length === 0 || searched === false) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="Search Blog Posts" />
        <h2><Link to="/blog/1">Blog</Link></h2>
        <h4>Search Posts</h4>
        <ul>
          <li style={{ color: "salmon" }}><Link to="/blog/posts">All Posts (sorted by date)</Link></li>
          <li style={{ color: "salmon" }}><Link to="/blog/tags">All Tags</Link></li>
          <li><Search initialQuery={initialQuery} numResults={blogs.length} /></li>
        </ul>
      </Layout>
    );
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Search Posts" />
      <ul>
        <li><Link to="/posts">All Posts (sorted by date)</Link></li>
        <li><Link to="/blog/tags">All Tags</Link></li>
        <li><Search initialQuery={initialQuery} numResults={blogs.length} /></li>
      </ul>
      <PostList posts={blogs} />
    </Layout>
  );
};

export default SearchPage;

export const pageQuery = graphql`
query blogSearchQuery {
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    nodes {
      id
      excerpt(format: PLAIN, pruneLength: 200)
      fields {
        slug
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        tags
      }
    }
  }
}
`;
