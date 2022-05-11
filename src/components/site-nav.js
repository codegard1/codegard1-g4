import React from "react";
import { StaticQuery, graphql } from "gatsby";

import { Nav } from "@fluentui/react/lib/Nav";
import { Text } from "@fluentui/react/lib/Text";

const SiteNav = () => (
  <StaticQuery
    query={graphql`
      query SiteNavQuery {
        site {
          siteMetadata {
            title
            social {
              applemusic {name, url}
              bandcamp {name, url}
              github {name, url}
              keybase {name, url}
              linkedin {name, url}
              soundcloud {name, url}
              spotify {name, url}
              stackoverflow {name, url}
              tumblr {name, url}
              twitter {name, url}
            }
          }
        }
      }
    `}

    render={data => {
      let socialLinks = [];
      for (let key in data.site.siteMetadata.social) {
        socialLinks.push({
          name: data.site.siteMetadata.social[key].name,
          url: data.site.siteMetadata.social[key].url,
          key: `site-nav-link-${key}`,
          target: "_blank",
        }
        )
      }

      const navLinkGroups = [
        {
          name: "Site Pages",
          links: [
            { name: "Blog", url: "/blog", key: "blog", target: "_self" },
            { name: "Tags", url: "/blog/tags", key: "tags", target: "_self" },
            { name: "Gallery", url: "/gallery", key: "gallery", target: "_self" },
            { name: "Blackjack", url: "/blackjack", key: "blackjack", target: "_self" },
            { name: "Music", url: "/music", key: "music", target: "_self" },
          ],
        },
        {
          name: "Social Links",
          links: socialLinks,
        },
      ];

      const navStyles = {
        root: {
          boxSizing: "border-box",
          overflowY: "hidden",
          overflowX: "hidden",
        },
        link: {
          whiteSpace: "normal",
          lineHeight: "inherit",
          height: "1.5em",
        },
      };

      const _onRenderGroupHeader = group => (
        <Text variant="xLarge">{group.name}</Text>
      );

      return (
        <Nav
          onRenderGroupHeader={_onRenderGroupHeader}
          ariaLabel="Site Nav"
          groups={navLinkGroups}
          styles={navStyles}
        />
      );
    }}
  />
);

export default SiteNav;
