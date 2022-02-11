import React, { useState, useCallback } from "react";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { FocusZone } from "@fluentui/react/lib/FocusZone";
import { List } from "@fluentui/react/lib/List";
import { useConst, useId } from "@fluentui/react-hooks";
import { getTheme, mergeStyleSets, Modal } from "@fluentui/react";
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

const ShoesPage = ({ data, location }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const siteTitle = data.site.siteMetadata?.title || `Title`;

  // Preprocess images (local files)
  const photos = useConst(data.allFile.edges);
  const totalCount = useConst(data.allFile.totalCount);

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
            <GatsbyImage image={item.node.childImageSharp.gatsbyImageData} alt="Picture of a shoe" />
            <span className={classNames.listGridLabel}>{index + 1}&nbsp;of&nbsp;{totalCount}&nbsp;|&nbsp;{item.node.id.substr(0, 7)}</span>
          </div>
        </div>
      </div>
    );
  }, [openLightbox, totalCount]);

  const getPageHeight = React.useCallback(() => {
    return rowHeight.current * ROWS_PER_PAGE;
  }, []);

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Gallery" keywords={[`gallery`, `photos`, `Instagram`]} />
      <h2>Gallery</h2>

      <h4>Shoes</h4>
      <p>
        I notice shoes fairly often, and when I see an abandoned pair, or, more often, a single, I always take a moment to imagine how it might have ended up there. This is my collection of discarded shoe photos. 
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
        <Modal
          titleAriaId={useId('modal')}
          isOpen={viewerIsOpen}
          onDismiss={closeLightbox}
          isBlocking={false}
          containerClassName={classNames.container}
        >
          <GatsbyImage
            image={photos[currentImage].node.childImageSharp.gatsbyImageData}
            alt="Photo of a shoe"
            style={{ maxWidth: "500px" }}
            onClick={closeLightbox}
          />
        </Modal>
      </FocusZone>
    </Layout >
  );
};

export default ShoesPage;

export const pageQuery = graphql`
query {
  allFile(filter: {sourceInstanceName: {eq: "shoes"}}, limit: 50) {
    totalCount
    nodes {
      id
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
