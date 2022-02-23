import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { useConst } from "@fluentui/react-hooks";
import FluentUIGallery from "../../templates/gallery";

const ShoesPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  // Join together image files and image metadata
  const photosUnion = useConst(data.allShoesJson.nodes.map(node => {
    const file = data.allFile.nodes.find(v => node.name.startsWith(v.name));
    const gatsbyImageData = file ? file.childImageSharp.gatsbyImageData : null;

    const createdDate = node.creation_timestamp ? node.creation_timestamp : node.created_timestamp;
    const timestamp = new Date(createdDate).toLocaleDateString();

    const titleOrNot = node.title ? node.title : node.name;
    const caption = titleOrNot.length > 20 ? (titleOrNot.substring(0, 17) + "...") : titleOrNot;

    return {
      ...node,
      caption,
      gatsbyImageData,
      timestamp,
    }
  }));

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Gallery" keywords={[`gallery`, `photos`, `shoes`]} />
      <h2><Link to="/gallery">Gallery</Link></h2>
      <h4>Shoes</h4>
      <p>
        I notice shoes fairly often, and when I see an abandoned pair, or, more often, a single, I always take a moment to imagine how it might have ended up there. This is my collection of discarded shoe photos.
      </p>

      <FluentUIGallery photoData={photosUnion} />
    </Layout >
  );
};

export default ShoesPage;

export const pageQuery = graphql`
query {
  allFile(
      filter: {sourceInstanceName: {eq: "shoes"}}
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
  allShoesJson {
    nodes {
      id
      name
      creation_timestamp
      created_timestamp
    }
  }
  site {
    siteMetadata {
      title
    }
  }
}
`;
