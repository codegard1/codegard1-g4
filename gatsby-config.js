module.exports = {
  siteMetadata: {
    title: `Ciaervo`,
    author: {
      name: `Chris Odegard`,
      bio: `Self-taught web developer and data scientist`,
      summary: `I have a dev blog.`,
    },
    description: `Personal site of Chris Odegard.`,
    siteUrl: `https://ciaervo.com`,
    social: {
      applemusic: `https://music.apple.com/us/artist/1592784321`,
      bandcamp: `https://ciaervo.bandcamp.com/`,
      email: `mailto:chris@codegard1.com?subject=Enquiry%20from%20a%20Peruser`,
      github: `https://github.com/codegard1`,
      instagram: `https://instagram.com/ciaervo`,
      keybase: `https://keybase.io/ciaervo`,
      lastfm: `https://www.last.fm/user/codegard1`,
      linkedin: `https://www.linkedin.com/in/codegard1`,
      soundcloud: `https://soundcloud.com/ciaervo`,
      stackoverflow:
        `https://stackoverflow.com/users/2852366/chris-odegard?tab=profile`,
      spotify:
        `https://open.spotify.com/artist/3MS6P6gKoxxcSJoEqqNQST?si=dHeDrh3WS4iAB1lw2bAGDg`,
      tumblr: `https://ciaervo1.tumblr.com`,
      twitch: `https://www.twitch.tv/ciaervo`,
      twitter: `https://twitter.com/ciaervo1`,
      youtube: `https://www.youtube.com/channel/UCL3N9vvGRSoeGB5Wi3XhhrQ`,
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
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `dailyAggregations`,
        path: `${__dirname}/content/dailyAggregations`,
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
