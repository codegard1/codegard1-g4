import React from "react";

import { graphql } from "gatsby";

import Layout from "../../components/layout";
import Seo from "../../components/seo";

const CollectionPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Collections" keywords={[`collections`, `lists`, `stuff`]} />
      <h2>Collections</h2>

      <h4>Bleek Blork</h4>
      <p>
        Lorem ipsum

      </p>

    </Layout>
  );
};

export default CollectionPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
