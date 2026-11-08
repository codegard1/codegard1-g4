import type { Metadata } from "next";
import Link from "next/link";
import { galleryCollections, galleryInfo, getGalleryCounts } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Amateur photography by Chris Odegard.",
  keywords: ["gallery", "photos", "Instagram"],
};

export default async function GalleryIndexPage() {
  const counts = await getGalleryCounts();
  return (
    <>
      <h2>
        <Link href="/gallery">Gallery</Link>
      </h2>
      <h4>Amateur Photography by Yours Truly</h4>
      {galleryCollections.map((c) => (
        <h5 key={c}>
          <span aria-hidden="true">{galleryInfo[c].emoji}</span>&nbsp;
          <Link href={`/gallery/${c}`}>{galleryInfo[c].name}</Link>&nbsp;({counts[c]})
        </h5>
      ))}
    </>
  );
}
