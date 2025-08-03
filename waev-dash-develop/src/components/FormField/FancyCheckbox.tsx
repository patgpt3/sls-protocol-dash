import { ReactNode } from 'react';
import { Icon, Theme, Tooltip, SxProps } from '@mui/material';
import { MDButton } from 'components';

interface FancyCheckboxProps {
  isSelected?: boolean;
  onSelect: () => void;
  icon: ReactNode | JSX.Element;
  sx?: SxProps;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  isDisabled?: boolean;
}

export function FancyCheckbox ({
  icon,
  isSelected,
  onSelect,
  tooltip,
  tooltipPlacement,
  isDisabled,
  sx,
}: FancyCheckboxProps): JSX.Element {
  const customButtonStyles = (
    isSelected: boolean,
    {
      functions: { pxToRem, rgba },
      borders: { borderWidth },
      palette: { transparent, info },
      typography: { size },
    }: Theme
  ) => ({
    width: pxToRem(30),
    height: pxToRem(30),
    borderWidth: borderWidth[2],
    minWidth: 'unset !important',
    minHeight: 'unset !important',
    // mb: 1,
    mr: 1,
    my: 0.5,
    px: 0,

    '&.MuiButton-contained, &.MuiButton-contained:hover': {
      boxShadow: 'none',
      border: `${borderWidth[2]} solid ${transparent.main}`,
      backgroundColor: isSelected
        ? `${rgba(info.main, 0.9)} !important`
        : `${transparent.main} !important`,
    },

    '&:hover': {
      backgroundColor: isSelected
        ? `${rgba(info.main, 0.9)} !important`
        : `${transparent.main} !important`,
      border: `${borderWidth[2]} solid ${info.main} !important`,
      color: rgba(info.main, 0.75),
    },

    '& .material-icons-round': {
      fontSize: `${size.sm} !important`,
    },
    sx,
  });

  return (
    <MDButton
      color="info"
      variant={isSelected ? 'contained' : 'outlined'}
      onClick={onSelect}
      disabled={isDisabled}
      sx={(e: any) => customButtonStyles(isSelected, e)}
    >
      {tooltip
        ? (
        <Tooltip title={tooltip} placement={tooltipPlacement}>
          <Icon sx={{ color: isSelected ? 'white' : 'inherit' }} fontSize="small">
            {icon}
          </Icon>
        </Tooltip>
          )
        : (
        <Icon sx={{ color: isSelected ? 'white' : 'inherit' }} fontSize="small">
          {icon}
        </Icon>
          )}
    </MDButton>
  );
}
