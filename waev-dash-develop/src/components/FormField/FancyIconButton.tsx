import { ReactNode } from 'react';
import { Icon, Tooltip, SxProps, IconButton } from '@mui/material';

interface FancyIconButtonProps {
  size?: 'small' | 'large' | 'medium';
  iconSize?: 'small' | 'large' | 'medium';
  ariaLabel?: string;
  color?:
    | 'inherit'
    | 'success'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'warning';
  disabled?: boolean;
  onClick: () => void;

  icon: ReactNode | JSX.Element;
  sx?: SxProps;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

export function FancyIconButton ({
  icon,
  size,
  ariaLabel,
  color,
  disabled,
  onClick,
  iconSize,
  tooltip,
  tooltipPlacement,
  sx,
}: FancyIconButtonProps): JSX.Element {
  return tooltip
    ? (
    <Tooltip sx={sx} title={tooltip} placement={tooltipPlacement || 'bottom'}>
      <IconButton
        size={size || 'large'}
        aria-label={ariaLabel || 'close'}
        color={color || 'success'}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon fontSize={iconSize || 'large'}>{icon}</Icon>
      </IconButton>
    </Tooltip>
      )
    : (
    <IconButton
      sx={sx}
      size={size || 'large'}
      aria-label={ariaLabel || 'close'}
      color={color || 'success'}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon fontSize={iconSize || 'large'}>{icon}</Icon>
    </IconButton>
      );
}
