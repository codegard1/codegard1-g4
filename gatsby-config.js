module.exports = {
  siteMetadata: {
    title: `Ciaervo`,
    author: {
      name: `Chris Odegard`,
      bio: `Amateur artist / professional nerd`,
      summary: `I like to make things with computers and pens`,
    },
    description: `Central repository for (SFW) Ciaervo-related content`,
    siteUrl: `https://ciaervo.com`,
    social: {
      applemusic: { url: `https://music.apple.com/us/artist/1592784321`, name: `Apple Music` },
      bandcamp: { url: `https://ciaervo.bandcamp.com/`, name: `Bandcamp` },
      deviantart: { url: `https://www.deviantart.com/ciaervo/`, name: `Deviantart` },
      email: { url: `mailto:ciaervo@gmail.com?subject=Enquiry%20from%20a%20Peruser`, name: `e-mail` },
      github: { url: `https://github.com/codegard1`, name: `github` },
      instagram: { url: `https://instagram.com/ciaervo`, name: `Instagram` },
      keybase: { url: `https://keybase.io/ciaervo`, name: `Keybase` },
      lastfm: { url: `https://www.last.fm/user/codegard1`, name: `LastFM` },
      linkedin: { url: `https://www.linkedin.com/in/codegard1`, name: `LinkedIn` },
      soundcloud: { url: `https://soundcloud.com/ciaervo`, name: `SoundCloud` },
      stackoverflow:
        { url: `https://stackoverflow.com/users/2852366/chris-odegard?tab=profile`, name: `StackOverflow` },
      spotify:
        { url: `https://open.spotify.com/artist/3MS6P6gKoxxcSJoEqqNQST?si=dHeDrh3WS4iAB1lw2bAGDg`, name: `Spotify` },
      tumblr: { url: `https://ciaervo1.tumblr.com`, name: `Tumblr` },
      twitch: { url: `https://www.twitch.tv/ciaervo`, name: `Twitch` },
      twitter: { url: `https://twitter.com/ciaervo1`, name: `Twitter` },
      youtube: { url: `https://www.youtube.com/channel/UCL3N9vvGRSoeGB5Wi3XhhrQ`, name: `Youtube` },
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `blurred`,
          quality: 50,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        }
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/images/shoes`,
        name: `shoes`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/images/instagram`,
        name: `instagram`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/images/microscope`,
        name: `microscope`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/content/data`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [`G-C6KCGGKWQH`],
        gtagConfig: {
          anonymize_ip: true,
        },
        pluginConfig: {
          head: true,
          respectDNT: true,
        },
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ciaervo`,
        short_name: `CRVO`,
        start_url: `/`,
        background_color: `#038387`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
};
