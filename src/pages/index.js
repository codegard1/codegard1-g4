import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";
import PostList from "../components/post-list";
import PageButtons from '../components/page-buttons';
import useJsSearch from "../util/useJSSearch";
import Search from "../components/search";

const BlogIndex = ({ data, location, pageContext }) => {
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

  if (blogs.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Search initialQuery={initialQuery} numResults={blogs.length} />
        <p>
          No blog posts found.
        </p>
      </Layout>
    );
  }


  const postsPerPage = 5;
  // const numPages = Math.ceil(blogs.length / postsPerPage);
  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Blog Index" />
      <Search initialQuery={initialQuery} numResults={blogs.length} />
      <PostList posts={blogs.slice(0, postsPerPage-1)} />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query blogIndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      nodes {
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`;
