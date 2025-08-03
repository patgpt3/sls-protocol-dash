// Waev Dashboard components
import { keyframes } from '@emotion/react';
import { MDBox, MDTypography } from 'components';
import colors from 'assets/theme/base/colors';

// Waev Dashboard examples components
import { useEffect } from 'react';
import { Icon } from '@mui/material';
import { FormattedMessage } from 'utils';

const { light } = colors;

const fadeInKeyframes = () => keyframes`
  0% { opacity: 0; }
  70% { opacity: 0; }
  100% { opacity: 1; }
`;

export function Lost(): JSX.Element {
  const reload = sessionStorage.getItem('reloadCount') || '0';
  const reloadCount = parseInt(reload);

  useEffect(() => {
    if (reloadCount < 1) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    }
  }, []);

  return (
    <MDBox
      mt={15}
      py={3}
      sx={{
        textAlign: 'center',
        flex: 99,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <MDBox
        py={3}
        sx={{
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Icon sx={{ fontSize: '10rem !important', color: `${light.main} !important` }}>
          bathtub
        </Icon>

        <MDBox flex={1}>
          <MDBox position="relative" display="block">
            <MDTypography
              variant="h2"
              color="text"
              flex={1}
              fontWeight="regular"
              textAlign="center"
              mt={3}
              // ml={2}
              sx={{
                animation: `2s ease-out ${fadeInKeyframes()}`,
              }}
            >
              <FormattedMessage id="lost.part1" defaultMessage="Oh! Hey..." />{' '}
            </MDTypography>
            <MDTypography
              variant="h2"
              color="text"
              flex={1}
              fontWeight="regular"
              textAlign="center"
              mt={3}
              // ml={2}
              sx={{
                animation: `2s ease-out ${fadeInKeyframes()}`,
              }}
            >
              <FormattedMessage id="lost.part2" defaultMessage="Are you lost?" />
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
