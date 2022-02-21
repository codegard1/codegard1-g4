import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { useConst } from "@fluentui/react-hooks";
import FluentUIGallery from "../../templates/gallery";

const MicroscopePage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  // Join together image files and image metadata
  const photosUnion = useConst(data.allMicroscopeJson.nodes.map(node => {
    const file = data.allFile.nodes.find(v => node.name.startsWith(v.name));
    const gatsbyImageData = file ? file.childImageSharp.gatsbyImageData : null;

    const timestamp = new Date(node.creation_timestamp).toLocaleDateString();

    const caption = node.name.length > 20 ? (node.name.substring(0, 17) + "...") : node.name;

    return {
      ...node,
      caption,
      gatsbyImageData,
      timestamp,
    }
  }));

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Gallery" keywords={[`gallery`, `photos`, `Instagram`]} />
      <h2><Link to="/gallery">Gallery</Link></h2>
      <h4>Microscope</h4>
      <p>
        Photos of small things up close
      </p>

      <FluentUIGallery photoData={photosUnion} />
    </Layout >
  );
};

export default MicroscopePage;

export const pageQuery = graphql`
query {
  allFile(
    filter: {sourceInstanceName: {eq: "microscope"}}
    sort: {order: ASC, fields: name}
  ) {
    totalCount
    nodes {
      id
      name
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
  }
  allMicroscopeJson {
    nodes {
      id
      name
      creation_timestamp
    }
  }
  site {
    siteMetadata {
      title
    }
  }
}
`;
