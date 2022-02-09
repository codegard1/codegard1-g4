import React, { useState, useCallback } from "react";
import { Modal, ModalGateway } from "react-images";
import { Carousel } from "react-responsive-carousel";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import Layout from "../../components/layout";
import Seo from "../../components/seo";

import { FocusZone } from "@fluentui/react/lib/FocusZone";
import { List } from "@fluentui/react/lib/List";
import { getTheme, mergeStyleSets } from "@fluentui/react/lib/Styling";
import { useConst } from "@fluentui/react-hooks";

// css for the Carousel
import "react-responsive-carousel/lib/styles/carousel.css";

const ROWS_PER_PAGE = 1;
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
});

const ShoesPage = ({ data, location }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const siteTitle = data.site.siteMetadata?.title || `Title`;

  // Preprocess images (local files)
  const photos = useConst(data.allImageSharp.edges);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setViewerIsOpen(false);
    setCurrentImage(0);
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
            <GatsbyImage image={item.node.gatsbyImageData} alt="Picture of a shoe" />
            <span className={classNames.listGridLabel}>{index + 1}&nbsp;of&nbsp;{photos.length}&nbsp;|&nbsp;{item.node.id.substr(0, 7)}</span>
          </div>
        </div>
      </div>
    );
  }, [openLightbox, photos.length]);

  const getPageHeight = React.useCallback(() => {
    return rowHeight.current * ROWS_PER_PAGE;
  }, []);

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Gallery" keywords={[`gallery`, `photos`, `Instagram`]} />
      <h2>Gallery</h2>

      <h4>Shoes</h4>
      <p>
        Choose mang
      </p>

      <FocusZone>
        <List
          className={classNames.listGrid}
          items={photos}
          getItemCountForPage={getItemCountForPage}
          getPageHeight={getPageHeight}
          renderedWindowsAhead={1}
          onRenderCell={onRenderCell}
        />

        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                animationHandler={"fade"}
                dynamicHeight
                selectedItem={currentImage}
                showArrows
                showIndicators={false}
                showThumbs={false}
                autoPlay={false}
                onClickItem={closeLightbox}
                children={photos.map(p =>
                  <GatsbyImage image={p.node.gatsbyImageData} alt="Photo of a shoe" />
                )}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </FocusZone>
    </Layout>
  );
};

export default ShoesPage;

export const pageQuery = graphql`
query {
  allImageSharp(limit: 50) {
    edges {
      node {
        gatsbyImageData(
          formats: AUTO
          placeholder: DOMINANT_COLOR
          breakpoints: 10
          jpgOptions: {progressive: true}
          quality: 7
        )
        id
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
