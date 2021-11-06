import React, { useState, useCallback } from "react";
import { Text } from "@fluentui/react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";

import { OutboundLink } from "gatsby-plugin-google-gtag";

const MusicPage = ({ data, location }) => {

  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { applemusic, bandcamp, soundcloud, spotify } = data.site.siteMetadata.social;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Music" keywords={[`music`, `audio`, `Ciaervo`]} />
      <h2>Music</h2>
      <p>
        <Text>I make music sometimes using Logic or Fruity Loops. You can find some of my tracks on <OutboundLink href={soundcloud} target="_blank" rel="noopener norefer">SoundCloud</OutboundLink>, <OutboundLink href={bandcamp} target="_blank" rel="noopener norefer">BandCamp</OutboundLink>, <OutboundLink href={spotify} target="_blank" rel="noopener norefer">Spotify</OutboundLink>, <OutboundLink href={applemusic} target="_blank" rel="noopener norefer">Apple Music</OutboundLink>, etc.</Text>
      </p>
      <br />
      <iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1341784969&color=%231860eb&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
      <div>
        <OutboundLink href={soundcloud} title="Ciaervo" target="_blank" >Ciaervo</OutboundLink> · <OutboundLink href="https://soundcloud.com/ciaervo/sets/ditributed" title="Distributed" target="_blank">Distributed</OutboundLink>
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
