// @mui material components
import { Icon } from '@mui/material';

// Waev Dashboard components
import { FlashingLoader, Fold, MDBox, MDTypography } from 'components';
import { CurrentUserContext, PermissionContext, SelectedEntityContext } from 'contexts';
import { useContext, useMemo, useListOrganizationPermissions } from 'hooks';

import { Integration, Organization, WaevPermissions } from 'types';
import { isUserAllowed, defineMessages, useIntl } from 'utils';
import { UserEnrolledItem } from './UserEnrolledItem';

const messages = defineMessages({
  enrolledUsers: {
    id: 'settings.enrolled_users.title',
    defaultMessage: 'Enrolled Users',
  },
  noEnrolledUsers: {
    id: 'settings.enrolled_users.no_users',
    defaultMessage: 'No Enrolled Users',
  },
});

// Declaring prop types for the DeploymentsList
interface Props {
  org: Organization;
}

// Custom styles for DeploymentsList
export function UsersEnrolledList({ org }: Props): JSX.Element {
  const intl = useIntl();
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedOrganization } = useContext(SelectedEntityContext);

  const { setOrgIdForPermissions, setAddingPermissionsType } = useContext(PermissionContext);
  const { data: allPermissions, isLoading: isLoadingPermissions } = useListOrganizationPermissions(
    org.id
  );

  const onAddEnrollClick = () => {
    setOrgIdForPermissions(org.id);
    setAddingPermissionsType('organization');
  };

  const isHasOwnerOrAdminAccess = useMemo(
    () =>
      isUserAllowed(selectedOrganization?.fullPermissions, currentUser.attributes.email, [
        'owner',
        'admin',
      ]),
    [selectedOrganization, org.id]
  );

  return (
    <MDBox alignItems="center" mr={3}>
      {allPermissions || isLoadingPermissions ? (
        <Fold<Integration>
          storageKey="FoldedUsers"
          title={intl.formatMessage(messages.enrolledUsers)}
          item="standardWeb"
          contents={
            <MDBox ml={3}>
              {allPermissions &&
                allPermissions?.map((permissionData: WaevPermissions) => {
                  return (
                    <UserEnrolledItem
                      key={`Permission-${permissionData.id}`}
                      organizationPermissions={permissionData}
                    />
                  );
                })}
            </MDBox>
          }
          titleBarActionContents={
            <>
              {selectedOrganization?.fullPermissions &&
                selectedOrganization?.fullPermissions?.length && (
                  <MDTypography
                    ml={1}
                    color="secondary"
                    variant="subtitle2"
                    textTransform="capitalize"
                    fontWeight="medium"
                  >
                    {allPermissions && !isLoadingPermissions ? ` (${allPermissions?.length})` : ''}
                  </MDTypography>
                )}
              <MDBox marginLeft="auto" id="addEnUser">
                {isLoadingPermissions ? (
                  <MDBox width="20%" marginLeft="auto">
                    <FlashingLoader />
                  </MDBox>
                ) : (
                  isHasOwnerOrAdminAccess && (
                    <MDTypography
                      color="secondary"
                      onClick={onAddEnrollClick}
                      component="button"
                      // onClick={openDropdownMenu}
                      sx={{
                        ml: 'auto',
                        alignSelf: 'flex-start',
                        mr: 1,
                        backgroundColor: 'transparent !important',
                        border: 'none !important',
                      }}
                    >
                      <Icon color="info" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        add
                      </Icon>
                    </MDTypography>
                  )
                )}
              </MDBox>
            </>
          }
        />
      ) : (
        <MDTypography
          sx={{
            // ml: 'auto',
            // alignSelf: 'flex-start',
            ml: 3,
          }}
          variant="subtitle2"
          textTransform="capitalize"
          fontWeight="medium"
        >
          {intl.formatMessage(messages.noEnrolledUsers)}
        </MDTypography>
      )}
    </MDBox>
  );
}
