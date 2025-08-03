// @mui material components
import Grid from '@mui/material/Grid';

// Waev Dashboard components
import { MDBox, SubHeader } from 'components';
import { Lost, Register } from 'layouts';
import { DashboardLayout, DashboardNavbar, Header } from 'components';

import { AuthContextProvider, CurrentUserContext } from 'contexts';
import { useContext } from 'react';
import { defineMessages, useIntl } from 'utils';

const messages = defineMessages({
  subheaderTitle: {
    id: 'admin_panel.subheader.title',
    defaultMessage: 'Register Users',
  },
  headerTitle: {
    id: 'admin_panel.header.title',
    defaultMessage: 'Admin Panel',
  },
});

export function AdminPanel(): JSX.Element {
  const intl = useIntl();
  const { isWaevAdmin } = useContext(CurrentUserContext);

  const body = () => {
    // Standard AdminPanel Pages
    return (
      <>
        <SubHeader title={intl.formatMessage(messages.subheaderTitle)} mt={5} mb={5} mx={3} />
        <Grid>
          <MDBox xs={12} mt={5} mx={15}>
            <AuthContextProvider>
              <Register />
            </AuthContextProvider>
          </MDBox>
        </Grid>
      </>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} mt={1}>
        {/* <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid> */}
        <Grid item xs={12} xl={11.5}>
          <MDBox>
            <Grid container spacing={3}>
              {isWaevAdmin ? (
                <>
                  <Grid item xs={12}>
                    <Header
                      avatar="admin_panel_settings"
                      title={intl.formatMessage(messages.headerTitle)}
                    />
                  </Grid>
                  {body()}
                </>
              ) : (
                <Lost />
              )}
            </Grid>
          </MDBox>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
