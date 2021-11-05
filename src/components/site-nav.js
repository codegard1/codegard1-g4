import * as React from "react";
import { Link } from "gatsby";
import { Nav } from "@fluentui/react";

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
    links: [
      { name: "Github", url: "http://msn.com", key: "key3", target: "_blank" },
      {
        name: "SoundCloud",
        url: "http://msn.com",
        key: "key4",
        target: "_blank",
      },
      {
        name: "BandCamp",
        url: "http://msn.com",
        key: "key4",
        target: "_blank",
      },
      { name: "Spotify", url: "http://msn.com", key: "key4", target: "_blank" },
      { name: "Keybase", url: "http://msn.com", key: "key4", target: "_blank" },
      { name: "Twitter", url: "http://msn.com", key: "key4", target: "_blank" },
    ],
  },
];

const navStyles = {
  root: {
    width: 208,
    height: "auto",
    boxSizing: "border-box",
    // border: '1px solid #eee',
    overflowY: "hidden",
  },
};

const _onRenderGroupHeader = group => <h3>{group.name}</h3>;
const _onRenderLink = link => {
  return link.url.substr(0, 1) === "/" ? (
    <Link to={link.url} key={link.key} target={link.target}>
      {link.name}
    </Link>
  ) : (
    <a href={link.url} key={link.key} target={link.target}>
      {link.name}
    </a>
  );
};

const SiteNav = () => (
  <Nav
    onRenderGroupHeader={_onRenderGroupHeader}
    onRenderLink={_onRenderLink}
    ariaLabel="Site Nav"
    groups={navLinkGroups}
    styles={navStyles}
  />
);

export default SiteNav;
