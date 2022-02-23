import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { useConst } from "@fluentui/react-hooks";
import { OutboundLink } from "gatsby-plugin-google-gtag";

import FluentUIGallery from "../../templates/gallery";

const InstagramPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  // Join together image files and image metadata
  const photosUnion = useConst(data.allInstagramJson.nodes.map(flerp => {
    const file = data.allFile.nodes.find(v => flerp.name.startsWith(v.name));
    const gatsbyImageData = file ? file.childImageSharp.gatsbyImageData : null;
    const timestamp = new Date(flerp.creation_timestamp * 1000).toLocaleDateString();
    const caption = flerp.title.length > 20 ? (flerp.title.substring(0, 17) + "...") : flerp.title;

    return {
      ...flerp,
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
        Custom implementation of my own{" "}
        <OutboundLink target="_blank" href="https://www.instagram.com/codegard1/">
          Instagram feed
        </OutboundLink>. I used to host the images on Azure but it's really much better to use Git LFS and host them locally instead. Hey!!
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
