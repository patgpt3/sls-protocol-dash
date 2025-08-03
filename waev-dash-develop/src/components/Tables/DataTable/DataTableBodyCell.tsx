import { ReactNode } from 'react';

// @mui material components
import { Theme } from '@mui/material/styles';

// Waev Dashboard components
import { MDBox } from 'components';

// Declaring prop types for DataTableBodyCell
interface Props {
  children: ReactNode;
  noBorder?: boolean;
  align?: 'left' | 'right' | 'center';
}

export function DataTableBodyCell({
  noBorder = false,
  align = 'left',
  children,
}: Props): JSX.Element {
  // If the value of the cell is just "-", we center it in the cell.
  let isDashSymbol =
    // @ts-ignore
    children?.props?.value?.props?.children?.[0]?.props?.children?.props?.children === '-' ||
    // @ts-ignore
    children?.props?.value?.props?.children?.props?.children === '-';

  return (
    <MDBox
      component="td"
      textAlign={isDashSymbol ? 'center' : align}
      py={1.5}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }: Theme) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? 'none' : `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <MDBox
        display="inline-block"
        width="max-content"
        color="text"
        sx={{ verticalAlign: 'middle', maxWidth: '400px' }}
      >
        {children}
      </MDBox>
    </MDBox>
  );
}
