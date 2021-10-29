import * as React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { Stack, createTheme, ThemeProvider } from "@fluentui/react";

const myTheme = createTheme({
  palette: {
    themePrimary: '#2334cc',
    themeLighterAlt: '#010208',
    themeLighter: '#060821',
    themeLight: '#0a0f3d',
    themeTertiary: '#151f7a',
    themeSecondary: '#1f2db4',
    themeDarkAlt: '#3545d1',
    themeDark: '#505dd8',
    themeDarker: '#7984e2',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  }
});

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        buildTime(fromNow: true)
        siteMetadata {
          copyright
        }
      }
    }
  `);

  const copyright = data.site.siteMetadata?.copyright;

  let header;

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    );
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    );
  }

  return (
    <ThemeProvider theme={myTheme}>
    <Stack className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        {copyright}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
        {` `}
        {data.site.buildTime}
      </footer>
    </Stack>
    </ThemeProvider>
  );
};

export default Layout;
