import { Link, useParams } from "react-router-dom";
import ExternalLink from "../components/ExternalLink";
import GalleryViewer from "../components/GalleryViewer";
import { useDocumentTitle } from "../components/Layout";
import { social } from "../config/site";
import {
  galleryCollections,
  galleryInfo,
  getGalleryCounts,
  getGalleryPhotos,
  isGalleryCollection,
} from "../data/content";
import NotFoundPage from "./NotFoundPage";

export function GalleryIndexPage() {
  useDocumentTitle("Gallery");
  const counts = getGalleryCounts();

  return (
    <>
      <h2>
        <Link to="/gallery">Gallery</Link>
      </h2>
      <h4>Amateur Photography by Yours Truly</h4>
      {galleryCollections.map((c) => (
        <h5 key={c}>
          <span aria-hidden="true">{galleryInfo[c].emoji}</span>&nbsp;
          <Link to={`/gallery/${c}`}>{galleryInfo[c].name}</Link>&nbsp;({counts[c]})
        </h5>
      ))}
    </>
  );
}

export function GalleryCollectionPage() {
  const { collection } = useParams<{ collection: string }>();
  const valid = collection !== undefined && isGalleryCollection(collection);
  const info = valid ? galleryInfo[collection] : null;
  useDocumentTitle(info ? `Gallery: ${info.name}` : undefined);

  if (!valid || !info) return <NotFoundPage />;

  const photos = getGalleryPhotos(collection);

  return (
    <>
      <h2>
        <Link to="/gallery">Gallery</Link>
      </h2>
      <h4>{info.name}</h4>
      {collection === "instagram" ? (
        <p>
          Selection of images from my own{" "}
          <ExternalLink href={social.instagram.url}>Instagram feed</ExternalLink>.
        </p>
      ) : (
        <p>{info.blurb}</p>
      )}
      <p>
        <small>{photos.length} photos</small>
      </p>
      <GalleryViewer photos={photos} />
    </>
  );
}
