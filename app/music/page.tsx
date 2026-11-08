import type { Metadata } from "next";
import Image from "next/image";
import ExternalLink from "@/components/ExternalLink";
import { getReleases } from "@/lib/music";
import { site, social } from "@/lib/site";

export const metadata: Metadata = {
  title: "Music",
  description: "Music by Ciaervo on SoundCloud, Bandcamp, Spotify and Apple Music.",
  keywords: ["music", "audio", "Ciaervo"],
};

export default async function MusicPage() {
  const { applemusic, bandcamp, soundcloud, spotify } = social;
  const releases = await getReleases();

  return (
    <>
      <h2>Music</h2>
      <p>
        I make music sometimes using Logic or Fruity Loops. You can find some of my tracks on{" "}
        <ExternalLink href={soundcloud.url}>SoundCloud</ExternalLink>,{" "}
        <ExternalLink href={bandcamp.url}>BandCamp</ExternalLink>,{" "}
        <ExternalLink href={spotify.url}>Spotify</ExternalLink>,{" "}
        <ExternalLink href={applemusic.url}>Apple Music</ExternalLink>, etc.
      </p>

      <div className="iframe-wrapper">
        <iframe
          title="Ciaervo Music on SoundCloud"
          width="500"
          height="600"
          scrolling="no"
          allow="autoplay"
          loading="lazy"
          src={site.soundcloudPlaylistEmbed}
        ></iframe>
        <div>
          <ExternalLink href={soundcloud.url} title="Ciaervo">
            Ciaervo
          </ExternalLink>{" "}
          ·{" "}
          <ExternalLink href="https://soundcloud.com/ciaervo/sets/all-tracks" title="All Tracks">
            Distributed
          </ExternalLink>
        </div>
      </div>

      <h4>Releases</h4>
      <ul className="release-list">
        {releases.map((r) => (
          <li key={r.title} className="release">
            {r.artwork && (
              <Image
                src={r.artwork}
                alt={`Artwork for ${r.title}`}
                width={120}
                height={120}
                sizes="120px"
                className="release-art"
              />
            )}
            <div className="release-info">
              <strong>{r.url ? <ExternalLink href={r.url}>{r.title}</ExternalLink> : r.title}</strong>
              <br />
              <small>
                {r.artist}
                {r.releaseDate ? ` · ${r.releaseDate}` : ""} · {r.tracks.length} track
                {r.tracks.length === 1 ? "" : "s"}
              </small>
              <details>
                <summary>Tracks</summary>
                <ol>
                  {r.tracks.map((t) => (
                    <li key={t.title}>
                      {t.url ? <ExternalLink href={t.url}>{t.title}</ExternalLink> : t.title}
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
