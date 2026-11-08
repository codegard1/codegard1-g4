export const site = {
  title: "Codegard1",
  shortName: "CAO1",
  description: "Codegard1's personal site",
  url: "https://codegard1.com",
  themeColor: "#038387",
  author: {
    name: "Chris Odegard",
    bio: "Amateur artist / professional nerd",
    summary: "I like to make things with computers and pens",
  },
  gaMeasurementId: "G-C6KCGGKWQH",
  postsPerPage: 7,
  blackjackUrl: "https://ciaervo-blackjack.netlify.app",
  blackjackRepoUrl: "https://github.com/codegard1/blackjack",
  soundcloudPlaylistEmbed:
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1344404302&color=%231860eb&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
} as const;

export type SocialKey =
  | "applemusic"
  | "bandcamp"
  | "deviantart"
  | "email"
  | "github"
  | "instagram"
  | "keybase"
  | "lastfm"
  | "linkedin"
  | "soundcloud"
  | "spotify"
  | "stackoverflow"
  | "tumblr"
  | "twitch"
  | "twitter"
  | "youtube";

export interface SocialLink {
  name: string;
  url: string;
}

export const social: Record<SocialKey, SocialLink> = {
  applemusic: { url: "https://music.apple.com/us/artist/1592784321", name: "Apple Music" },
  bandcamp: { url: "https://ciaervo.bandcamp.com/", name: "Bandcamp" },
  deviantart: { url: "https://www.deviantart.com/ciaervo/", name: "Deviantart" },
  email: { url: "mailto:ciaervo@gmail.com?subject=Enquiry%20from%20a%20Peruser", name: "e-mail" },
  github: { url: "https://github.com/codegard1", name: "github" },
  instagram: { url: "https://instagram.com/ciaervo", name: "Instagram" },
  keybase: { url: "https://keybase.io/ciaervo", name: "Keybase" },
  lastfm: { url: "https://www.last.fm/user/codegard1", name: "LastFM" },
  linkedin: { url: "https://www.linkedin.com/in/codegard1", name: "LinkedIn" },
  soundcloud: { url: "https://soundcloud.com/ciaervo", name: "SoundCloud" },
  stackoverflow: {
    url: "https://stackoverflow.com/users/2852366/chris-odegard?tab=profile",
    name: "StackOverflow",
  },
  spotify: {
    url: "https://open.spotify.com/artist/3MS6P6gKoxxcSJoEqqNQST?si=dHeDrh3WS4iAB1lw2bAGDg",
    name: "Spotify",
  },
  tumblr: { url: "https://ciaervo1.tumblr.com", name: "Tumblr" },
  twitch: { url: "https://www.twitch.tv/ciaervo", name: "Twitch" },
  twitter: { url: "https://twitter.com/ciaervo1", name: "Twitter" },
  youtube: { url: "https://www.youtube.com/channel/UCL3N9vvGRSoeGB5Wi3XhhrQ", name: "Youtube" },
};

/** Social links shown on the Contact page, in display order (matches the previous site). */
export const contactSocialKeys: SocialKey[] = [
  "applemusic",
  "bandcamp",
  "deviantart",
  "email",
  "github",
  "instagram",
  "lastfm",
  "soundcloud",
  "spotify",
  "stackoverflow",
  "tumblr",
  "youtube",
];

export const navLinks: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/blog/search", label: "Search Blog" },
  { href: "/blackjack", label: "Blackjack" },
  { href: "/gallery", label: "Gallery" },
  { href: "/music", label: "Music" },
  { href: "/contact", label: "Contact" },
];
