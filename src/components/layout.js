import React from "react";
import NavBar from "./navbar";
import { OutboundLink } from "gatsby-plugin-google-gtag";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    <>
      <header>
        <NavBar
          location={location}
          title={title}
        />
      </header>
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
    </>
  );
};

export default Layout;
