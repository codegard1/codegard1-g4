import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { OutboundLink } from "gatsby-plugin-google-gtag";
import { Text } from "@fluentui/react";

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
      <Text>
        This is a fairly minimal version of the game Blackjack made with React, Flux, and Fluent UI. It stores game state in browser storage so that the player's statistics will persist across session.<br/> This is a perpetual work in progress, so not all features may work as expected. </Text><br/>
      <Text>
        <OutboundLink
          href="https://github.com/codegard1/blackjack"
          target="_blank"
          rel="noreferrer"
          rel="noopener"
        >
          Here's the github repo.
        </OutboundLink>
        <br/>
        <OutboundLink
          href="https://blackjack.ciaervo.com"
          target="_blank"
          rel="noreferrer"
          rel="noopener"
        >
          Open the app full-screen.
        </OutboundLink>
      </Text>
      <br />
      <br />
      <iframe src="https://blackjack.ciaervo.com" width="600" height="800"></iframe>

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
