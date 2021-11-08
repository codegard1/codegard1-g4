import React, { useState } from "react";
import { Link } from "gatsby";
import {
  createTheme,
  DefaultPalette,
  Stack,
  Text,
  ThemeProvider,
  IconButton,
  initializeIcons
} from "@fluentui/react";
import SiteNav from "./site-nav";

initializeIcons();


const myTheme = createTheme({
  palette: {
    themePrimary: "#2334cc",
    themeLighterAlt: "#010208",
    themeLighter: "#060821",
    themeLight: "#0a0f3d",
    themeTertiary: "#151f7a",
    themeSecondary: "#1f2db4",
    themeDarkAlt: "#3545d1",
    themeDark: "#505dd8",
    themeDarker: "#7984e2",
    neutralLighterAlt: "#f8f8f8",
    neutralLighter: "#f4f4f4",
    neutralLight: "#eaeaea",
    neutralQuaternaryAlt: "#dadada",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c8c8",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
});

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  const [isSiteNavVisible, setIsSiteNavVisible] = useState(true);

  // Styles definition
  const containerStackStyles = {
    root: {
      background: DefaultPalette.white,
      minHeight: "100vh",
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
    minwidth: 50,
    padding: 10,
  };
  const midStackTokens = {
    padding: 20,
  };

  return (
    <ThemeProvider theme={myTheme}>
      <Stack
        horizontal
        grow
        styles={containerStackStyles}
        tokens={containerStackTokens}
      >
        <Stack grow={1} styles={sideStackStyles} tokens={sideStackTokens} align="end">
          <Stack.Item align="left" grow={0}>
            <IconButton
              iconProps={{ iconName: "GlobalNavButton" }}
              title="Global Nav"
              ariaLabel="Global Nav"
              checked={isSiteNavVisible}
              onClick={() => setIsSiteNavVisible(!isSiteNavVisible)}
            />
          </Stack.Item>
          {` `}
          {!isRootPath &&
            <Stack.Item grow={0}>
              <Link to="/">
                <Text variant="xxLarge">
                  {title}
                </Text>
              </Link>
            </Stack.Item>
          }
          {` `}
          {isSiteNavVisible &&
            <Stack.Item align="center" grow={0}>
              <SiteNav visible={isSiteNavVisible} />
            </Stack.Item>
          }
        </Stack>
        <Stack
          verticalAlign="space-between"
          data-is-root-path={isRootPath}
          styles={midStackStyles}
          tokens={midStackTokens}
        >
          {isRootPath &&
            <Stack.Item align="start">
              <header>
                <Link to="/">
                  <Text variant="mega">{title}</Text>
                </Link>
              </header>
            </Stack.Item>
          }
          <Stack.Item grow align="stretch">
            <main>{children}</main>
          </Stack.Item>
          <Stack.Item align="auto">
            <footer>
              {`© ${new Date().getFullYear()}`} Ciaervo, All rights reserved.
              {` `}
              Built with{" "}
              <a
                href="https://www.gatsbyjs.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Gatsby
              </a>
              .
            </footer>
          </Stack.Item>
        </Stack>
        <Stack grow={3} styles={sideStackStyles} tokens={sideStackTokens}>
          {` `}
        </Stack>
      </Stack>
    </ThemeProvider>
  )
};

export default Layout;
