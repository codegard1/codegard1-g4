import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import Seo from "../../components/seo";

const GalleryIndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Gallery" keywords={[`gallery`, `photos`, `Instagram`]} />
      <h2><Link to="/gallery">Gallery</Link></h2>
      <h4>Amateur Photography by Yours Truly</h4>

      <h5>🤳&nbsp;<Link to="/gallery/instagram">Instagram Feed</Link>&nbsp;({data.instagram.totalCount})</h5>
      
      <h5>🔬&nbsp;<Link to="/gallery/microscope">Microscope</Link>&nbsp;({data.microscope.totalCount})</h5>

      <h5>👞&nbsp;<Link to="/gallery/shoes">Shoes</Link>&nbsp;({data.shoes.totalCount})</h5>

    </Layout>
  );
};

export default GalleryIndexPage;

export const pageQuery = graphql`
query {
  microscope: allFile(filter: {sourceInstanceName: {eq: "microscope"}}) {
    totalCount
  }
	shoes: allFile(filter: {sourceInstanceName: {eq: "shoes"}}) {
    totalCount
  }
	instagram: allFile(filter: {sourceInstanceName: {eq: "instagram"}}) {
    totalCount
  }
  site {
    siteMetadata {
      title
    }
  }
}
`;
