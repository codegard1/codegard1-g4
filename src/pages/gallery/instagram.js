import React, { useState, useCallback } from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { FocusZone } from "@fluentui/react/lib/FocusZone";
import { List } from "@fluentui/react/lib/List";
import { useConst, useId } from "@fluentui/react-hooks";
import { getTheme, mergeStyleSets, Modal } from '@fluentui/react';
import { OutboundLink } from "gatsby-plugin-google-gtag";

const ROWS_PER_PAGE = 2;
const MAX_ROW_HEIGHT = 200;
const theme = getTheme();
const { palette, fonts } = theme;
const classNames = mergeStyleSets({
  listGrid: {
    overflow: "hidden",
    fontSize: 0,
    position: "relative",
  },
  listGridTile: {
    textAlign: "center",
    outline: "none",
    position: "relative",
    float: "left",
    background: palette.neutralLighter,
    selectors: {
      "focus:after": {
        content: "",
        position: "absolute",
        left: 2,
        right: 2,
        top: 2,
        bottom: 2,
        boxSizing: "border-box",
        border: `1px solid ${palette.white}`,
      },
    },
  },
  listGridSizer: {
    paddingBottom: "100%",
  },
  listGridPadder: {
    position: "absolute",
    left: 5,
    top: 2,
    right: 5,
    bottom: 2,
  },
  listGridLabel: {
    background: "rgba(0, 0, 0, 0.3)",
    color: "#FFFFFF",
    position: "absolute",
    padding: 10,
    bottom: 0,
    left: 0,
    width: "100%",
    fontSize: fonts.small.fontSize,
    boxSizing: "border-box",
  },
  listGridImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
});

const InstagramPage = ({ data, location }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const siteTitle = data.site.siteMetadata?.title || `Title`;

  // Union join photo files and photo metadata
  const photosUnion = useConst(data.allInstagramPostsJson.nodes.map(flerp => {
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

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setViewerIsOpen(false);
    // setCurrentImage(0);
  };

  const columnCount = React.useRef(0);
  const rowHeight = React.useRef(0);

  const getItemCountForPage = React.useCallback((itemIndex, surfaceRect) => {
    if (itemIndex === 0) {
      columnCount.current = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      rowHeight.current = Math.floor(surfaceRect.width / columnCount.current);
    }
    return columnCount.current * ROWS_PER_PAGE;
  }, []);

  const onRenderCell = React.useCallback((item, index) => {
    return (
      <div
        className={classNames.listGridTile}
        data-is-focusable
        style={{
          width: 100 / columnCount.current + "%",
        }}
        onClick={e => {
          openLightbox(e, { item, index });
        }}
      >
        <div className={classNames.listGridSizer}>
          <div className={classNames.listGridPadder}>
            <GatsbyImage image={item.gatsbyImageData} alt={item.title} className={classNames.listGridImage} />
            <span className={classNames.listGridLabel}>
              {item.timestamp}
            </span>
          </div>
        </div>
      </div>
    );
  }, [openLightbox]);

  const getPageHeight = React.useCallback(() => {
    return rowHeight.current * ROWS_PER_PAGE;
  }, []);

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Gallery" keywords={[`gallery`, `photos`, `Instagram`]} />
      <h2><Link to="/gallery">Gallery</Link></h2>

      <h4>Instagram Feed</h4>
      <p>
        Custom implementation of my own{" "}
        <OutboundLink target="_blank" href="https://www.instagram.com/codegard1/">
          Instagram feed
        </OutboundLink>. I used to host the images on Azure but it's really much better to use Git LFS and host them locally instead. 
      </p>

      <FocusZone>
        <List
          className={classNames.listGrid}
          items={photosUnion}
          getItemCountForPage={getItemCountForPage}
          getPageHeight={getPageHeight}
          renderedWindowsAhead={1}
          onRenderCell={onRenderCell}
        />

        <Modal
          titleAriaId={useId('modal')}
          isOpen={viewerIsOpen}
          onDismiss={closeLightbox}
          isBlocking={false}
          containerClassName={classNames.container}
        >
          <GatsbyImage
            image={photosUnion[currentImage].gatsbyImageData}
            alt={photosUnion[currentImage].title}
            style={{ maxWidth: "500px" }} onClick={closeLightbox} />
          <span className={classNames.listGridLabel}>
            {photosUnion[currentImage].timestamp}
            {` `}
            {photosUnion[currentImage].title}
          </span>
        </Modal>
      </FocusZone>
    </Layout>
  );
};

export default InstagramPage;

export const pageQuery = graphql`
query {
  allInstagramPostsJson(
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