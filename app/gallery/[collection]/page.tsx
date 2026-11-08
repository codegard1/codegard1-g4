import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExternalLink from "@/components/ExternalLink";
import Gallery from "@/components/Gallery";
import { galleryCollections, galleryInfo, getGalleryPhotos, isGalleryCollection } from "@/lib/gallery";
import { social } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return galleryCollections.map((collection) => ({ collection }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  if (!isGalleryCollection(collection)) return {};
  const info = galleryInfo[collection];
  return {
    title: `Gallery: ${info.name}`,
    description: info.blurb,
    keywords: ["gallery", "photos", info.name],
  };
}

export default async function GalleryCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!isGalleryCollection(collection)) notFound();
  const info = galleryInfo[collection];
  const photos = await getGalleryPhotos(collection);

  return (
    <>
      <h2>
        <Link href="/gallery">Gallery</Link>
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
      <Gallery photos={photos} />
    </>
  );
}
