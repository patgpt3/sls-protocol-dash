import { Grid, Icon } from '@mui/material';
import {
  DashboardLayout,
  DashboardNavbar,
  MDBox,
  SubHeader,
  FlashingLoader,
  MDButton,
  MDTypography,
} from 'components';
import { CreateUnionWizard } from './components/create/CreateUnionWizard';
import { UnionCard } from './components/UnionCard';
import { UnionsHeader } from './components/UnionsHeader';
import { OrganizationContext, UnionContext } from 'contexts';
import { useContext } from 'hooks';
import { defineMessages, useIntl, crossSiteFadeInKeyframes } from 'utils';

const messages = defineMessages({
  subheaderUnionsTitle: {
    id: 'unions.subheader.title',
    defaultMessage: 'Your Data Unions',
  },
  subheaderUnionsSubtitle: {
    id: 'unions.subheader.subtitle',
    defaultMessage: 'Manage your data unions here!',
  },
});

export function Unions(): JSX.Element {
  const intl = useIntl();
  const {
    unions,
    isAddingUnion,
    setIsAddingUnion,
    setUnionNameInput,
    setUpdatingUnion,
    isLoadingUnions,
  } = useContext(UnionContext);

  const { isLoadingOrganization } = useContext(OrganizationContext);

  const onClickAddUnion = () => {
    setIsAddingUnion(true);
    setUnionNameInput('');
    setUpdatingUnion(undefined);
  };

  const actions = isLoadingOrganization ? (
    <MDBox
      alignSelf="center"
      mr={1}
      sx={{ width: '25%', marginLeft: 'auto' }}
      data-testid="organization-create-loading-status"
    >
      <FlashingLoader />
    </MDBox>
  ) : (
    <MDButton variant="gradient" color="info" onClick={onClickAddUnion} id={'createOrg'}>
      <Icon>add</Icon>&nbsp; Add New
    </MDButton>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} xl={11.5}>
          <UnionsHeader />
          {isAddingUnion ? (
            <CreateUnionWizard />
          ) : (
            <MDBox pb={3} pt={3}>
              <SubHeader
                title={intl.formatMessage(messages.subheaderUnionsTitle)}
                subtitle={intl.formatMessage(messages.subheaderUnionsSubtitle)}
                actionsSection={actions}
              />
              <MDBox mt={5}>
                <Grid container spacing={0} sx={{ columnCount: '1' }}>
                  {isLoadingUnions ? (
                    <MDBox width="100%" mb={3}>
                      <FlashingLoader />
                    </MDBox>
                  ) : unions && unions.length > 0 ? (
                    unions.map((union) => (
                      <Grid key={union.id} item xs={12} md={12} lg={12} sx={{ maxWidth: '100%' }}>
                        <MDBox
                          mt={1.5}
                          mb={5}
                          sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}
                        >
                          <UnionCard union={union} />
                        </MDBox>
                      </Grid>
                    ))
                  ) : (
                    <MDBox
                      sx={{
                        textAlign: 'center',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <MDBox flex={1}>
                        <MDBox position="relative" display="flex" flexDirection={'row'}>
                          <MDTypography variant="button" fontWeight="regular" textAlign="center">
                            {`You have no Data Unions. Click `}
                            <MDTypography
                              variant="button"
                              color="info"
                              fontWeight="regular"
                              textAlign="center"
                            >
                              {'+ Add New'}
                            </MDTypography>

                            {' to create one.'}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  )}
                </Grid>
              </MDBox>
            </MDBox>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
