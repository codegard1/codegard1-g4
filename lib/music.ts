import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

interface SoundCloudTrack {
  artist: string;
  title: string;
  album: string;
  releasedate: string;
  trackurl: string;
  albumurl: string;
  artwork: string;
}

export interface Release {
  title: string;
  artist: string;
  releaseDate: string | null;
  url: string | null;
  artwork: string | null;
  tracks: { title: string; url: string | null }[];
}

function clean(value: string | undefined): string | null {
  const v = value?.trim();
  return v && v.toLowerCase() !== "n/a" ? v : null;
}

/** Releases grouped from content/data/soundcloud.json, in file order (newest first). */
export const getReleases = cache(async (): Promise<Release[]> => {
  const file = path.join(process.cwd(), "content", "data", "soundcloud.json");
  const tracks = JSON.parse(await fs.readFile(file, "utf8")) as SoundCloudTrack[];
  const releases = new Map<string, Release>();
  for (const t of tracks) {
    let release = releases.get(t.album);
    if (!release) {
      release = {
        title: t.album,
        artist: t.artist,
        releaseDate: clean(t.releasedate),
        url: clean(t.albumurl),
        artwork: clean(t.artwork) ? `/gallery/music/${t.artwork}` : null,
        tracks: [],
      };
      releases.set(t.album, release);
    }
    release.tracks.push({ title: t.title, url: clean(t.trackurl) });
  }
  return [...releases.values()];
});
