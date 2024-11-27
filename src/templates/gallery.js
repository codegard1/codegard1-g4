import React, { useState, useCallback } from "react";
// import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import { FocusZone } from "@fluentui/react/lib/FocusZone";
import { List } from "@fluentui/react/lib/List";
import { useId } from "@fluentui/react-hooks";
import { getTheme, mergeStyleSets, Modal } from '@fluentui/react';

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

const FluentUIGallery = ({ photoData }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

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
        role="gridcell"
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
              {index+1}&nbsp;/&nbsp;{photoData.length}
            </span>
          </div>
        </div>
      </div>
    );
  }, [openLightbox,photoData.length]);

  const getPageHeight = React.useCallback(() => {
    return rowHeight.current * ROWS_PER_PAGE;
  }, []);

  return (
    <FocusZone>
      <List
        className={classNames.listGrid}
        items={photoData}
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
          image={photoData[currentImage].gatsbyImageData}
          alt={photoData[currentImage].title}
          style={{ maxWidth: "500px" }} onClick={closeLightbox} />
        <span className={classNames.listGridLabel}>
          {photoData[currentImage].timestamp}
          {` `}
          {photoData[currentImage].title}
        </span>
      </Modal>
    </FocusZone>

  );
};

export default FluentUIGallery;
