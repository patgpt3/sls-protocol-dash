import { useContext, useDeleteOrganization, useListOrganizations } from 'hooks';

// @mui material components
import { Grid, Icon } from '@mui/material/';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDButton from 'components/Elements/MDButton';

import { OrganizationCard } from './components/Card/OrganizationCard';
import {
  DeploymentContext,
  OrganizationContext,
  SelectedEntityContext,
  CurrentUserContext,
} from 'contexts';
import { FlashingLoader, SubHeader } from 'components';
import { crossSiteFadeInKeyframes, defineMessages, useIntl } from 'utils';
import { EmptyPage } from 'layouts';

const messages = defineMessages({
  subheaderTitle: {
    id: 'settings.subheader.title',
    defaultMessage: 'Your Organization',
  },
  subheaderSubtitle: {
    id: 'settings.subheader.subtitle',
    defaultMessage: 'Manage your organization here!',
  },
});

export function Organizations(): JSX.Element {
  const intl = useIntl();
  const { setIsAddingOrg, isLoadingOrganization, setOrgNameInput, setUpdatingOrganization } =
    useContext(OrganizationContext);
  const { selectedOrganizationId } = useContext(SelectedEntityContext);
  const { isLoadingDeployment } = useContext(DeploymentContext);
  const { currentUser, token } = useContext(CurrentUserContext);

  const { isLoading: isLoadingDeleteOrganization } = useDeleteOrganization(selectedOrganizationId);
  const { data: organizations } = useListOrganizations(currentUser, token);

  // OnClick Handlers
  const onClickAddOrg = () => {
    setIsAddingOrg(true);
    setOrgNameInput(undefined);
    setUpdatingOrganization(undefined);
  };

  const selectedOrganization =
    organizations?.length > 0
      ? organizations.find((org) => org.id === selectedOrganizationId)
      : null;

  const actions =
    isLoadingOrganization || isLoadingDeployment || isLoadingDeleteOrganization ? (
      <MDBox
        alignSelf="center"
        mr={1}
        sx={{ width: '25%', marginLeft: 'auto' }}
        data-testid="organization-create-loading-status"
      >
        <FlashingLoader />
      </MDBox>
    ) : (
      <MDButton variant="gradient" color="info" onClick={onClickAddOrg} id={'createOrg'}>
        <Icon>add</Icon>&nbsp; Add New
      </MDButton>
    );
  return (
    <MDBox pb={3}>
      <SubHeader
        title={selectedOrganization ? intl.formatMessage(messages.subheaderTitle) : ''}
        subtitle={selectedOrganization ? intl.formatMessage(messages.subheaderSubtitle) : ''}
        actionsSection={actions}
      />
      <MDBox mt={5}>
        <Grid container spacing={0} sx={{ columnCount: '1' }}>
          {selectedOrganization && (
            <Grid item xs={12} md={12} lg={12} sx={{ maxWidth: '100%' }}>
              <MDBox
                mb={1.5}
                mt={1.5}
                sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}
              >
                <OrganizationCard org={selectedOrganization} />
              </MDBox>
            </Grid>
          )}
          {!isLoadingOrganization && (
            <EmptyPage
              page="Settings"
              noOrganizationMessage={`You have no Organizations. Click `}
              noOrganizationMessage2={` to create one.`}
              organizationLinkPath={'/pages/account/settings'}
              organizationLinkText={'+ Add New'}
            />
          )}
        </Grid>
      </MDBox>
    </MDBox>
  );
}
