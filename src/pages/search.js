import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";

import Search from "../components/search";

const SearchPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Search Blog Posts" />
      <h1>Search Blog Posts</h1>
      <Search />
    </Layout>
  );
};

export default SearchPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
