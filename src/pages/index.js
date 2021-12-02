import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";
import PostList from "../components/post-list";
import PageButtons from '../components/page-buttons';

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <p>
          No blog posts found.
        </p>
      </Layout>
    );
  }


  const postsPerPage = 5;
  const numPages = Math.ceil(posts.length / postsPerPage);
  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Blog Index" />
      <PostList posts={posts.slice(0,4)} />
      <PageButtons numPages={numPages} currentPage={1} />
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
