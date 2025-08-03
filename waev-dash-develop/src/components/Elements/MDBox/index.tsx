import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';

// @mui material components
import { BoxProps } from '@mui/material';

// Custom styles for MDBox
import MDBoxRoot from 'components/Elements/MDBox/MDBoxRoot';

// declaring props types for MDBox
interface Props extends Omit<BoxProps, 'ref'> {
  variant?: 'contained' | 'gradient';
  bgColor?: string;
  color?: string;
  opacity?: number;
  borderRadius?: string;
  shadow?: string;
  coloredShadow?: string;
  [key: string]: any;
}

const MDBox: ForwardRefExoticComponent<Props> = forwardRef<HTMLDivElement, Props>(
  ({ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow, ...rest }, ref) => (
    <MDBoxRoot
      {...rest}
      ref={ref}
      ownerState={{ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow }}
    />
  )
);

// Declaring default props for MDBox
MDBox.defaultProps = {
  variant: 'contained',
  bgColor: 'transparent',
  color: 'dark',
  opacity: 1,
  borderRadius: 'none',
  shadow: 'none',
  coloredShadow: 'none',
};

export default MDBox;
