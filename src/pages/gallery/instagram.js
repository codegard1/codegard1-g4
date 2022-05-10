import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { useConst } from "@fluentui/react-hooks";
import { OutboundLink } from "gatsby-plugin-google-gtag";

import FluentUIGallery from "../../templates/gallery";

const InstagramPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  // filter out photos that do not match a local image
  const extantImages = data.allInstagramJson.nodes.filter(baz => data.allFile.nodes.find(bar => baz.name.startsWith(bar.name))
  );

  // Join together image files and image metadata
  const photosUnion = useConst(extantImages.map(foo => {
    const file = data.allFile.nodes.find(v => foo.name.startsWith(v.name));
    const timestamp = new Date(foo.creation_timestamp).toLocaleDateString();
    const caption = foo.title.length > 20 ? (foo.title.substring(0, 17) + "...") : foo.title;
    const gatsbyImageData = file ? file.childImageSharp.gatsbyImageData : null;

    return {
      foo,
      timestamp,
      caption,
      gatsbyImageData
    }
  }));


  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Gallery" keywords={[`gallery`, `photos`, `Instagram`]} />
      <h2><Link to="/gallery">Gallery</Link></h2>

      <h4>Instagram Feed</h4>
      <p>
        Selection of images from my own{" "}
        <OutboundLink target="_blank" href="https://www.instagram.com/codegard1/">
          Instagram feed
        </OutboundLink>.
      </p>

      <FluentUIGallery photoData={photosUnion} />

    </Layout>
  );
};

export default InstagramPage;

export const pageQuery = graphql`
query {
  allInstagramJson(
    sort: {fields: creation_timestamp, order: DESC}
  ) {
    nodes {
      creation_timestamp
      name
      title
    }
  }
  allFile(
    filter: {sourceInstanceName: {eq: "instagram"}}
    ) {
    nodes {
      name
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
        )
      }
    }
  }
  site {
    siteMetadata {
      title
    }
  }
}  
`;
