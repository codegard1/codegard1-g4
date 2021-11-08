import React from "react";
import kebabCase from "lodash/kebabCase";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";

const TagsPage = ({ data, location }) => (
  <Layout location={location} title={data.site.siteMetadata.title}>
    <h1>Blog Post Tags</h1>
    {data.allMarkdownRemark.group.map(tag => (
      <Link to={`/tags/${kebabCase(tag.fieldValue)}/`} key={tag.fieldValue}>
        {tag.fieldValue} ({tag.totalCount}) &nbsp;
      </Link>
    ))}
  </Layout>
);

export default TagsPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      filter: {frontmatter: {tags: {ne: ""}}}
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
