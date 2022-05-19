import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { OutboundLink } from "gatsby-plugin-google-gtag";
import {
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
} from "@fluentui/react/lib/DetailsList";

const MusicPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { applemusic, bandcamp, soundcloud, spotify } =
    data.site.siteMetadata.social;
  // const _items = data.allMarkdownRemark.nodes.map(post => {
  //   return {
  //     key: post.id,
  //     name: post.frontmatter.title,
  //     tags: post.frontmatter.tags,
  //     date: post.frontmatter.date,
  //     published: post.frontmatter.published,
  //     slug: post.fields.slug
  //   };
  // });
  // const _columns = [
  //   {
  //     key: "name",
  //     name: "Name",
  //     fieldName: "name",
  //     minWidth: 200,
  //     maxWidth: 300,
  //     isResizable: true,
  //     onRender: item => <Link to={item.slug}>{item.name}</Link>,
  //   },
  //   {
  //     key: "date",
  //     name: "Date",
  //     fieldName: "date",
  //     minWidth: 100,
  //     maxWidth: 100,
  //     isResizable: false,
  //   },
  //   {
  //     key: "published",
  //     name: "Published",
  //     fieldName: "published",
  //     minWidth: 100,
  //     maxWidth: 100,
  //     isResizable: false,
  //     onRender: item => item.published ? "Yes" : "No",
  //   },
  //   {
  //     key: "tags",
  //     name: "Tags",
  //     fieldName: "tags",
  //     minWidth: 100,
  //     maxWidth: 200,
  //     isResizable: true,
  //     onRender: item =>
  //       item.tags.map(
  //         tag => <span><Link to={`/blog/tags/${tag}`}>{tag}</Link>{`   `}</span>
  //       ),
  //   },
  // ];

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
        spotify {name,url}
        soundcloud {name,url}
        lastfm {name,url}
        bandcamp {name,url}
        applemusic {name,url}
      }
    }
  }
  allFile(filter: {sourceInstanceName: {eq: "music"}}) {
    nodes {
      extension
      name
      publicURL
    }
  }
}
`;
