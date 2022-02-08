import React from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";
import PostList from "../components/post-list";

const BlogHome = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const blogs = data.allMarkdownRemark.nodes;

  if (blogs.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo
          title={`Blog Home`}
          keywords={[
            `gatsby`,
            `Ciaervo`,
            `Blog`,
          ]}
        />
        <p>
          No blog posts found.
        </p>
      </Layout>
    );
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Blog Home" />
      <h3>Most recent Blog Posts</h3>
      <PostList posts={blogs} />
      <h3 style={{ color: "salmon" }}>
        <Link to="/blog/posts">More</Link>
      </h3>
    </Layout>
  );
};

export default BlogHome;

export const pageQuery = graphql`
query BlogHomeQuery {
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, limit: 7) {
    nodes {
      id
      excerpt(format: PLAIN, pruneLength: 300)
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
  postGroup: allMarkdownRemark {
    pageInfo {
      itemCount
    }
  }
}
`;
