import React, { useState, useCallback } from "react";
import { Nav, Text } from "@fluentui/react";
import { Link, StaticQuery, graphql } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-gtag";

const SiteNav = () => (
  <StaticQuery query={graphql`
      query SiteNavQuery {
        site {
          siteMetadata {
            title
            social {
              applemusic
              bandcamp
              github
              keybase
              linkedin
              soundcloud
              spotify
              stackoverflow
              tumblr
              twitter
            }
          }
        }
      }
      `}
    render={data => {      
      let brandLinks = [];
      for (let key in data.site.siteMetadata.social) {
        if (key !== undefined) brandLinks.push({
          name: key,
          url: data.site.siteMetadata.social[key],
          key: `site-nav-link-${key}`,
          target: '_blank'
        });
      }

      const navLinkGroups = [
        {
          name: "Site Pages",
          links: [
            { name: "Blog", url: "/", key: "blog", target: "_self" },
            { name: "Tags", url: "/tags", key: "tags", target: "_self" },
            { name: "Gallery", url: "/gallery", key: "gallery", target: "_self" },
            { name: "Blackjack", url: "/blackjack", key: "blackjack", target: "_self" },
            { name: "Music", url: "/music", key: "music", target: "_self" },
          ],
        },
        {
          name: "Brand Links",
          links: brandLinks
        },
      ];

      const navStyles = {
        root: {
          boxSizing: "border-box",
          overflowY: "hidden",
          overflowX: "hidden",
        },
        link: {
          whiteSpace: 'normal',
          lineHeight: 'inherit',
          height: '1.5em',
        },
      };

      const _onRenderGroupHeader = group => <Text variant="xLarge">{group.name}</Text>;

      return (
        <Nav
          onRenderGroupHeader={_onRenderGroupHeader}
        
          ariaLabel="Site Nav"
          groups={navLinkGroups}
          styles={navStyles}
        />
      )
    }
    }
  />);

export default SiteNav;
