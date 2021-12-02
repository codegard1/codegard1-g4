import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";

import { OutboundLink } from "gatsby-plugin-google-gtag";

const ContactPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  const brandLinks = [];
  for (let key in data.site.siteMetadata.social) {
    if (key) {
      brandLinks.push(
        <li>
          <OutboundLink href={data.site.siteMetadata.social[key]} key={`site-nav-link-${key}`}>{key}</OutboundLink>
        </li>);
    }
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Contact" />
      <h1>Contact</h1>
      <p>
        You may admire or reach me through the following social media and other platforms. Email is in there, as well. 
        </p>
      <ul>
        {brandLinks}
      </ul>
    </Layout>
  );
};

export default ContactPage;

export const pageQuery = graphql`
  query SocialLinksQuery {
    site {
      siteMetadata {
        title
        social {
          applemusic
          bandcamp
          email
          github
          keybase
          lastfm
          linkedin
          soundcloud
          spotify
          stackoverflow
          tumblr
          twitter
          twitch
          youtube
        }
      }
    }
  }
`;

