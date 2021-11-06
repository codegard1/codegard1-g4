import * as React from "react";
import { Nav, Text } from "@fluentui/react";
import { Link, StaticQuery, graphql } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-gtag";

const SiteNav = () => (
  <StaticQuery query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            title
            social {
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

      let socialLinks = [];
      for (let key in data.site.siteMetadata.social) {
        if (key !== undefined) socialLinks.push({
          name: key,
          url: data.site.siteMetadata.social[key],
          key: `site-nav-link-${key}`,
          target: '_blank'
        });
      }

      const navLinkGroups = [
        {
          name: "Pages",
          links: [
            { name: "Blog", url: "/", key: "blog", target: "_self" },
            { name: "Gallery", url: "/gallery", key: "gallery", target: "_self" },
            {
              name: "Blackjack",
              url: "/blackjack",
              key: "blackjack",
              target: "_self",
            },
          ],
        },
        {
          name: "Social",
          links: socialLinks
        },
      ];

      const navStyles = {
        root: {
          boxSizing: "border-box",
          overflowY: "hidden",
          overflowX: "hidden",
          color:"white"
        },
        link: {
          whiteSpace: 'normal',
          lineHeight: 'inherit',
          height: '1.5em',
        },
        linkText: {
          textDecoration: 'none',
          color: 'white',
        },
        navItem: {
          textDecoration: 'none',
          color: 'white',
        },
        navItems: {
          textDecoration: 'none',
          color: 'white',
        }
      };

      const _onRenderGroupHeader = group => <Text variant="xLarge">{group.name}</Text>;
      const _onRenderLink = link => {
        return link.target === '_self' ? (
          <Link to={link.url} key={link.key} target={link.target}>
            {link.name}
          </Link>
        ) : (
          <OutboundLink href={link.url} key={link.key} target={link.target} rel="noopener norefer">
            {link.name}
          </OutboundLink>
        );
      };

      return (
        <Nav
          onRenderGroupHeader={_onRenderGroupHeader}
          onRenderLink={_onRenderLink}
          ariaLabel="Site Nav"
          groups={navLinkGroups}
          styles={navStyles}
        />
      )
    }
    }
  />);

export default SiteNav;
