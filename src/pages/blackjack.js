import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { OutboundLink } from "gatsby-plugin-google-gtag";

const BlackjackPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title="Blackjack"
        keywords={[
          `gatsby`,
          `javascript`,
          `react`,
          `web development`,
          `blackjack`,
        ]}
      />

      <h2>Chris's Blackjack</h2>
      <p>
        <OutboundLink
          href="https://github.com/codegard1/blackjack"
          target="_blank"
          rel="noreferrer"
          rel="noopener"
        >
          Here's the github repo
        </OutboundLink>
      </p>

      <iframe src="https://blackjack.ciaervo.com" width="8" height="6"></iframe>

    </Layout>
  );
};

export default BlackjackPage;

export const pageQuery = graphql`
{
  site {
    siteMetadata {
      title
    }
  }
}
`;
