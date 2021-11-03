import * as React from "react";
import { Link } from "gatsby";
import { DefaultPalette, IconButton, initializeIcons, Stack, TooltipHost } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

// Initialize icons
// initializeIcons();

const ButtonIcon = props => {
  const { disabled, checked } = props;
  const calloutProps = { gapSpace: 0 };
  const hostStyles = {
    root: {
      display: 'inline-block'
    }
  };
  const tooltipId = useId('tooltip');
  return (
    <div>
      <TooltipHost
        content="Site Navigation"
        id={tooltipId}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <IconButton iconProps={{ iconName: 'GlobalNavButton' }} title="Global Nav" ariaLabel="Global Nav" disabled={disabled} checked={checked} />
      </TooltipHost>
    </div>
  );
};

export default ButtonIcon;
