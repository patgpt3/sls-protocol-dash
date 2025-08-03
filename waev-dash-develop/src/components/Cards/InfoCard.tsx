import { ReactNode } from 'react';

// @mui material components
import { Card, Divider, Icon, Tooltip } from '@mui/material';

import { Link, MDBox, MDTypography } from 'components';

type StandardColors =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'inherit'
  | 'disabled'
  | 'action';
// Declaring props types for DefaultInfoCard
interface Props {
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark';
  icon: ReactNode;
  iconTooltip?: string;
  title: string | JSX.Element;
  description?: string | JSX.Element;
  value?: string | number | JSX.Element | undefined;
  isLight?: boolean;
  id?:string;

  onClickLeft?: Function;
  linkLeft?: string;
  menuIconLeft?: ReactNode;
  menuIconLeftFontWeight?: string | number;
  menuIconLeftColor?: StandardColors;
  onClickRight?: Function;
  linkRight?: string;
  menuIconRight?: ReactNode;
  menuIconRightFontWeight?: string | number;
  menuIconRightColor?: StandardColors;
  iconRightId?: string;
  [key: string]: any;
}

export function InfoCard({
  color = 'info',
  icon,
  iconTooltip,
  title,
  description = '',
  value = '',
  isLight,
  id,

  onClickLeft,
  linkLeft,
  menuIconLeft,
  menuIconLeftFontWeight,
  menuIconLeftColor,

  onClickRight,
  linkRight,
  menuIconRight,
  menuIconRightFontWeight,
  menuIconRightColor,
  iconRightId,
}: Props): JSX.Element {
  return (
    <Card
      color="info"
      id={id}
      sx={{
        overflow: 'hidden',
      }}
    >
      <MDBox height="100%" bgColor={isLight && 'dark'} variant={isLight ? 'gradient' : undefined}>
        <MDBox p={2} mx={3} display="flex" justifyContent="center" sx={{ display: 'relative' }}>
          {onClickLeft && (
            <MDTypography
              color="secondary"
              component="button"
              onClick={onClickLeft}
              sx={{
                mr: 'auto',
                alignSelf: 'flex-start',
                ml: 3,
                mt: 2,
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'transparent !important',
                border: 'none !important',
              }}
            >
              <Icon
                color={menuIconLeftColor || 'info'}
                sx={{ cursor: 'pointer', fontWeight: menuIconLeftFontWeight || 'bold' }}
              >
                {menuIconLeft || 'add'}
              </Icon>
            </MDTypography>
          )}
          {linkLeft && (
            <MDTypography
              color="secondary"
              // onClick={openDropdownMenu}
              sx={{
                mr: 'auto',
                alignSelf: 'flex-start',
                ml: 3,
                mt: 2,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <Link to={linkLeft}>
                <Icon
                  color={menuIconLeftColor || 'info'}
                  sx={{ cursor: 'pointer', fontWeight: menuIconLeftFontWeight || 'bold' }}
                >
                  {menuIconLeft || 'add'}
                </Icon>
              </Link>
            </MDTypography>
          )}
          {onClickRight && (
            <MDTypography
              color="secondary"
              onClick={onClickRight}
              component="button"
              sx={{
                ml: 'auto',
                alignSelf: 'flex-start',
                mr: 3,
                mt: 2,
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'transparent !important',
                border: 'none !important',
              }}
            >
              <Icon
                color={menuIconRightColor || 'info'}
                sx={{ cursor: 'pointer', fontWeight: menuIconRightFontWeight || 'bold' }}
                id={iconRightId}
              >
                {menuIconRight || 'add'}
              </Icon>
            </MDTypography>
          )}
          {linkRight && (
            <MDTypography
              color="secondary"
              // onClick={openDropdownMenu}
              sx={{
                ml: 'auto',
                alignSelf: 'flex-start',
                mr: 3,
                mt: 2,
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            >
              <Link to={linkRight}>
                <Icon
                  color={menuIconRightColor || 'info'}
                  sx={{ cursor: 'pointer', fontWeight: menuIconRightFontWeight || 'bold' }}
                >
                  {menuIconRight || 'add'}
                </Icon>
              </Link>
            </MDTypography>
          )}
          {iconTooltip ? (
            <Tooltip title={iconTooltip} placement="top">
              <MDBox
                display="grid"
                justifyContent="center"
                alignItems="center"
                bgColor={color}
                color="white"
                width="4rem"
                height="4rem"
                shadow="md"
                borderRadius="lg"
                variant="gradient"
              >
                <Icon fontSize="large">{icon}</Icon>
              </MDBox>
            </Tooltip>
          ) : (
            <MDBox
              display="grid"
              justifyContent="center"
              alignItems="center"
              bgColor={color}
              color="white"
              width="4rem"
              height="4rem"
              shadow="md"
              borderRadius="lg"
              variant="gradient"
            >
              <Icon fontSize="large">{icon}</Icon>
            </MDBox>
          )}
        </MDBox>
        <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>
          {description && (
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          )}
          {description && !value ? null : <Divider />}
          {value}
        </MDBox>
      </MDBox>
    </Card>
  );
}
