/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useContext, useState, useEffect, JSXElementConstructor, Key, ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  AuthContextProvider,
  SelectedEntityContextProvider,
  CurrentUserContextProvider,
  NotificationContextProvider,
  ApiLoaderContextProvider,
  NotificationContext,
  ProviderComposer,
  CurrentUserContext,
  ApiLoaderContext,
} from 'contexts';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { keyframes, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MDBox, Sidenav, WaevAvatarIcon, WaevLogoBasic, WaevLogoBasicLoading } from 'components';
import theme from 'assets/theme';
import themeDark from 'assets/theme-dark';
import routes from 'routes';
import { useMaterialUIController } from 'contexts';
import { useSelector } from 'react-redux';
import { RootStateType } from 'types';
import { IntlProvider } from 'react-intl';
import en_messages from './languages/en.json';
import de_messages from './languages/de.json';
import fr_messages from './languages/fr.json';
import { SignInBasic } from 'layouts/Basic';
import { RenewTokenModal } from 'layouts/authentication/components';
import { GlobalStyles } from '@mui/material';
import { fadeInFwdKeyframes } from 'utils';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity, // Removes auto garbage collection
      staleTime: 15 * 60 * 1000, // Makes calls stale every 15 minutes.
      refetchOnMount: false, // Will not auto-refetch if error.
      retry: false, // Defaults to no retries
    },
  },
});

export default function GlobalProviders() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <ProviderComposer
      contexts={[
        <QueryClientProvider client={queryClient} />,
        <ThemeProvider theme={darkMode ? themeDark : theme} />,
        <NotificationContextProvider />,
        <ApiLoaderContextProvider />,
        <CurrentUserContextProvider />,
        <SelectedEntityContextProvider />,
      ]}
    >
      <>
        <CssBaseline />
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </>
    </ProviderComposer>
  );
}

// Time in minutes before being kicked off
export const EXPIRATION_TIME = 7 * 24 * 60; // 7 days
export const ALMOST_EXPIRED_TIME = EXPIRATION_TIME - 5;

export function App() {
  const { currentUser, isWaevAdmin, logout, dataGetMe } = useContext(CurrentUserContext);
  const { renderLoader, isLoadingGlobal: isLoading } = useContext(ApiLoaderContext);
  const { notificationRenderSuccessNotification, notificationRenderErrorNotification } =
    useContext(NotificationContext);
  const [controller] = useMaterialUIController();
  const { isMiniSidenav, layout, sidenavColor, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const { pathname } = useLocation();
  const [isJwtWarning, setIsJwtWarning] = useState<boolean>(false);

  const lang = useSelector((state: RootStateType) => state.language.lang);
  const messages: any = {
    en: en_messages,
    de: de_messages,
    fr: fr_messages,
  };

  useEffect(() => {
    if (process.env.REACT_APP_API_URL !== 'https://api.waevdata.com') {
      let favicon = '/favicon.png';

      switch (process.env.REACT_APP_API_URL) {
        case 'https://api-staging.waevdata.com':
          favicon = '/favicon-staging.png';
          break;
        case 'https://api-development.waevdata.com':
          favicon = '/favicon-dev.png';
          break;
        case 'http://localhost:3000':
          favicon = '/favicon-local.png';
          break;
      }

      document.getElementById('favicon-ref').setAttribute('href', favicon);
    }
  }, []);

  // If the token is close to expiration, we remove it manually before anything paints.
  const storeTime = window.localStorage.getItem('jwtStoreTime');
  const checkJwtToken = () => {
    if (storeTime) {
      const msBetweenDates = Math.abs(new Date().getTime() - parseInt(storeTime));
      const minutes = msBetweenDates / (60 * 1000);

      // If the login time is close to expiration, we prompt them to renew.
      if (minutes > ALMOST_EXPIRED_TIME) {
        !isJwtWarning && setIsJwtWarning(true);
        // If they've gone over, we fully log them out.
        if (minutes > EXPIRATION_TIME) {
          logout();
        }
      }
    }
  };

  useEffect(() => {
    const onTabFocus = () => checkJwtToken();
    window.addEventListener('focus', onTabFocus);
    return () => {
      window.removeEventListener('focus', onTabFocus);
    };
  }, []);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes: any[]): any =>
    allRoutes.map(
      (route: {
        collapse: any;
        route: string;
        component: ReactElement<any, string | JSXElementConstructor<any>>;
        key: Key;
      }) => {
        if (route.collapse) {
          return getRoutes(route.collapse);
        }

        if (route.route) {
          return <Route path={route.route} element={route.component} key={route.key} />;
        }

        return null;
      }
    );

  if (!currentUser) {
    return (
      <IntlProvider locale={lang} messages={messages[lang]}>
        <AuthContextProvider>
          <GlobalStyles styles={{ html: { overflow: 'hidden' } }} />
          <>
            <SignInBasic />
            {notificationRenderSuccessNotification}
            {notificationRenderErrorNotification}
          </>
        </AuthContextProvider>
      </IntlProvider>
    );
  }

  checkJwtToken();

  const fadeOutKeyframes = () => keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

  return (
    <IntlProvider locale={lang} messages={messages[lang]}>
      {isJwtWarning && (
        <AuthContextProvider>
          <RenewTokenModal isOpen={isJwtWarning} setIsOpen={setIsJwtWarning} />
        </AuthContextProvider>
      )}
      {layout === 'dashboard' && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={
              isMiniSidenav ? (
                <WaevAvatarIcon
                  alt="profile-image"
                  size="md"
                  bgColor="info"
                  fadeAnimation={`ease-out 0.5s ${fadeOutKeyframes()}`}
                  padding={0.5}
                  opacity={1}
                />
              ) : (transparentSidenav && !darkMode) || whiteSidenav ? (
                <WaevAvatarIcon
                  alt="profile-image"
                  size="md"
                  bgColor="info"
                  fadeAnimation={`ease-out 0.5s ${fadeOutKeyframes()}`}
                  padding={0.5}
                  opacity={1}
                />
              ) : (
                <MDBox
                  sx={{
                    flex: 1,
                    position: 'relative',
                    paddingLeft: '5%',
                    paddingBottom: 5,
                    paddingTop: 2,
                    '&:hover': {
                      '>#WaevLogoBasic': { opacity: 0 },
                      '>#WaevLogoBasicLoading': { opacity: 1 },
                    },
                  }}
                >
                  <MDBox
                    id="WaevLogoBasic"
                    sx={{
                      opacity: isLoading ? 0 : 1,
                      transition: 'opacity 500ms',
                      position: 'absolute',
                      '>svg': { animation: `${fadeInFwdKeyframes()} 1s ease-in both` },
                    }}
                  >
                    <WaevLogoBasic />
                  </MDBox>

                  <MDBox
                    id="WaevLogoBasicLoading"
                    sx={{
                      opacity: isLoading ? 1 : 0,
                      transition: 'opacity 500ms',
                      position: 'absolute',
                      zIndex: 10,
                      '>svg': { animation: `${fadeInFwdKeyframes()} 1s ease-in both` },
                    }}
                  >
                    <WaevLogoBasicLoading />
                  </MDBox>
                </MDBox>
              )
            }
            brandName="Waev Dashboard"
            routes={routes(currentUser, dataGetMe, isWaevAdmin)}
          />
          {notificationRenderSuccessNotification}
          {notificationRenderErrorNotification}
          {renderLoader}
        </>
      )}
      <Routes>
        {getRoutes(routes(currentUser, dataGetMe, isWaevAdmin))}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </IntlProvider>
  );
}
