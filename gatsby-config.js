module.exports = {
  siteMetadata: {
    title: `Ciaervo`,
    author: {
      name: `Chris Odegard`,
      bio: "Self-taught web developer and data scientist",
      summary: `I have a dev blog.`,
    },
    description: `Personal site of Chris Odegard.`,
    siteUrl: `https://www.ciaervo.com`,
    social: {
      applemusic: "https://music.apple.com/us/artist/1592784321",
      bandcamp: "https://ciaervo.bandcamp.com/",
      github: "https://github.com/codegard1",
      keybase: `https://keybase.io/ciaervo`,
      linkedin: "https://www.linkedin.com/in/codegard1",
      soundcloud: "https://soundcloud.com/ciaervo",
      stackoverflow:
        "https://stackoverflow.com/users/2852366/chris-odegard?tab=profile",
      spotify:
        "https://open.spotify.com/artist/3MS6P6gKoxxcSJoEqqNQST?si=dHeDrh3WS4iAB1lw2bAGDg",
      tumblr: "https://ciaervo1.tumblr.com",
      twitch: "https://www.twitch.tv/ciaervo",
      twitter: "https://twitter.com/ciaervo1",
      lastfm: "https://www.last.fm/user/codegard1",
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
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
        trackingIds: ["G-C6KCGGKWQH"],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: false,
          respectDNT: true,
          exclude: ["/preview/**"],
        },
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ciaervo`,
        short_name: `CRVO`,
        start_url: `/`,
        background_color: `#ffffff`,
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
