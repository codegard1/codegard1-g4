import React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";

import { OutboundLink } from "gatsby-plugin-google-gtag";

const MusicPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { applemusic, bandcamp, soundcloud, spotify } =
    data.site.siteMetadata.social;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Music" keywords={[`music`, `audio`, `Ciaervo`]} />
      <h2>Music</h2>
      <p>
          I make music sometimes using Logic or Fruity Loops. You can find some
          of my tracks on{" "}
          <OutboundLink
            href={soundcloud}
            target="_blank"
            rel="noopener noreferrer"
          >
            SoundCloud
          </OutboundLink>
          ,{" "}
          <OutboundLink href={bandcamp} target="_blank" rel="noopener noreferrer">
            BandCamp
          </OutboundLink>
          ,{" "}
          <OutboundLink href={spotify} target="_blank" rel="noopener noreferrer">
            Spotify
          </OutboundLink>
          ,{" "}
          <OutboundLink
            href={applemusic}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apple Music
          </OutboundLink>
          , etc.
      </p>
      <br />

      <iframe
        title="Ciaervo Music on SoundCloud"
        width="500"
        height="600"
        scrolling="no"
        frameborder="no"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1344404302&color=%231860eb&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
      ></iframe>
      <div>
        <OutboundLink href={soundcloud} title="Ciaervo" target="_blank">
          Ciaervo
        </OutboundLink>{" "}
        ·{" "}
        <OutboundLink
          href="https://soundcloud.com/ciaervo/sets/all-tracks"
          title="All Tracks"
          target="_blank"
        >
          Distributed
        </OutboundLink>
      </div>
    </Layout>
  );
};

export default MusicPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        social {
          bandcamp
          soundcloud
          spotify
          applemusic
        }
      }
    }
  }
`;
