// Waev Dashboard components
import {
  MDBox,
  OrganizationDropdown,
  FlashingLoader,
  Header,
  MDAvatar,
} from 'components';
import { DeploymentContext, SelectedEntityContext, CurrentUserContext } from 'contexts';
import { useContext } from 'react';
import { useListOrganizations } from 'hooks';
import { Icon } from '@mui/material';

function SettingsHeader(): JSX.Element {
  const { isAddingDeployment } = useContext(DeploymentContext);
  const { currentUser, token } = useContext(CurrentUserContext);

  const { isLoadingOrganization, selectedOrganization } = useContext(SelectedEntityContext);
  const { data: organizations, isLoading: isLoadingOrganizations } = useListOrganizations(
    currentUser,
    token
  );

  const avatarSection = (
    <MDAvatar bgColor="info" alt="Deployment" size="lg" shadow="sm">
      <Icon fontSize="large">rocket-launch</Icon>
    </MDAvatar>
  );

  const actionsSection = (
    <MDBox
      display="flex"
      justifyContent={{ xs: 'space-between', sm: 'flex-end', md: 'flex-end' }}
      alignItems="center"
      lineHeight={1}
      width="100%"
    >
      {isLoadingOrganization || isLoadingOrganizations ? (
        <MDBox width="100%">
          <FlashingLoader />
        </MDBox>
      ) : (
        organizations && organizations.length && <OrganizationDropdown />
      )}
    </MDBox>
  );

  return (
    <Header
      avatar={avatarSection}
      title={`Settings ${isAddingDeployment ? ' - Adding Deployment' : ''}`}
      subtitle={isAddingDeployment ? selectedOrganization?.attributes.name : undefined}
      actionsSection={!!selectedOrganization && actionsSection}
    />
  );
}

export default SettingsHeader;
