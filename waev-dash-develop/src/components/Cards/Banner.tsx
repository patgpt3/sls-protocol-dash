// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
import { Card, Grid } from '@mui/material';

import colors from 'assets/theme/base/colors';
import { WaevAvatarIcon } from 'assets';
import { antiStationaryPulseYKeyframes, pulseKeyframes, stationaryPulseYKeyframes } from 'utils';

// Declaring props types for Banner
export interface BannerProps {
  bg: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
  title?: string | JSX.Element;
  isLoading?: boolean;
  // TODO(MFB): Add in optional banner badge (rather than the loading icon)
  isBannerStatic?: boolean; // turns off pulsing of banner if enabled
  subtitle?: string | JSX.Element;
  titleWeight?: string;
  actionsSection?: JSX.Element | any;

  my?: number;
  sx?: any;
}

export function Banner({
  bg,
  isLoading,
  isBannerStatic,
  title,
  subtitle,
  actionsSection,
  my,
  sx,
}: BannerProps): JSX.Element {
  const loadingSection = (
    <MDBox
      component="button"
      my={2}
      mx={3}
      sx={{
        backgroundColor: 'transparent !important',
        border: 'none !important',
        animation: `1.5s infinite ${pulseKeyframes()}`,
        opacity: 0.7,
      }}
    >
      <WaevAvatarIcon
        alt="profile-image"
        size="xs"
        shadow="sm"
        bgColor="info"
        isAnimating={true}
        sx={{
          transform: '200%',
          width: '3rem',
          height: '3rem',
        }}
      />
    </MDBox>
  );

  const titleSection =
    typeof title === 'string' ? (
      <MDBox height="100%" mt={0.5} lineHeight={1}>
        <MDTypography
          variant="h3"
          fontWeight="medium"
          color={colors[bg]?.text}
          data-testid="banner-title"
        >
          {title}
        </MDTypography>
        {subtitle && (
          <MDTypography
            variant="h6"
            color={colors[bg]?.text}
            fontWeight="medium"
            data-testid="banner-subtitle"
          >
            {subtitle}
          </MDTypography>
        )}
      </MDBox>
    ) : (
      title
    );

  return (
    <Card
      sx={{
        my: my || 2,
        display: 'flex',

        backgroundColor: colors[bg].main,
        animation: !isBannerStatic && `2s infinite ${stationaryPulseYKeyframes()}`,

        ...sx,
      }}
    >
      <MDBox p={2}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            animation: !isBannerStatic && `2s infinite ${antiStationaryPulseYKeyframes()}`,
          }}
        >
          <Grid item display="flex" alignItems="center" xs={12} sm={6} md={7} lg={8}>
            {<MDBox mr={3}>{isLoading && loadingSection}</MDBox>}
            {titleSection}
          </Grid>
          <Grid item display="flex" justifyContent="flex-end" xs={12} sm={6} md={5} lg={4}>
            {actionsSection}
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}
