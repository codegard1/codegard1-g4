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
        This is a "fairly minimal" version of the game Blackjack made with
        React, Flux, and Fluent UI. It stores game state in browser storage so
        that the player's statistics will persist across session.
        <br /> This is a perpetual work in progress, so not all features may
        work as expected. That is to say, a lot of things are always broken.
        Over the years, this project has been used to experiment with different
        technologies and it has become a disorganized hybrid creature, but it
        still looks fairly presentable.
      </p>
      <br />
      <p>
        <OutboundLink
          href="https://github.com/codegard1/blackjack"
          target="_blank"
          rel="noreferrerrer noopener"
        >
          Here's the github repo.
        </OutboundLink>
        <br />
        <OutboundLink
          href="https://mango-cliff-08390e60f.azurestaticapps.net"
          target="_blank"
          rel="noreferrerrer noopener"
        >
          Open the app full-screen.
        </OutboundLink>
      </p>
      <br />
      <br />
      <iframe
        title="Blackjack"
        src="https://mango-cliff-08390e60f.azurestaticapps.net"
        width="100%"
        height="800"
      ></iframe>
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
