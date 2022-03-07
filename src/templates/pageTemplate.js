import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";

const PagePage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Title" keywords={[`title`]} />
      <h2><Link to="/title">Title</Link></h2>
      <h4>Subtitle</h4>
      <p>Content</p>
    </Layout>
  );
};

export default PagePage;

export const pageQuery = graphql`
query {
  site {
    siteMetadata {
      title
    }
  }
}
`;
