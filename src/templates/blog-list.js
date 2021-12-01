import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import PostList from "../components/post-list";

const BlogList = ({ data, location, context }) => {
  const siteTitle = data.site.siteMetadata.title || 'Title';
  const posts = data.allMarkdownRemark.nodes;
  // const { currentPage, numPages } = context;
  // const isFirst = currentPage === 1;
  // const isLast = currentPage === numPages;
  // const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString();
  // const nextPage = (currentPage + 1).toString();

  return (
    <Layout location={location} title={siteTitle}>
      <PostList posts={posts} />
    </Layout>
  )
};

export default BlogList;

export const blogListQuery = graphql`
query blogPageQuery($limit: Int!, $skip: Int!) {
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(
    sort: {fields: [frontmatter___date], order: DESC}
    limit: $limit
    skip: $skip
  ) {
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