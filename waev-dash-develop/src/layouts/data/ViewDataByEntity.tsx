import { useContext, useEffect, useMemo, useState } from 'react';

// @mui material components
import { Card, Grid, Icon, IconButton, Tooltip } from '@mui/material';
import { FancyIconButton, FlashingLoader, InputWithAction } from 'components';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';

// Waev Dashboard components
import { DataTable, FancyCheckbox } from 'components';
import { waevResponseToTableData, waevEncryptedResponseToTableData } from './FormatData';
import {
  CurrentUserContext,
  RecordContext,
  SelectedEntityContext,
  DeploymentRecordContext,
} from 'contexts';
import { useIntl, defineMessages, FormattedMessage, crossSiteFadeInKeyframes } from 'utils';
import { useLocalStorageByUser } from 'hooks';
import { WaevTableRecord } from 'types';

const messages = defineMessages({
  refreshData: {
    id: 'view_data.data_by_entity.refresh_data',
    defaultMessage: 'Refresh Data',
  },
  columnView: {
    id: 'view_data.data_by_entity.column_view',
    defaultMessage: 'Column View',
  },
  rowView: {
    id: 'view_data.data_by_entity.row_view',
    defaultMessage: 'Row View',
  },
  decrypted: {
    id: 'view_data.data_by_entity.decrypted',
    defaultMessage: 'Decrypted',
  },
  encrypted: {
    id: 'view_data.data_by_entity.encrypted',
    defaultMessage: 'Encrypted',
  },
  show: {
    id: 'view_data.data_by_entity.show',
    defaultMessage: 'Show',
  },
  showing: {
    id: 'view_data.data_by_entity.showing',
    defaultMessage: 'Showing',
  },
  data: {
    id: 'view_data.data_by_entity.data',
    defaultMessage: 'Data',
  },
});

interface ViewDataByEntityProps {
  isLoadingData: boolean;
  isLoadingEntities: boolean;
  isRefetchingData: boolean;
  refetchSlimRecords: () => void;
  uuidSearchInput: string;
  setUuidSearchInput: (uuidSearchInput: string) => void;
  onClickUserSearchSubmit: (bool?: boolean) => void;
  waevRecordTableData: WaevTableRecord[];
  handleShowUserDetailsClick: (isShow?: boolean) => void;
  onClickGetFullRecord: (id: string) => void;
  setSelectedStoreId: (id: string) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setModalTab: (modalTab: string) => void;
  recordsPageNumber: number;
  setRecordsPageNumber: (recordsPageNumber: number) => void;
  defaultEntriesPerPage: number;
  setDefaultEntriesPerPage: (defaultEntriesPer: number) => void;
  entityType: 'deployment' | 'group';
}

export function ViewDataByEntity({
  isLoadingData,
  isLoadingEntities,
  isRefetchingData,
  refetchSlimRecords,
  uuidSearchInput,
  setUuidSearchInput,
  onClickUserSearchSubmit,
  waevRecordTableData,
  handleShowUserDetailsClick,
  onClickGetFullRecord,
  setSelectedStoreId,
  setIsModalOpen,
  setModalTab,
  recordsPageNumber,
  setRecordsPageNumber,
  defaultEntriesPerPage,
  setDefaultEntriesPerPage,
  entityType,
}: ViewDataByEntityProps): JSX.Element {
  const { currentUser } = useContext(CurrentUserContext);
  const { isLoadingOrganization, selectedOrganization, selectedDeployment } =
    useContext(SelectedEntityContext);
  const { selectedEntity, setSelectedEntity } = useContext(RecordContext);
  const { setSelectedUserDetailsId, setSelectedRecord } = useContext(DeploymentRecordContext);

  const [isDataPretty, setIsDataPretty] = useLocalStorageByUser<boolean>(
    currentUser?.id,
    'IsRecordDataPretty',
    true
  );
  const [isDataEncrypted, setIsDataEncrypted] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  // TODO(MFB): This will need to be a prop eventually, and pull from group
  const selectedUUID = selectedDeployment?.attributes?.config?.user_field;
  const intl = useIntl();

  const leftHeader = (
    <>
      {isLoadingData ? (
        <MDBox minWidth="6vw" ml={10} className="FlashingLoaderContainer">
          <FlashingLoader />
        </MDBox>
      ) : (
        <MDBox sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}>
          <FancyCheckbox
            isSelected={isRefetchingData}
            onSelect={() => refetchSlimRecords()}
            isDisabled={isRefetchingData}
            icon={isRefetchingData ? 'hourglass_top' : 'loop'}
            tooltip={intl.formatMessage(messages.refreshData)}
            tooltipPlacement="top"
          />
          <FancyCheckbox
            isSelected={isDataPretty}
            onSelect={() => setIsDataPretty(!isDataPretty)}
            icon={isDataPretty ? 'view_column' : 'list'}
            tooltip={
              isDataPretty
                ? intl.formatMessage(messages.columnView)
                : intl.formatMessage(messages.rowView)
            }
            tooltipPlacement="top"
          />
          <FancyCheckbox
            isSelected={isDataEncrypted}
            onSelect={() => setIsDataEncrypted(!isDataEncrypted)}
            icon={isDataEncrypted ? 'lock' : 'lock_open'}
            tooltip={
              isDataEncrypted
                ? intl.formatMessage(messages.show) + ' ' + intl.formatMessage(messages.decrypted)
                : intl.formatMessage(messages.show) + ' ' + intl.formatMessage(messages.encrypted)
            }
            tooltipPlacement="top"
          />
          <MDTypography variant="caption" color="secondary" mr={1}>
            &nbsp;&nbsp;
            {`${intl.formatMessage(messages.showing)} ${
              isDataEncrypted
                ? intl.formatMessage(messages.encrypted)
                : intl.formatMessage(messages.decrypted)
            } ${intl.formatMessage(messages.data)}`}
          </MDTypography>
        </MDBox>
      )}
    </>
  );

  const userSearch = (
    <InputWithAction
      value={uuidSearchInput || ''}
      placeholder="User Search"
      onChange={setUuidSearchInput}
      onPrimaryClick={() => onClickUserSearchSubmit(true)}
      primaryTooltip="Search for User Value"
      disablePrimaryWhenEmpty
      buttonsOnLeft
      primaryIcon="search"
    />
  );

  const data = useMemo<any>(
    () =>
      isDataEncrypted
        ? waevEncryptedResponseToTableData(waevRecordTableData, isDataPretty)
        : waevResponseToTableData(
            waevRecordTableData,
            isDataPretty,
            handleShowUserDetailsClick,
            onClickGetFullRecord,
            setSelectedStoreId,
            setIsModalOpen,
            selectedUUID,
            intl,
            setModalTab,
            setSelectedUserDetailsId,
            setSelectedRecord
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isDataEncrypted,
      waevRecordTableData,
      isDataPretty,
      selectedOrganization,
      selectedEntity,
      isLoadingData,
    ]
  );

  const noDataText = isLoadingData ? (
    <MDBox
      alignSelf="center"
      sx={{ width: '95%' }}
      data-testid="organization-loading-status"
      py={3}
    >
      <FlashingLoader />
    </MDBox>
  ) : (
    <>
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={0.5}
        ml={-1.5}
        sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
      >
        <MDTypography variant="button" fontWeight="regular">
          <FormattedMessage
            id="view_data.data_by_entity.no_records"
            defaultMessage="No Records Found."
          />
        </MDTypography>
      </MDBox>
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={0.5}
        ml={-1.5}
        sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
      >
        <IconButton
          size="small"
          aria-label="save"
          color="info"
          onClick={() => refetchSlimRecords()}
        >
          <Icon fontSize="medium">loop</Icon>
        </IconButton>
      </MDBox>
    </>
  );

  useEffect(() => {
    isLoadingData && setIsFirstLoad(false);
  }, [isLoadingData]);

  return (
    <Card sx={{ paddingBottom: 3 }}>
      <Grid px={3} pt={3} lineHeight={1} container>
        <Grid item xs={7} md={7} pr={3}>
          <MDTypography variant="h5" fontWeight="medium">
            <FormattedMessage id="view_data.data_by_entity.title" defaultMessage="View Waev Data" />
          </MDTypography>
          <MDTypography variant="button" color="text">
            <FormattedMessage
              id="view_data.data_by_entity.description"
              defaultMessage="Enter an email address in the “User Search” field to find associated records."
            />
          </MDTypography>
        </Grid>

        {
          <Grid item xs={5} md={5}>
            {(entityType === 'deployment' && isLoadingOrganization) || isLoadingEntities ? (
              <MDBox
                alignSelf="center"
                sx={{ width: '100%' }}
                data-testid="organization-loading-status"
                pt={3}
              >
                <FlashingLoader />
              </MDBox>
            ) : (
              (entityType === 'group' || selectedOrganization) &&
              selectedEntity && (
                <MDBox
                  lineHeight={1}
                  flex={1}
                  textAlign="end"
                  sx={{ width: '100%' }}
                  display="flex"
                  flexDirection={'row'}
                  justifyContent="end"
                >
                  <FancyIconButton
                    color="info"
                    icon={'arrow_backward'}
                    onClick={() => setSelectedEntity(undefined)}
                    tooltip={'Back to Select'}
                    tooltipPlacement="top"
                  />
                  <Tooltip title="Deployment" placement="top">
                    <MDTypography variant="h5" fontWeight="medium" mt={2} mr={2}>
                      {selectedEntity?.attributes.name}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              )
            )}
          </Grid>
        }
      </Grid>
      {(entityType === 'group' || selectedOrganization) && (
        <DataTable
          table={data}
          rightHeader={userSearch}
          // onRowClick={(e: any, row: any) => {
          //   setSelectedStoreId(row.id);
          //   setIsModalOpen(true);
          // }}
          // canSearch
          leftHeader={leftHeader}
          pageNumber={recordsPageNumber}
          setPageNumber={setRecordsPageNumber}
          defaultEntriesPerPage={defaultEntriesPerPage}
          setDefaultEntriesPerPage={setDefaultEntriesPerPage}
          isLoading={(isLoadingData && isFirstLoad) || isRefetchingData}
          noDataText={noDataText}
          sx={{
            'thead>tr>th:nth-of-type(2)>div': { display: 'none' }, // This forces the hide of the column sort.
            'tbody>tr>td:nth-of-type(2)': { pr: 0, pl: 1 }, // This removes padding between search and the next element
            // 'tbody>tr>td:nth-of-type(3)': { pl: 0 }, // This removes padding between search and the next element
          }}
        />
      )}
    </Card>
  );
}
