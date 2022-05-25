const path = require(`path`);
const _ = require(`lodash`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const fs = require(`fs`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  const tagTemplate = path.resolve(`./src/templates/tag.js`);
  const blogList = path.resolve("./src/templates/blog-list.js");

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
      }
      tagsGroup: allMarkdownRemark(
        limit: 2000
        filter: { frontmatter: { tags: { ne: "" } } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );
    return;
  }

  const posts = result.data.allMarkdownRemark.nodes;

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    // Create pagination
    const postsPerPage = 7;
    const numPages = Math.ceil(posts.length / postsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: `/blog/${i + 1}`,
        component: blogList,
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages: numPages,
          currentPage: i + 1,
        },
      })
    });

    // Create page for each post
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId =
        index === posts.length - 1 ? null : posts[index + 1].id;

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });

    // Make tag pages
    const tags = result.data.tagsGroup.group;
    tags.forEach(tag => {
      createPage({
        path: `/blog/tags/${_.kebabCase(tag.fieldValue)}`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
        },
      });
    });
  }
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: SocialLink
      applemusic: SocialLink
      bandcamp: SocialLink
      email: SocialLink
      github: SocialLink
      instagram: SocialLink
      keybase: SocialLink
      lastfm: SocialLink
      linkedin: SocialLink
      soundcloud: SocialLink
      stackoverflow: SocialLink
      spotify: SocialLink
      tumblr: SocialLink
      twitch: SocialLink
      twitter: SocialLink
      youtube: SocialLink
    }

    type SocialLink {
      name: String
      url: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }

    type Song implements Node {
      Title: String!
      Artist: String
      ReleaseDate: String
      Album: String 
      Artwork: String
    }

    type Album implements Node {
      Title: String!
      Tracks: [Song]
      Artist: String
      URL: String
      Artwork: String
    }
  `);
};

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  const ALBUM_NODE_TYPE = `Album`;
  const SONG_NODE_TYPE = `Song`;

  // Simple read of local file
  const data = JSON.parse(fs.readFileSync(`./content/data/soundcloud.json`));

  // Get list of distinct album titles
  const distinctAlbumTitles = [...new Set(data.map(v => v.Album))];

  // Create album nodes
  distinctAlbumTitles.forEach((albumTitle, ix) => {
    // Get songs that belong to this album
    // const albumSongTitles = data.filter(v => { v.Album === albumTitle }).map(v => v.Title);

    const albumData = {
      key: albumTitle,
      Title: albumTitle
    };

    const albumNodeMeta = {
      id: createNodeId(albumData.key),
      parent: null,
      children: [],
      internal: {
        type: ALBUM_NODE_TYPE,
        mediaType: `text/html`,
        content: JSON.stringify(albumData),
        contentDigest: createContentDigest(albumData)
      }
    };

    // Create the album node
    const album = Object.assign({}, albumData, albumNodeMeta);
    createNode(album);
  });

  // Create Song nodes
  data.forEach((song, ix) => {
    const songData = {
      key: `${song.Album}-song-${ix}`,
      ...song
    }

    const songNodeMeta = {
      id: createNodeId(`song-${song.Title}`),
      parent: createNodeId(song.Album),
      children: [],
      internal: {
        type: SONG_NODE_TYPE,
        mediaType: `text/html`,
        content: JSON.stringify(songData),
        contentDigest: createContentDigest(songData)
      }
    };

    // Create the song node
    const songNode = Object.assign({}, songData, songNodeMeta);
    createNode(songNode);
  });

};

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig();

    const miniCss = config.plugins.find(
      (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );

    if (miniCss) {
      // miniCss.options.ignoreOrder = true;
      miniCss.options.runtime = false;
      miniCss.options.experimentalUseImportModule = true;
    }

    actions.replaceWebpackConfig(config);
  }
};
