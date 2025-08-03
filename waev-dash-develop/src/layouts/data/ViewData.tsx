import { useContext, useState } from 'react';

// @mui material components
import { Card, Divider, Grid } from '@mui/material';
import { FlashingLoader, RecordModal } from 'components';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';

// Waev Dashboard components
import { crossSiteFadeInKeyframes, FormattedMessage } from 'utils';
import {
  DeploymentRecordContext,
  GroupRecordContext,
  OrganizationContext,
  RecordContext,
  SelectedEntityContext,
  DeploymentUserRecordsContext,
} from 'contexts';
import { DataDeploymentsList, DataDeploymentGroupsList, DataGroupsList, EmptyPage } from 'layouts';
import { ViewDataByEntity } from './ViewDataByEntity';
import { DashboardLayout, DashboardNavbar } from 'components';

import { TourContext } from 'contexts';
import { useListDeployments, useEffect } from 'hooks';
import { parsePath } from 'utils';

export function ViewData(): JSX.Element {
  const {
    isLoadingOrganization,
    selectedOrganization,
    selectedOrganizationId,
    selectedDeployment,
  } = useContext(SelectedEntityContext);
  const {
    isLoadingData: isLoadingDeploymentData,
    isRefetchingData: isRefetchingDeploymentData,
    onClickUserSearchSubmit: onClickDeploymentUserSearchSubmit,
    waevDeploymentRecordTableData,
    refetchSlimDeploymentRecords,
    recordsPageNumber: deploymentRecordsPageNumber,
    setRecordsPageNumber: setDeploymentRecordsPageNumber,
    defaultEntriesPerPage: defaultDeploymentEntriesPerPage,
    setDefaultEntriesPerPage: setDefaultDeploymentEntriesPerPage,
    setSelectedStoreId: setSelectedDeploymentStoreId,
    handleShowUserDetailsClick: handleShowDeploymentUserDetailsClick,
    onClickGetFullRecord: onClickGetFullDeploymentRecord,
    setSelectedUserDetailsId: setSelectedUuid,
    // userIdFieldName,
  } = useContext(DeploymentRecordContext);
  const { clearRecordModalState } = useContext(DeploymentUserRecordsContext);
  const { uuidSearchInput, setUuidSearchInput } = useContext(RecordContext);
  const {
    isLoadingData: isLoadingGroupData,
    isRefetchingData: isRefetchingGroupData,
    onClickUserSearchSubmit: onClickGroupUserSearchSubmit,
    waevTableGroupData,
    refetchSlimGroupRecords,
    recordsPageNumber: groupRecordsPageNumber,
    setRecordsPageNumber: setGroupRecordsPageNumber,
    defaultEntriesPerPage: defaultGroupEntriesPerPage,
    setDefaultEntriesPerPage: setGroupDefaultEntriesPerPage,
    setSelectedGroupStoreId,
    handleShowGroupUserDetailsClick,
    onClickGetFullGroupRecord,
    organizationDeploymentIds,
    // userIdFieldName,
  } = useContext(GroupRecordContext);
  const { selectedEntity } = useContext(RecordContext);
  const { isHasOwnerOrAdminAccess } = useContext(OrganizationContext);

  const { isLoading: isLoadingDeployments } = useListDeployments(selectedOrganizationId);
  // const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<string>('record_details');

  const {
    isLoadingData,
    isLoadingEntities,
    isRefetchingData,
    refetchSlimRecords,
    onClickUserSearchSubmit,
    waevRecordTableData,
    handleShowUserDetailsClick,
    onClickGetFullRecord,
    setSelectedStoreId,
    recordsPageNumber,
    setRecordsPageNumber,
    defaultEntriesPerPage,
    setDefaultEntriesPerPage,
    entityType,
  } =
    selectedEntity?.type === 'deployments'
      ? {
          isLoadingData: isLoadingDeploymentData,
          isLoadingEntities: isLoadingDeployments,
          isRefetchingData: isRefetchingDeploymentData,
          refetchSlimRecords: refetchSlimDeploymentRecords,
          onClickUserSearchSubmit: onClickDeploymentUserSearchSubmit,
          waevRecordTableData: waevDeploymentRecordTableData,
          handleShowUserDetailsClick: handleShowDeploymentUserDetailsClick,
          onClickGetFullRecord: onClickGetFullDeploymentRecord,
          setSelectedStoreId: setSelectedDeploymentStoreId,
          recordsPageNumber: deploymentRecordsPageNumber,
          setRecordsPageNumber: setDeploymentRecordsPageNumber,
          defaultEntriesPerPage: defaultDeploymentEntriesPerPage,
          setDefaultEntriesPerPage: setDefaultDeploymentEntriesPerPage,
          entityType: 'deployment',
        }
      : {
          isLoadingData: isLoadingGroupData,
          isLoadingEntities: isLoadingDeployments,
          isRefetchingData: isRefetchingGroupData,
          refetchSlimRecords: refetchSlimGroupRecords,
          onClickUserSearchSubmit: onClickGroupUserSearchSubmit,
          waevRecordTableData: waevTableGroupData,
          handleShowUserDetailsClick: handleShowGroupUserDetailsClick,
          onClickGetFullRecord: onClickGetFullGroupRecord,
          setSelectedStoreId: setSelectedGroupStoreId,
          recordsPageNumber: groupRecordsPageNumber,
          setRecordsPageNumber: setGroupRecordsPageNumber,
          defaultEntriesPerPage: defaultGroupEntriesPerPage,
          setDefaultEntriesPerPage: setGroupDefaultEntriesPerPage,
          entityType: 'group',
        };
  const { checkFlags, onSelectCall } = useContext(TourContext);

  const flag = {
    ...checkFlags,
    isViewDataFirstVisitCheck: true,
    isHomeSelect: false,
    isSettingsSelect: false,
    isDeploymentsSelect: false,
    isViewDataSelect: true,
  };

  useEffect(() => {
    if (parsePath(window.location.href) === '/data/view-data') {
      onSelectCall(flag);
    }
  }, [parsePath(window.location.href)]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3}>
        {/* <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid> */}
        <Grid item xs={12} xl={11.5}>
          <MDBox
            pt={selectedOrganization && selectedDeployment ? 6 : 4}
            pb={3}
            sx={{
              animation:
                selectedOrganization && selectedDeployment
                  ? `1s ease-out ${crossSiteFadeInKeyframes()}`
                  : '',
            }}
          >
            {selectedEntity ? (
              <ViewDataByEntity
                isLoadingData={isLoadingData}
                isLoadingEntities={isLoadingEntities}
                isRefetchingData={isRefetchingData}
                refetchSlimRecords={refetchSlimRecords}
                uuidSearchInput={uuidSearchInput}
                setUuidSearchInput={setUuidSearchInput}
                onClickUserSearchSubmit={onClickUserSearchSubmit}
                waevRecordTableData={waevRecordTableData}
                handleShowUserDetailsClick={handleShowUserDetailsClick}
                onClickGetFullRecord={onClickGetFullRecord}
                setSelectedStoreId={setSelectedStoreId}
                recordsPageNumber={recordsPageNumber}
                setRecordsPageNumber={setRecordsPageNumber}
                defaultEntriesPerPage={defaultEntriesPerPage}
                setDefaultEntriesPerPage={setDefaultEntriesPerPage}
                setIsModalOpen={setIsModalOpen}
                entityType={entityType as 'deployment' | 'group'}
                setModalTab={setModalTab}
              />
            ) : (
              <Card sx={{ paddingBottom: selectedOrganization && selectedDeployment ? 3 : 0 }}>
                <Grid
                  px={3}
                  pt={selectedOrganization && selectedDeployment ? 3 : 4}
                  lineHeight={1}
                  container
                >
                  <Grid item xs={7} md={7} pr={3}>
                    <MDTypography variant="h5" fontWeight="medium">
                      <FormattedMessage id="view_data.title" defaultMessage="View Waev Data" />
                    </MDTypography>
                    {selectedOrganization && selectedDeployment && (
                      <MDTypography variant="button" color="text">
                        <FormattedMessage
                          id="view_data.subtitle"
                          defaultMessage="Select the data you'd like to view."
                        />
                      </MDTypography>
                    )}
                  </Grid>
                  {
                    <Grid item xs={5} md={5}>
                      {(isLoadingOrganization || isLoadingDeploymentData || isLoadingGroupData) && (
                        <MDBox
                          alignSelf="center"
                          sx={{ width: '100%' }}
                          data-testid="organization-loading-status"
                          pt={3}
                        >
                          <FlashingLoader />
                        </MDBox>
                      )}
                    </Grid>
                  }
                </Grid>
                {selectedOrganization && !selectedEntity && selectedDeployment && (
                  <>
                    <MDBox sx={{ pt: 1 }}>
                      <Divider />
                    </MDBox>
                    <MDBox id="selectTable" pt={1} pb={2} px={2}>
                      <Grid container>
                        <Grid
                          item
                          sm={12}
                          md={6}
                          sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
                        >
                          <DataDeploymentsList org={selectedOrganization} />
                        </Grid>
                        <Grid
                          item
                          sm={12}
                          md={6}
                          sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
                        >
                          {organizationDeploymentIds && (
                            <DataDeploymentGroupsList org={selectedOrganization} />
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </>
                )}
                <MDBox sx={{ pt: 1 }}>
                  {selectedOrganization && selectedDeployment && <Divider />}
                </MDBox>
                <MDBox pt={1} pb={2} px={2}>
                  <Grid container>
                    <Grid
                      item
                      sm={12}
                      md={6}
                      sx={{
                        animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}`,
                      }}
                    >
                      {organizationDeploymentIds && selectedDeployment && <DataGroupsList />}
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            )}

            {isHasOwnerOrAdminAccess ? (
              <EmptyPage
                page="ViewData"
                noOrganizationMessage={`You have no Organizations. Go to the `}
                noOrganizationMessage2={` to get started.`}
                organizationLinkPath={'/pages/account/settings'}
                noDeploymentMessage={'You have no Deployments. Go to the '}
                noDeploymentMessage2={' page to create one.'}
                organizationLinkText={'Settings'}
                deploymentsLinkText={'Deployments'}
                deploymentsLinkPath={'/deployments'}
              />
            ) : (
              <EmptyPage
                page="ViewData"
                noOrganizationMessage={`You have no Organizations. Go to the `}
                noOrganizationMessage2={` to get started.`}
                organizationLinkPath={'/pages/account/settings'}
                noDeploymentMessage={'You have no Deployments.'}
                noDeploymentMessage2={' '}
                organizationLinkText={'Settings'}
              />
            )}

            <RecordModal
              isOpen={!!isModalOpen}
              setIsOpen={setIsModalOpen}
              waevData={waevDeploymentRecordTableData}
              modalTab={modalTab}
              setModalTab={setModalTab}
              onCloseClick={() => {
                //setSelectedStoreId(undefined);
                setIsModalOpen(false);
                setSelectedUuid(undefined);
                clearRecordModalState();
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
