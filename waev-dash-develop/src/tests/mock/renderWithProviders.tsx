import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// import { render, RenderOptions } from '@testing-library/react';
import { RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  SelectedEntityContextProvider,
  CurrentUserContextProvider,
  NotificationContextProvider,
  ApiLoaderContextProvider,
  MaterialUIControllerProvider,
  ProviderComposer,
} from 'contexts';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';
import themeDark from 'assets/theme-dark';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Will keep queries from retrying for 20 seconds unless set otherwise.
      // staleTime: 1000 * 20,
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      cacheTime: Infinity, // never
    },
  },
});

// @see https://github.com/microsoft/TypeScript/issues/28631 for "component: any"
export default function renderWithProviders(
  render: any,
  component: any,
  darkMode = true,
  options?: RenderOptions
) {
  return render(
    <div id="__next">
      <ProviderComposer
        contexts={[
          <BrowserRouter />,
          <MaterialUIControllerProvider />,
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
          {component}
        </>
      </ProviderComposer>
    </div>
  );
}

export { renderWithProviders };
