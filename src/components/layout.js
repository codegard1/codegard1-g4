import * as React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { DefaultPalette, IconButton, initializeIcons, Stack, TooltipHost } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

// Initialize icons
initializeIcons();

const ButtonIcon = props => {
  const { disabled, checked } = props;
  const calloutProps = { gapSpace: 0 };
  const hostStyles = { root: { 
    display: 'inline-block'
  }};
  const iconStyles= { root: { color:DefaultPalette.themeDarker}}
  const tooltipId = useId('tooltip');
  return (
    <div>
      <TooltipHost
        content="Site Navigation"
        id={tooltipId}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <IconButton iconProps={{ iconName: 'GlobalNavButton' }} title="Global Nav" ariaLabel="Global Nav" disabled={disabled} checked={checked} styles={iconStyles} />
      </TooltipHost>
    </div>
  );
};


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
    <Stack horizontal grow styles={containerStackStyles} tokens={containerStackTokens}>
      <Stack grow={2} styles={sideStackStyles} tokens={sideStackTokens}>
        <ButtonIcon checked={false} disabled={false} />
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
            {copyright}, Built with
            {` `}
            <a href="https://www.gatsbyjs.com">Gatsby</a>
            {` `}
            {data.site.buildTime}
          </footer>
        </Stack.Item>
      </Stack>
      <Stack grow={2} styles={sideStackStyles} tokens={sideStackTokens}>
        Right column
      </Stack>
    </Stack>
  );
};

export default Layout;
