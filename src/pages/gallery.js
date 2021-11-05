import React, { useState, useCallback } from "react";
import Carousel, { Modal, ModalGateway } from "react-images";

// import { graphql } from "gatsby";

// import "bootstrap/dist/css/bootstrap.css";
// import "./index.css";

import Layout from "../components/layout";
import Seo from "../components/seo";
// import Sidebar from "../components/sidebar/Sidebar";

import { FocusZone } from '@fluentui/react/lib/FocusZone';
import { List } from '@fluentui/react/lib/List';
import { getTheme, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { useConst } from '@fluentui/react-hooks';
import JSONData from '../../content/data/instagram_posts.json';


const ROWS_PER_PAGE = 1;
const MAX_ROW_HEIGHT = 200;
const theme = getTheme();
const { palette, fonts } = theme;
const classNames = mergeStyleSets({
  listGrid: {
    overflow: 'hidden',
    fontSize: 0,
    position: 'relative',
  },
  listGridTile: {
    textAlign: 'center',
    outline: 'none',
    position: 'relative',
    float: 'left',
    background: palette.neutralLighter,
    selectors: {
      'focus:after': {
        content: '',
        position: 'absolute',
        left: 2,
        right: 2,
        top: 2,
        bottom: 2,
        boxSizing: 'border-box',
        border: `1px solid ${palette.white}`,
      },
    },
  },
  listGridSizer: {
    paddingBottom: '100%',
  },
  listGridPadder: {
    position: 'absolute',
    left: 5,
    top: 2,
    right: 5,
    bottom: 2,
  },
  listGridLabel: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#FFFFFF',
    position: 'absolute',
    padding: 10,
    bottom: 0,
    left: 0,
    width: '100%',
    fontSize: fonts.small.fontSize,
    boxSizing: 'border-box',
  },
  listGridImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
});


// const GalleryPage = () => {
//   const [currentImage, setCurrentImage] = useState(0);
//   const [viewerIsOpen, setViewerIsOpen] = useState(false);

//   // Public url prefix for images store in Azure
//   const blobStorageBaseUrl = `https://gadzooks.blob.core.windows.net/instagram/`;

//   // Pre-process image data from JSON
//   // const photos = useConst(
//   //   JSONData.map(photo => ({
//   //     ...photo,
//   //     height: (photo.height / 2),
//   //     width: (photo.width / 2),
//   //     src: blobStorageBaseUrl + photo.uri,
//   //     key: `photo_${photo.id}`
//   //   }))
//   // );

//   const openLightbox = useCallback((event, { photo, index }) => {
//     setCurrentImage(index);
//     setViewerIsOpen(true);
//   }, []);

//   const closeLightbox = () => {
//     setCurrentImage(0);
//     setViewerIsOpen(false);
//   };

//   const columnCount = React.useRef(0);
//   const rowHeight = React.useRef(0);

//   const getItemCountForPage = React.useCallback((itemIndex, surfaceRect) => {
//     if (itemIndex === 0) {
//       columnCount.current = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
//       rowHeight.current = Math.floor(surfaceRect.width / columnCount.current);
//     }
//     return columnCount.current * ROWS_PER_PAGE;
//   }, []);

//   const onRenderCell = React.useCallback((item, index) => {
//     return (
//       <div
//         className={classNames.listGridTile}
//         data-is-focusable
//         style={{
//           width: 100 / columnCount.current + '%',
//         }}
//         onClick={(e) => { openLightbox(e, { item, index }) }}
//       >
//         <div className={classNames.listGridSizer}>
//           <div className={classNames.listGridPadder}>
//             <img src={item.src} className={classNames.listGridImage} />
//             {/* <span className={classNames.listGridLabel}>{item.title}</span> */}
//           </div>
//         </div>
//       </div>
//     );
//   }, []);

//   const getPageHeight = React.useCallback(() => {
//     return rowHeight.current * ROWS_PER_PAGE;
//   }, []);

//   return (
//     <Layout>
//       <Seo title="Gallery" keywords={[`gallery`, `photos`, `Instagram`]} />
//       <h2>Gallery</h2>
//       <p>
//         Custom implementation of my own <a target="_blank" href="https://www.instagram.com/codegard1/">Instagram feed</a> using <a href="https://azure.microsoft.com/en-us/services/storage/blobs/" target="_blank">Azure Blob Storage </a> and <a href="https://github.com/neptunian/react-photo-gallery" target="_blank">List Grid</a>.
//       </p>
//       <p>See also: <a href="https://github.com/codegard1/imagal3/" target="_blank">Imagal3 on GitHub</a></p>

//       <FocusZone>
//         <List
//           className={classNames.listGrid}
//           items={photos}
//           getItemCountForPage={getItemCountForPage}
//           getPageHeight={getPageHeight}
//           renderedWindowsAhead={1}
//           onRenderCell={onRenderCell}
//         />
//       </FocusZone>
//       <ModalGateway> */}
//         {viewerIsOpen ? (
//           <Modal onClose={closeLightbox}>
//             <Carousel
//               currentIndex={currentImage}
//               views={photos.map(x => ({
//                 ...x,
//                 srcset: x.srcSet,
//                 caption: x.title
//               }))}
//             />
//           </Modal>
//         ) : null}
//       </ModalGateway>
//     </Layout>
//   );
// };

// export default GalleryPage;
