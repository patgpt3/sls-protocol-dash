// @mui material components
import Grid from '@mui/material/Grid';

// Waev Dashboard components
import { ConfirmationModal, ContentModal, MDBox } from 'components';
import {
  Organizations,
  OrganizationsWizard,
  OrganizationPermissionsWizard,
  PermissionsSelector,
  UserUpdateWizard,
} from 'layouts';
import { DashboardLayout } from 'components/LayoutContainers/DashboardLayout';
import { DashboardNavbar } from 'components/Navbars/DashboardNavbar';
import { parsePath } from 'utils';

import SettingsHeader from './components/SettingsHeader';
import {
  CurrentUserContext,
  DeploymentContext,
  OrganizationContext,
  PermissionContext,
  // OptInFlagContextProvider,
} from 'contexts';
import { useContext, useEffect } from 'react';
import { DeploymentWizard } from 'layouts/applications/deployments/create';
import { TourContext } from 'contexts/tourContext';

export function Settings(): JSX.Element {
  const { isAddingOrg, setIsAddingOrg } = useContext(OrganizationContext);
  const { isAddingDeployment, setIsAddingDeployment } = useContext(DeploymentContext);
  const {
    deletingPermission,
    setDeletingPermission,
    updatingPermission,
    addingPermissionsType,
    onDeletePermission,
    onUpdatePermission,
    setUpdatingPermission,
  } = useContext(PermissionContext);
  const { updateUser } = useContext(CurrentUserContext);
  const { checkFlags, onSelectCall } = useContext(TourContext);

  const body = () => {
    // Wizards
    if (addingPermissionsType) {
      return (
        <Grid item xs={12}>
          <OrganizationPermissionsWizard />
        </Grid>
      );
    }
    if (updateUser) {
      return (
        <Grid item xs={12}>
          <UserUpdateWizard />
        </Grid>
      );
    }

    if (isAddingDeployment) {
      return (
        <Grid item xs={12}>
          <DeploymentWizard onCancel={() => setIsAddingDeployment(false)} />
        </Grid>
      );
    }
    if (isAddingOrg) {
      return (
        <Grid item xs={12}>
          <OrganizationsWizard onCancel={() => setIsAddingOrg(false)} />
        </Grid>
      );
    }

    // Standard Settings Pages
    return (
      <>
        <Grid item xs={12}>
          <Organizations />
        </Grid>
        {/* <Grid item xs={12}>
          <Users />
        </Grid> */}
        {/* <Grid item xs={12}>
                  <BasicInfo />
                </Grid> */}
        {/* <Grid item xs={12}>
                  <ChangePassword />
                </Grid> */}
        {/* <Grid item xs={12}>
                  <Authentication />
                </Grid> */}
        {/* <Grid item xs={12}>
                  <Accounts />
                </Grid> */}
        {/* <Grid item xs={12}>
                  <Notifications />
                </Grid> */}
        {/* <Grid item xs={12}>
                  <Sessions />
                </Grid> */}
        {/* <Grid item xs={12}>
                  <DeleteAccount />
                </Grid> */}
      </>
    );
  };

  const flag = {
    ...checkFlags,
    isSettingsFirstVisitCheck: true,
    isHomeSelect: false,
    isSettingsSelect: true,
    isDeploymentsSelect: false,
    isViewDataSelect: false,
  };

  useEffect(() => {
    if (parsePath(window.location.href) === '/pages/account/settings') {
      onSelectCall(flag);
    }
  }, [parsePath(window.location.href)]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <OptInFlagContextProvider></OptInFlagContextProvider> */}
      <Grid container spacing={3} mt={1}>
        {/* <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid> */}
        <Grid item xs={12} xl={11.5}>
          <MDBox>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <SettingsHeader />
              </Grid>
              {body()}
              <ConfirmationModal
                isOpen={!!deletingPermission}
                setIsOpen={setDeletingPermission}
                isSetUndefined={true}
                title="Remove Organization Permissions?"
                description={`Are you sure you want to unenroll ${
                  deletingPermission?.attributes?.users?.email || 'this user'
                }?`}
                primaryText="Yes"
                onPrimaryClick={() => onDeletePermission('organization')}
                secondaryText="Cancel"
                onSecondaryClick={() => {
                  setDeletingPermission(undefined);
                  // setIsUserEnrollDropdownMenu(null);
                }}
              />
              <ContentModal
                isOpen={!!updatingPermission}
                setIsOpen={setUpdatingPermission}
                isSetUndefined={true}
                title={`Updating Permissions for ${updatingPermission?.attributes?.users?.email}`}
                // description={updatingPermission?.attributes?.user?.email}
                primaryText="Confirm"
                onPrimaryClick={() => onUpdatePermission('organization')}
                secondaryText="Cancel"
                onSecondaryClick={() => {
                  setUpdatingPermission(undefined);
                  // setIsUserEnrollDropdownMenu(null);
                }}
              >
                <MDBox ml="39%">
                  <PermissionsSelector permissionType="Organization" />
                </MDBox>
              </ContentModal>
            </Grid>
          </MDBox>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
