import {
  Banner,
  DashboardLayout,
  DashboardNavbar,
  DeploymentErrorBanner,
  DeploymentPendingBanner,
  MDBox,
} from 'components';

// Deployments page components
import { DataIngest, DeploymentHeader } from 'components';
import {
  AccessContextProvider,
  DeploymentContext,
  GroupContextProvider,
  OptInFlagContextProvider,
  PermissionContext,
  SelectedEntityContext,
  ApiLoaderContext,
  OrganizationContext,
  UnionContextProvider,
} from 'contexts';
import { useContext, useEffect, useState, useListDeployments, useListGroups } from 'hooks';
import { DeploymentWizard } from './create';

// Deployments page components
import { PermissionsWizard } from './Permissions';

import { Grid } from '@mui/material';
import { OptInFlagsCard } from './OptInFlags';
import { AccessesCard } from './Accesses/AccessesCard';
import { GroupErrorBanner, GroupPendingBanner, GroupsCard } from './Groups';
import { GroupsWizard } from './Groups/create';
import { AssociateUnionWizard } from './Unions/associate';
import { PermissionsView } from './Permissions/PermissionsView';
import { crossSiteFadeInKeyframes } from 'utils';
import { EmptyPage } from 'layouts';
import { TourContext } from 'contexts/tourContext';
import { parsePath } from 'utils';
import { UnionsCard } from './Unions';

export function Deployments(): JSX.Element {
  const { selectedOrganization, selectedDeployment, selectedDeploymentId } =
    useContext(SelectedEntityContext);
  const {
    currentUserDeploymentPermissions,
    isAddingDeployment,
    isHasOwnerOrAdminAccess,
    isLoadingDeleteDeployment,
    setDeploymentNameInput,
    setIsAddingDeployment,
    updatingDeployment,
    isAddingGroup,
    setIsAddingGroup,
    isAssociatingUnion,
    setIsAssociatingUnion,
  } = useContext(DeploymentContext);
  const { addingPermissionsType } = useContext(PermissionContext);

  const { isHasOwnerOrAdminAccess: orgIsHasOwnerOrAdminAccess } = useContext(OrganizationContext);
  const { isBlockingLoader } = useContext(ApiLoaderContext);

  const { data: groups } = useListGroups(selectedDeploymentId);

  const { checkFlags, onSelectCall } = useContext(TourContext);

  const [isHeaderDisabled, setIsHeaderDisabled] = useState<boolean>(false);

  const { data: deployments } = useListDeployments(selectedOrganization?.id);

  useEffect(() => {
    setIsHeaderDisabled(!!isAddingDeployment || !!updatingDeployment || !!addingPermissionsType);
  }, [isAddingDeployment, updatingDeployment, addingPermissionsType]);

  const flag = {
    ...checkFlags,
    isDeploymentsFirstVisitCheck: true,
    isHomeSelect: false,
    isSettingsSelect: false,
    isDeploymentsSelect: true,
    isViewDataSelect: false,
  };

  useEffect(() => {
    if (parsePath(window.location.href) === '/deployments') {
      onSelectCall(flag);
    }
  }, [parsePath(window.location.href)]);

  const isDeploymentStatusComplete =
    currentUserDeploymentPermissions?.attributes?.status === 'complete';

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3}>
        {/* <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid> */}
        <Grid item xs={12} xl={11.5}>
          <DeploymentHeader
            onClickAddDeployment={() => setIsAddingDeployment(true)}
            onCancel={() => {
              setIsAddingDeployment(false);
              setDeploymentNameInput('');
            }}
            isAddingDeployment={isAddingDeployment}
            isHeaderDisabled={isHeaderDisabled}
            sx={{ mt: 4 }}
          />
          {deployments?.length > 0 &&
            deployments
              .filter((deployment) => deployment?.attributes?.status !== 'complete')
              // eslint-disable-next-line array-callback-return
              .map((deployment, index) => {
                switch (deployment.attributes.status) {
                  case 'failed': {
                    return <DeploymentErrorBanner deployment={deployment} key={index} />;
                  }
                  case 'processing':
                  case 'pending': {
                    return <DeploymentPendingBanner deployment={deployment} key={index} />;
                  }
                }
              })}
          {groups?.length > 0 &&
            groups
              .filter((group) => group?.attributes?.status !== 'complete')
              // eslint-disable-next-line array-callback-return
              .map((group, index) => {
                switch (group.attributes.status) {
                  case 'failed': {
                    return <GroupErrorBanner group={group} key={index} />;
                  }
                  case 'processing':
                  case 'pending': {
                    return <GroupPendingBanner group={group} key={index} />;
                  }
                }
              })}
          {currentUserDeploymentPermissions?.attributes?.status === 'failed' && (
            <Banner
              bg="error"
              title="Permission Creation Failed."
              subtitle="This deployment is still being provisioned. This can take several minutes. If you feel there is an error please contact us."
            />
          )}
          {['pending', 'processing'].includes(
            currentUserDeploymentPermissions?.attributes?.status
          ) && (
            <Banner
              bg="warning"
              title={`Permissions ${currentUserDeploymentPermissions?.attributes?.status
                .charAt(0)
                .toUpperCase()}${currentUserDeploymentPermissions?.attributes?.status.slice(1)}.`}
              subtitle="This deployment is still being provisioned. This can take several minutes. If you feel there is an error please contact us."
            />
          )}
          {/* Deployment Data */}
          {!isAddingDeployment &&
            !updatingDeployment &&
            !isLoadingDeleteDeployment &&
            !isBlockingLoader &&
            (orgIsHasOwnerOrAdminAccess ? (
              <EmptyPage
                page="Deployments"
                noOrganizationMessage={`You have no Organizations. Go to the `}
                noOrganizationMessage2={` to get started.`}
                organizationLinkPath={'/pages/account/settings'}
                noDeploymentMessage={'You have no Deployments. Click '}
                noDeploymentMessage2={' above to add one.'}
                organizationLinkText={'Settings'}
                deploymentsLinkText={'+ Add New'}
                deploymentsLinkOnCLick={() => setIsAddingDeployment(true)}
                deploymentsLinkPath={'/deployments'}
              />
            ) : (
              <EmptyPage
                page="Deployments"
                noOrganizationMessage={`To get started add an `}
                noOrganizationMessage2={`.`}
                organizationLinkPath={'/pages/account/settings'}
                noDeploymentMessage={'You have no Deployments.'}
                noDeploymentMessage2={' '}
                organizationLinkText={'organization'}
              />
            ))}
          {!isLoadingDeleteDeployment && (
            <MDBox mb={2}>
              {isAddingDeployment ? (
                <DeploymentWizard onCancel={() => setIsAddingDeployment(false)} />
              ) : addingPermissionsType ? (
                <PermissionsWizard />
              ) : isAddingGroup ? (
                <GroupContextProvider>
                  <GroupsWizard onCancel={() => setIsAddingGroup(false)} />
                </GroupContextProvider>
              ) : isAssociatingUnion ? (
                <UnionContextProvider>
                  <AssociateUnionWizard onCancel={() => setIsAssociatingUnion(false)} />
                </UnionContextProvider>
              ) : (
                <>
                  {selectedOrganization && selectedDeployment && isDeploymentStatusComplete && (
                    <Grid mt={2} container spacing={3}>
                      <Grid
                        item
                        xs={12}
                        lg={12}
                        sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
                      >
                        <DataIngest />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}
                      >
                        <OptInFlagContextProvider>
                          <OptInFlagsCard />
                        </OptInFlagContextProvider>
                      </Grid>
                      {isHasOwnerOrAdminAccess && (
                        <Grid
                          item
                          xs={12}
                          sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}
                        >
                          <AccessContextProvider>
                            <AccessesCard />
                          </AccessContextProvider>
                        </Grid>
                      )}
                      {isHasOwnerOrAdminAccess ? (
                        <Grid
                          item
                          xs={12}
                          sx={{ animation: `2s ease-out ${crossSiteFadeInKeyframes()}` }}
                        >
                          <GroupContextProvider>
                            <GroupsCard />
                          </GroupContextProvider>
                        </Grid>
                      ) : (
                        groups?.length > 0 && (
                          <Grid
                            item
                            xs={12}
                            sx={{ animation: `2.5s ease-out ${crossSiteFadeInKeyframes()}` }}
                          >
                            <GroupContextProvider>
                              <GroupsCard />
                            </GroupContextProvider>
                          </Grid>
                        )
                      )}
                      {isHasOwnerOrAdminAccess && (
                        <Grid
                          item
                          xs={12}
                          sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}
                        >
                          <UnionContextProvider>
                            <UnionsCard />
                          </UnionContextProvider>
                        </Grid>
                      )}
                      {isHasOwnerOrAdminAccess && (
                        <Grid
                          item
                          xs={12}
                          sx={{ animation: `3s ease-out ${crossSiteFadeInKeyframes()}` }}
                        >
                          <PermissionsView entity={selectedDeployment} entityType="deployment" />
                        </Grid>
                      )}
                    </Grid>
                  )}
                  {!selectedDeployment && <></>}
                </>
              )}
            </MDBox>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
