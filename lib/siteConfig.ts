import path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SocialLink {
  name: string;
  url: string;
}

export interface SiteAuthor {
  name: string;
  bio: string;
  summary: string;
}

export interface SiteMetadata {
  title: string;
  author: SiteAuthor;
  description: string;
  siteUrl: string;
  social: Record<string, SocialLink>;
}

export interface ContentPaths {
  /** Source images in src/images (e.g. profile pic) */
  srcImages: string;
  /** Shoe photography gallery */
  shoes: string;
  /** Instagram photography gallery */
  instagram: string;
  /** Microscope photography gallery */
  microscope: string;
  /** Music-related assets */
  music: string;
  /** Markdown blog posts — content/blog/<slug>/index.md */
  blog: string;
  /** JSON/CSV data files */
  data: string;
}

export interface ImageDefaults {
  formats: string[];
  placeholder: string;
  quality: number;
  breakpoints: number[];
  backgroundColor: string;
}

export interface GoogleGtagConfig {
  trackingId: string;
  anonymizeIp: boolean;
  respectDNT: boolean;
  loadInHead: boolean;
}

export interface ManifestConfig {
  name: string;
  shortName: string;
  startUrl: string;
  backgroundColor: string;
  display: string;
  /** Path relative to project root */
  icon: string;
}

// ---------------------------------------------------------------------------
// Site metadata (was gatsby-config.js → siteMetadata)
// ---------------------------------------------------------------------------

export const siteMetadata: SiteMetadata = {
  title: "Codegard1",
  author: {
    name: "Chris Odegard",
    bio: "Amateur artist / professional nerd",
    summary: "I like to make things with computers and pens",
  },
  description: "Codegard1's personal site",
  siteUrl: "https://codegard1.com",
  social: {
    applemusic: { url: "https://music.apple.com/us/artist/1592784321", name: "Apple Music" },
    bandcamp:   { url: "https://ciaervo.bandcamp.com/", name: "Bandcamp" },
    deviantart: { url: "https://www.deviantart.com/ciaervo/", name: "Deviantart" },
    email:      { url: "mailto:ciaervo@gmail.com?subject=Enquiry%20from%20a%20Peruser", name: "e-mail" },
    github:     { url: "https://github.com/codegard1", name: "github" },
    instagram:  { url: "https://instagram.com/ciaervo", name: "Instagram" },
    keybase:    { url: "https://keybase.io/ciaervo", name: "Keybase" },
    lastfm:     { url: "https://www.last.fm/user/codegard1", name: "LastFM" },
    linkedin:   { url: "https://www.linkedin.com/in/codegard1", name: "LinkedIn" },
    soundcloud: { url: "https://soundcloud.com/ciaervo", name: "SoundCloud" },
    stackoverflow: {
      url: "https://stackoverflow.com/users/2852366/chris-odegard?tab=profile",
      name: "StackOverflow",
    },
    spotify: {
      url: "https://open.spotify.com/artist/3MS6P6gKoxxcSJoEqqNQST?si=dHeDrh3WS4iAB1lw2bAGDg",
      name: "Spotify",
    },
    tumblr:  { url: "https://ciaervo1.tumblr.com", name: "Tumblr" },
    twitch:  { url: "https://www.twitch.tv/ciaervo", name: "Twitch" },
    twitter: { url: "https://twitter.com/ciaervo1", name: "Twitter" },
    youtube: { url: "https://www.youtube.com/channel/UCL3N9vvGRSoeGB5Wi3XhhrQ", name: "Youtube" },
  },
};

// ---------------------------------------------------------------------------
// Content / resource paths (was gatsby-source-filesystem entries)
// All paths are absolute so they work from any cwd.
// ---------------------------------------------------------------------------

export const contentPaths: ContentPaths = {
  srcImages:  path.join(process.cwd(), "src/images"),
  shoes:      path.join(process.cwd(), "content/images/shoes"),
  instagram:  path.join(process.cwd(), "content/images/instagram"),
  microscope: path.join(process.cwd(), "content/images/microscope"),
  music:      path.join(process.cwd(), "content/images/music"),
  blog:       path.join(process.cwd(), "content/blog"),
  data:       path.join(process.cwd(), "content/data"),
};

// ---------------------------------------------------------------------------
// Image optimisation defaults (was gatsby-plugin-sharp → defaults)
// Used when configuring next/image or a custom sharp pipeline.
// ---------------------------------------------------------------------------

export const imageDefaults: ImageDefaults = {
  formats: ["auto", "webp"],
  placeholder: "blurred",
  quality: 50,
  breakpoints: [750, 1080, 1366, 1920],
  backgroundColor: "transparent",
};

// ---------------------------------------------------------------------------
// Google Analytics / gtag (was gatsby-plugin-google-gtag)
// Use with next/script in pages/_document.tsx or a shared Analytics component.
// ---------------------------------------------------------------------------

export const googleGtag: GoogleGtagConfig = {
  trackingId: "G-C6KCGGKWQH",
  anonymizeIp: true,
  respectDNT: true,
  loadInHead: true,
};

// ---------------------------------------------------------------------------
// Web app manifest (was gatsby-plugin-manifest)
// Use with next-pwa or a static /public/manifest.webmanifest file.
// ---------------------------------------------------------------------------

export const manifestConfig: ManifestConfig = {
  name: "Codegard1",
  shortName: "CAO1",
  startUrl: "/",
  backgroundColor: "#038387",
  display: "minimal-ui",
  icon: "src/images/gatsby-icon.png",
};
