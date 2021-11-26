import React from "react";

import NavBar from "./navbar";
import { OutboundLink } from "gatsby-plugin-google-gtag";


const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <div id="LayoutContainer">
        <NavBar
          location={location}
          title={title}
        />
      <main>{children}</main>
      <footer>
        {`© ${new Date().getFullYear()}`} Ciaervo, All rights reserved.
        {` `}
        Built with{" "}
        <OutboundLink
          href="https://www.gatsbyjs.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Gatsby
        </OutboundLink>
        .
      </footer>
    </div>
  );
};

export default Layout;
