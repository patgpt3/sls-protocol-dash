import { ReactNode } from 'react';

// @mui material components
import { Icon } from '@mui/material';
import { Theme } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

// Waev Dashboard components
import { MDBox } from 'components';

// Waev Dashboard contexts
import { useMaterialUIController } from 'contexts';

// Declaring props types for DataTableHeadCell
interface Props {
  width?: string | number;
  children: ReactNode;
  sorted?: false | 'none' | 'asce' | 'desc';
  align?: 'left' | 'right' | 'center';
  headerColor?: string;
  toolTipTitle?: JSX.Element;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  isFullOpacity?: boolean;
}

export function DataTableHeadCell({
  width = 'auto',
  children,
  sorted = 'none',
  align = 'left',
  headerColor,
  toolTipTitle,
  tooltipPlacement,
  isFullOpacity,
  ...rest
}: Props): JSX.Element {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 220,
    },
  }));
  return (
    <MDBox
      component="th"
      width={width}
      py={1.5}
      px={3}
      sx={({ palette: { light }, borders: { borderWidth } }: Theme) => ({
        borderBottom: `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      {toolTipTitle ? (
        // <HtmlTooltip title={tooltip} placement={tooltipPlacement}>
        <HtmlTooltip title={toolTipTitle} placement={tooltipPlacement}>
          <div>
            <MDBox
              {...rest}
              position="relative"
              textAlign={align}
              color={darkMode ? 'white' : 'secondary'}
              opacity={0.7}
              sx={({ typography: { size, fontWeightBold } }: Theme) => ({
                fontSize: size.xxs,
                fontWeight: fontWeightBold,
                textTransform: 'uppercase',
                minWidth: 'max-content',
                display: 'flex',
                justifyContent: 'space-between',
                cursor: sorted && 'pointer',
                userSelect: sorted && 'none',
                color: headerColor,
              })}
            >
              {children}
              {sorted && (
                <MDBox
                  position="initial"
                  top={0}
                  right={align !== 'right' ? '16px' : 0}
                  left={align === 'right' ? '-5px' : 'unset'}
                  sx={({ typography: { size } }: any) => ({
                    fontSize: size.lg,
                  })}
                >
                  <MDBox
                    position="absolute"
                    top={-6}
                    color={sorted === 'asce' ? 'text' : 'secondary'}
                    opacity={sorted === 'asce' ? 1 : 0.5}
                  >
                    <Icon>arrow_drop_up</Icon>
                  </MDBox>
                  <MDBox
                    position="absolute"
                    top={0}
                    color={sorted === 'desc' ? 'text' : 'secondary'}
                    opacity={sorted === 'desc' ? 1 : 0.5}
                  >
                    <Icon>arrow_drop_down</Icon>
                  </MDBox>
                </MDBox>
              )}
            </MDBox>
          </div>
        </HtmlTooltip>
      ) : (
        <MDBox
          {...rest}
          position="relative"
          textAlign={align}
          color={darkMode ? 'white' : 'secondary'}
          opacity={isFullOpacity ? 1 : 0.7}
          sx={({ typography: { size, fontWeightBold } }: Theme) => ({
            fontSize: size.xxs,
            fontWeight: fontWeightBold,
            textTransform: 'uppercase',
            minWidth: 'max-content',
            display: 'flex',
            justifyContent: 'space-between',
            cursor: sorted && 'pointer',
            userSelect: sorted && 'none',
            color: headerColor,
          })}
        >
          {children}
          {sorted && (
            <MDBox
              position="initial"
              top={0}
              right={align !== 'right' ? '16px' : 0}
              left={align === 'right' ? '-5px' : 'unset'}
              sx={({ typography: { size } }: any) => ({
                fontSize: size.lg,
              })}
            >
              <MDBox
                position="absolute"
                top={-6}
                color={sorted === 'asce' ? 'text' : 'secondary'}
                opacity={sorted === 'asce' ? 1 : 0.5}
              >
                <Icon>arrow_drop_up</Icon>
              </MDBox>
              <MDBox
                position="absolute"
                top={0}
                color={sorted === 'desc' ? 'text' : 'secondary'}
                opacity={sorted === 'desc' ? 1 : 0.5}
              >
                <Icon>arrow_drop_down</Icon>
              </MDBox>
            </MDBox>
          )}
        </MDBox>
      )}
    </MDBox>
  );
}

// Declaring default props for DataTableHeadCell
DataTableHeadCell.defaultProps = {
  width: 'auto',
  sorted: 'none',
  align: 'left',
};

export default DataTableHeadCell;
