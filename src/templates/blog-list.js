import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import PostList from "../components/post-list";
import PageButtons from "../components/page-buttons";
import Seo from "../components/seo";

const BlogList = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata.title || 'Title';
  const posts = data.allMarkdownRemark.nodes;
  const { currentPage, numPages } = pageContext;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={`Blog Page ${currentPage}`} />
      <PostList posts={posts} />
      <PageButtons {...pageContext} />
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