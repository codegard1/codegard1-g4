import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import sharp from "sharp";

export const galleryCollections = ["instagram", "microscope", "shoes"] as const;
export type GalleryCollection = (typeof galleryCollections)[number];

export interface GalleryPhoto {
  /** Public URL of the image */
  src: string;
  width: number;
  height: number;
  /** Short title/caption, if any */
  title: string | null;
  /** ISO timestamp, if known */
  timestamp: string | null;
  /** Human readable date, if known */
  dateLabel: string | null;
  /** Alt text for the image */
  alt: string;
}

export interface GalleryInfo {
  slug: GalleryCollection;
  name: string;
  emoji: string;
  blurb: string;
}

export const galleryInfo: Record<GalleryCollection, GalleryInfo> = {
  instagram: {
    slug: "instagram",
    name: "Instagram Feed",
    emoji: "🤳",
    blurb: "Selection of images from my own Instagram feed.",
  },
  microscope: {
    slug: "microscope",
    name: "Microscope",
    emoji: "🔬",
    blurb: "Photos of small things up close",
  },
  shoes: {
    slug: "shoes",
    name: "Shoes",
    emoji: "👞",
    blurb:
      "I notice shoes fairly often, and when I see an abandoned pair, or, more often, a single, I always take a moment to imagine how it might have ended up there. This is my collection of discarded shoe photos.",
  },
};

interface InstagramEntry {
  title: string;
  creation_timestamp: string;
  name: string;
}

interface MicroscopeEntry {
  name: string;
  creation_timestamp: string;
  title: string | null;
}

const PUBLIC_DIR = path.join(process.cwd(), "public");
const DATA_DIR = path.join(process.cwd(), "content", "data");
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function labelFor(timestamp: string | null): string | null {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  return Number.isNaN(d.getTime()) ? null : dateFormatter.format(d);
}

async function readJson<T>(name: string): Promise<T> {
  return JSON.parse(await fs.readFile(path.join(DATA_DIR, name), "utf8")) as T;
}

/** Image files in public/gallery/<collection> with their pixel dimensions. */
const listImages = cache(async (collection: string) => {
  const dir = path.join(PUBLIC_DIR, "gallery", collection);
  const names = (await fs.readdir(dir)).filter((n) => IMAGE_EXT.test(n)).sort();
  const files = await Promise.all(
    names.map(async (name) => {
      const meta = await sharp(path.join(dir, name)).metadata();
      // Honour EXIF orientation: swap dimensions for rotated photos.
      const rotated = meta.orientation !== undefined && meta.orientation >= 5;
      const width = rotated ? meta.height : meta.width;
      const height = rotated ? meta.width : meta.height;
      return {
        name,
        stem: name.replace(/\.[^.]+$/, ""),
        src: `/gallery/${collection}/${name}`,
        width: width ?? 1000,
        height: height ?? 1000,
      };
    })
  );
  return files;
});

export const getGalleryPhotos = cache(
  async (collection: GalleryCollection): Promise<GalleryPhoto[]> => {
    const files = await listImages(collection);

    if (collection === "instagram") {
      const entries = await readJson<InstagramEntry[]>("instagram.json");
      const photos: GalleryPhoto[] = [];
      for (const entry of entries) {
        const file = files.find((f) => entry.name.startsWith(f.stem));
        if (!file) continue;
        const title = entry.title?.trim() || null;
        photos.push({
          src: file.src,
          width: file.width,
          height: file.height,
          title,
          timestamp: entry.creation_timestamp,
          dateLabel: labelFor(entry.creation_timestamp),
          alt: title ?? `Instagram photo ${file.stem}`,
        });
      }
      return photos.sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? ""));
    }

    if (collection === "microscope") {
      const entries = await readJson<MicroscopeEntry[]>("microscope.json");
      const byName = new Map(entries.map((e) => [e.name, e]));
      return files.map((file) => {
        const entry = byName.get(file.name);
        const title = entry?.title?.trim() || null;
        return {
          src: file.src,
          width: file.width,
          height: file.height,
          title,
          timestamp: entry?.creation_timestamp ?? null,
          dateLabel: labelFor(entry?.creation_timestamp ?? null),
          alt: title ?? `Microscope photo ${file.stem}`,
        };
      });
    }

    return files.map((file) => ({
      src: file.src,
      width: file.width,
      height: file.height,
      title: null,
      timestamp: null,
      dateLabel: null,
      alt: `Shoe photo ${file.stem}`,
    }));
  }
);

export async function getGalleryCounts(): Promise<Record<GalleryCollection, number>> {
  const counts = await Promise.all(
    galleryCollections.map(async (c) => [c, (await getGalleryPhotos(c)).length] as const)
  );
  return Object.fromEntries(counts) as Record<GalleryCollection, number>;
}

export function isGalleryCollection(value: string): value is GalleryCollection {
  return (galleryCollections as readonly string[]).includes(value);
}
