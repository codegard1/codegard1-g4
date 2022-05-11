import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";

import { OutboundLink } from "gatsby-plugin-google-gtag";

const ContactPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  let socialLinks = [];
  for (let key in data.site.siteMetadata.social) {
    socialLinks.push(
      <li>
        <OutboundLink href={data.site.siteMetadata.social[key].url} key={`site-nav-link-${key}`}>{data.site.siteMetadata.social[key].name}</OutboundLink>
      </li>)
  };

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Social" />
      <h1>Social</h1>
      <p>
        Reach out or admire from afar
      </p>
      <ul>
        {socialLinks}
      </ul>
    </Layout>
  )
};

export default ContactPage;

export const pageQuery = graphql`
  query SocialLinksQuery {
    site {
      siteMetadata {
        title
        social {
          applemusic {name,url}
          bandcamp {name,url}
          email {name,url}
          github {name,url}
          instagram {name,url}
          keybase {name,url}
          lastfm {name,url}
          linkedin {name,url}
          soundcloud {name,url}
          spotify {name,url}
          stackoverflow {name,url}
          tumblr {name,url}
          twitch {name,url}
          twitter {name,url}
          youtube {name,url}
        }
      }
    }
  }
`;

