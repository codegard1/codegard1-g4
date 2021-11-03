import * as React from "react";
import { Link } from "gatsby";
import { DefaultPalette, initializeIcons, Stack, TooltipHost, createTheme, ThemeProvider, Text, TextStyles, Theme } from '@fluentui/react';
import ButtonIcon from './button-icon';
import SiteNav from './site-nav';

// Initialize icons
initializeIcons();

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

  let header;
  if (isRootPath) {
    header = (
      <Link to="/">
        <Text variant="mega">{title}</Text>
      </Link>
    );
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    );
  }

  // Styles definition
  const containerStackStyles = {
    root: {
      background: DefaultPalette.white,
      minHeight: "100vh"
    },
  };
  const midStackStyles = {
    root: {
      background: DefaultPalette.white,
      childrenGap: 5,
    },
  };
  const sideStackStyles = {
    root: {
      background: DefaultPalette.tealLight,
      minwidth: 100,
    },
  };

  // Tokens definition
  const containerStackTokens = { childrenGap: 5 };
  const sideStackTokens = {
    maxWidth: 300,
    minwidth: 50,
    padding: 10,
  };
  const midStackTokens = {
    padding: 20
  };

  return (
    <ThemeProvider theme={myTheme}>
      <Stack horizontal grow styles={containerStackStyles} tokens={containerStackTokens}>
        <Stack grow={2} styles={sideStackStyles} tokens={sideStackTokens}>
          <ButtonIcon checked={false} disabled={false} />
          {` `}
          <SiteNav />
        </Stack>
        <Stack
          verticalAlign="space-between"
          data-is-root-path={isRootPath}
          styles={midStackStyles}
          tokens={midStackTokens}>
          <Stack.Item align="start">
            <header className="global-header">{header}</header>
          </Stack.Item>
          <Stack.Item grow align="stretch">
            <main>{children}</main>
          </Stack.Item>
          <Stack.Item align="auto">
            <footer>
              {`© ${new Date().getFullYear()}`} Ciaervo, All rights reserved.
              {` `}
              Built with <a href="https://www.gatsbyjs.com" rel="noopener noreferrer" target="_blank">Gatsby</a>.
            </footer>
          </Stack.Item>
        </Stack>
        <Stack grow={2} styles={sideStackStyles} tokens={sideStackTokens}>
          {` `}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Layout;
