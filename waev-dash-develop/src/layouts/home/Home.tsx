// Waev Dashboard components
import { keyframes } from '@emotion/react';
import { MDBox, MDTypography } from 'components';

// Waev Dashboard examples components
import { DashboardLayout } from 'components/LayoutContainers/DashboardLayout';
import { DashboardNavbar } from 'components/Navbars/DashboardNavbar/DashboardNavbar';

import { WaevLogoBasic as SlsLogo } from 'assets';
import { useContext, useEffect } from 'react';
import { FormattedMessage } from 'utils';
import { TourContext } from 'contexts/tourContext';
import { parsePath } from 'utils';

const fadeInKeyframes = () => keyframes`
  0% { opacity: 0; }
  70% { opacity: 0; }
  100% { opacity: 1; }
`;

const waevHoverContainerClass = (id: string): Object => {
  let hoverClass = { '&:hover': {}, '&:not(hover)': {} };

  // @ts-ignore
  hoverClass['&:hover'][`.Waev-${id}`] = {
    transform: 'scaleX(-1)',
    '&>h2': {
      transform: 'scaleX(-1)',
      animation: ` 1s ease-in-out 0.5s infinite alternate forwards ${rotateWaveKeyframes()}`,
      animationFillMode: 'forwards',
      opacity: 1,
      transition: 'opacity .55s ease-in-out',
      MozTransition: 'opacity .55s ease-in-out',
      WebkitTransition: 'opacity .55s ease-in-out',
    },
  };
  // @ts-ignore
  hoverClass['&:not(hover)'][`.Waev-${id}`] = {
    transform: 'scaleX(-1)',
    '&>h2': {
      opacity: 0,
      animation: ` 1s ease-in-out 0.5s infinite alternate forwards ${rotateWaveKeyframes()}`,
      animationFillMode: 'forwards',
      transition: 'opacity .55s ease-in-out',
      MozTransition: 'opacity .55s ease-in-out',
      WebkitTransition: 'opacity .55s ease-in-out',
    },
  };
  return hoverClass;
};

const rotateWaveKeyframes = () => keyframes`
  0% {transform: rotate(0);}
  100% { transform: rotate(60deg); }
`;

export function Home(): JSX.Element {
  const reload = sessionStorage.getItem('reloadCount') || '0';
  const reloadCount = parseInt(reload);

  const { checkFlags, onSelectCall } = useContext(TourContext);

  useEffect(() => {
    if (reloadCount < 1) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    }
  }, []);

  const flag = {
    ...checkFlags,
    isHomeFirstVisitCheck: true,
    isHomeSelect: true,
    isSettingsSelect: false,
    isDeploymentsSelect: false,
    isViewDataSelect: false,
  };
  useEffect(() => {
    if (parsePath(window.location.href) === '/home') {
      onSelectCall(flag);
    }
  }, [parsePath(window.location.href)]);

  return (
    <DashboardLayout
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DashboardNavbar />
      <MDBox
        py={3}
        sx={{
          textAlign: 'center',
          flex: 99,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
        id="homeId"
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
          <SlsLogo
            width="100%"
            height="100%"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          />
          <MDBox flex={1}>
            <MDBox
              position="relative"
              // @ts-ignore
              sx={{
                ...waevHoverContainerClass('wave-container'),
              }}
            >
              <MDTypography
                variant="h2"
                color="text"
                flex={1}
                fontWeight="regular"
                textAlign="right"
                mt={3}
                // ml={2}
                sx={{
                  animation: `6s ease-out ${fadeInKeyframes()}`,
                }}
              >
                <FormattedMessage id="home.hello" defaultMessage="Hello." />
              </MDTypography>
              <MDBox position="absolute" top="-100%" right="-50%" className="Waev-wave-container">
                <MDTypography
                  variant="h2"
                  color="text"
                  flex={1}
                  fontWeight="regular"
                  textAlign="right"
                  mt={5}
                  pb={3}
                  className="Waev-wave"
                  sx={{
                    opacity: 0,
                    transform: 'scaleX(-1)',
                    animation: ` 1s ease-in-out 1s infinite alternate forwards ${rotateWaveKeyframes()}`,
                  }}
                >
                  👋
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
