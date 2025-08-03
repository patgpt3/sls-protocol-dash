import { useContext, Fragment } from 'react';
import { Grid, Icon, Link, Tooltip, IconButton } from '@mui/material';
import { DataTable, FlashingLoader, MDBox, MDTypography, WordLoader } from 'components';
import { DeploymentUserRecordsContext, SelectedEntityContext } from 'contexts';
import {
  uniqueKeysFromObjectArray,
  emptyCell,
  defineMessages,
  useIntl,
  FormattedMessage,
} from 'utils';
import moment from 'moment';
import colors from 'assets/theme-dark/base/colors';
import { WaevTableRecord, WaevMetaRecord } from 'types';

const messages = defineMessages({
  expandTooltip: {
    id: 'user.records.tooltip.expand',
    defaultMessage: 'Get Decrypted Record',
  },
  refetchTooltip: {
    id: 'user.records.tooltip.refetch',
    defaultMessage: 'Try Refetching',
  },
  none: {
    id: 'user.records.none',
    defaultMessage: 'None',
  },
});

interface ViewUserRecordsProps {
  userRecordsData: WaevTableRecord[];
}

export function ViewUserRecords({ userRecordsData }: ViewUserRecordsProps): JSX.Element {
  const intl = useIntl();
  const { info, success, text } = colors;
  const {
    isLoadingData,
    isRefetchingData,
    recordsPageNumber,
    setRecordsPageNumber,
    defaultEntriesPerPage,
    setDefaultEntriesPerPage,
    onClickGetFullRecord,
  } = useContext(DeploymentUserRecordsContext);
  const { selectedDeployment } = useContext(SelectedEntityContext);

  const uuidField = selectedDeployment?.attributes?.config?.user_field;

  let columns: any[] = [];
  let rows: any[] = [];
  let userFieldColumns: string[] = [];
  let userPrivateFieldColumns: string[] = [];
  let nonUuidFieldColumns: string[] = [];
  let nonUuidPrivateFieldColumns: string[] = [];
  let sharedFields: string[] = [];
  let isUuidPrivate: boolean = false;

  const encryptedText = (
    <MDTypography color="error" variant="button" fontWeight="bold" textTransform="capitalize">
      <FormattedMessage id="user.records.encrypted.text" defaultMessage="Encrypted" />
    </MDTypography>
  );

  const noDataText =
    isLoadingData || isRefetchingData ? (
      <MDBox
        alignSelf="center"
        sx={{ width: '95%' }}
        data-testid="organization-loading-status"
        py={3}
      >
        <FlashingLoader />
      </MDBox>
    ) : null;

  const renderTableData = () => {
    if (userRecordsData && userRecordsData.length > 0) {
      const waevFullData = userRecordsData.map((datum) => datum?.fullRecord).filter((e) => e); // Removes any empty arrays;

      if (waevFullData && waevFullData.length > 0) {
        // Full Data
        userFieldColumns = uniqueKeysFromObjectArray(
          waevFullData && waevFullData.length
            ? waevFullData.map((datum) => datum.attributes?.anon?.data)
            : []
        );

        userPrivateFieldColumns = uniqueKeysFromObjectArray(
          waevFullData.map((datum) => datum.attributes?.pii?.data)
        );

        sharedFields = (userFieldColumns || []).filter((value) =>
          userPrivateFieldColumns.includes(value)
        );

        isUuidPrivate = userPrivateFieldColumns.includes(uuidField);

        nonUuidFieldColumns = userFieldColumns.filter((colName) => colName !== uuidField);
        nonUuidPrivateFieldColumns = userPrivateFieldColumns.filter(
          (colName) => colName !== uuidField
        );

        columns = [
          {
            Header: 'Date / Time',
            accessor: 'waev-timestamp',
          },
          {
            Header: 'Blockchain ID',
            accessor: 'waev-blockchain-id',
            width: '10%',
          },

          ...nonUuidPrivateFieldColumns.map((colName) => {
            return {
              Header: colName,
              private: true,
              accessor: colName,
              color: success.main,
              toolTipElement: (
                <Fragment>
                  <Icon fontSize="inherit">lock</Icon>
                  {' Private Field'}
                </Fragment>
              ),
              tooltipPlacement: 'top',
            };
          }),

          ...nonUuidFieldColumns.map((colName) => {
            return {
              Header: sharedFields.includes(colName) ? `${colName}*` : colName,
              accessor: sharedFields.includes(colName) ? `${colName}*` : colName,
              color: info.main,
              id: sharedFields.includes(colName) ? `${colName}*` : colName,
              toolTipElement: (
                <Fragment>
                  <Icon fontSize="inherit">lock_open</Icon>
                  {' Public Field'}
                </Fragment>
              ),
              tooltipPlacement: 'top',
            };
          }),
        ];
      } else {
        // Slim Data (No Full Data)
        columns = [
          {
            Header: 'Blockchain ID',
            accessor: 'waev-blockchain-id',
            width: '10%',
          },
          {
            Header: '',
            accessor: 'waev-private-fields',
            width: '10%',
            disableSort: true,
          },
        ];
      }

      rows = userRecordsData.map((data) => {
        const solanaBlockchainLink = (
          <MDBox sx={{ maxWidth: 'unset', minWidth: 'max-content' }}>
            {data?.transactions?.announce_tx ? (
              <Link
                target="_blank"
                href={`https://explorer.solana.com/tx/${data?.transactions?.announce_tx}?cluster=devnet`}
              >
                <MDTypography
                  component="span"
                  variant="button"
                  fontWeight="regular"
                  textTransform="capitalize"
                  color="info"
                >
                  {`${data?.transactions?.announce_tx?.slice(0, 8)}...`}
                </MDTypography>
              </Link>
            ) : (
              <MDTypography
                component="span"
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
              >
                {intl.formatMessage(messages.none)}
              </MDTypography>
            )}
          </MDBox>
        );
        const gnosisBlockchainLink = (
          <MDBox sx={{ maxWidth: 'unset', minWidth: 'max-content' }}>
            {data?.transactions?.flags_update_transaction_id ? (
              <Link
                target="_blank"
                href={`https://blockscout.com/xdai/mainnet/tx/${data?.transactions?.flags_update_transaction_id}`}
              >
                <MDTypography
                  component="span"
                  variant="button"
                  fontWeight="regular"
                  textTransform="capitalize"
                  color="info"
                >
                  {`${data?.transactions?.flags_update_transaction_id?.slice(0, 8)}...`}
                </MDTypography>
              </Link>
            ) : (
              <MDTypography
                component="span"
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
              >
                {intl.formatMessage(messages.none)}
              </MDTypography>
            )}
          </MDBox>
        );

        if (data?.fullRecord) {
          const dataMap: WaevMetaRecord = {
            'waev-blockchain-id': data.storeId ? (
              <>
                <MDBox
                  display="flex"
                  component="span"
                  flexDirection={'row'}
                  sx={{
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: text.main,
                    mr: 3,
                    pb: '3px',
                    fontWeight: 'regular',
                  }}
                >
                  {'Solana: '}
                  {solanaBlockchainLink}
                </MDBox>
                <MDBox
                  display="flex"
                  component="span"
                  flexDirection={'row'}
                  sx={{
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: text.main,
                    mr: 3,
                    fontWeight: 'regular',
                  }}
                >
                  {'Gnosis: '}
                  {gnosisBlockchainLink}
                </MDBox>
              </>
            ) : (
              emptyCell
            ),
            'waev-timestamp': moment(data.fullRecord?.attributes.timestamp * 1000).format(
              'ddd, MMM D [@] h:mm a'
            ),
          };

          userPrivateFieldColumns.forEach((slug) => {
            //@ts-ignore
            dataMap[slug] = data.fullRecord?.attributes?.pii?.data?.[slug] ?? emptyCell;
          });
          userFieldColumns.forEach((slug) => {
            if (sharedFields.includes(slug)) {
              dataMap[`${slug}*`] = data.fullRecord?.attributes?.anon?.data?.[slug] ?? emptyCell;
            } else {
              dataMap[slug] = data.fullRecord?.attributes?.anon?.data?.[slug] ?? emptyCell;
            }
          });
          dataMap['waev-private-fields'] = isUuidPrivate
            ? data.fullRecord?.attributes?.pii?.data
              ? data.fullRecord?.attributes?.pii?.data?.[uuidField]
              : encryptedText
            : data.fullRecord?.attributes?.anon?.data
            ? data.fullRecord?.attributes?.anon?.data?.[uuidField]
            : encryptedText;

          return dataMap;
        } else {
          // Slim Data
          const userButtons =
            data.isLoadingFull && !data.errorFull ? (
              <MDBox minWidth="5vw" className="FlashingLoaderContainer">
                <WordLoader />
              </MDBox>
            ) : (
              <MDTypography
                component="span"
                variant="button"
                fontWeight="regular"
                textTransform="capitalize"
                color="default"
                sx={{ maxWidth: 'unset' }}
              >
                {data.errorFull ? (
                  data.errorFull.error?.message === 'Failed to fetch' ? (
                    <MDBox>
                      <MDTypography
                        color="error"
                        variant="button"
                        textTransform="capitalize"
                        verticalAlign="middle"
                        sx={{ fontWeight: 500 }}
                      >
                        <FormattedMessage
                          id="format.data.failedFetch.text"
                          defaultMessage="Failed to Fetch"
                        />
                      </MDTypography>
                      <Tooltip
                        title={intl.formatMessage(messages.refetchTooltip)}
                        placement={'top'}
                      >
                        <IconButton
                          size="small"
                          aria-label="save"
                          color="info"
                          // disabled={!deploymentNameInput}
                          onClick={() => onClickGetFullRecord(data?.storeId)}
                        >
                          <Icon fontSize="medium">replay</Icon>
                        </IconButton>
                      </Tooltip>
                    </MDBox>
                  ) : (
                    <>
                      <MDTypography
                        color="error"
                        variant="button"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        <FormattedMessage
                          id="format.data.denied.text"
                          defaultMessage="Access Denied"
                        />
                      </MDTypography>
                    </>
                  )
                ) : (
                  <Tooltip title={intl.formatMessage(messages.expandTooltip)} placement={'top'}>
                    <IconButton
                      size="small"
                      aria-label="save"
                      color="info"
                      // disabled={!deploymentNameInput}
                      onClick={() => onClickGetFullRecord(data?.storeId)}
                    >
                      <Icon fontSize="medium">double_arrow</Icon>
                    </IconButton>
                  </Tooltip>
                )}
              </MDTypography>
            );

          const dataMap: WaevMetaRecord = {
            'waev-timestamp': userButtons,
            'waev-blockchain-id': (
              <>
                <MDBox
                  display="flex"
                  component="span"
                  flexDirection={'row'}
                  sx={{
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: text.main,
                    mr: 3,
                    pb: '3px',
                    fontWeight: 'regular',
                  }}
                >
                  {'Solana: '}
                  {solanaBlockchainLink}
                </MDBox>
                <MDBox
                  display="flex"
                  component="span"
                  flexDirection={'row'}
                  sx={{
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: text.main,
                    mr: 3,
                    fontWeight: 'regular',
                  }}
                >
                  {'Gnosis: '}
                  {gnosisBlockchainLink}
                </MDBox>
              </>
            ),
          };
          return dataMap;
        }
      });
    }

    return { columns, rows };
  };

  const tableData = renderTableData();

  return (
    <Grid item xs={12} mt={4}>
      {
        <DataTable
          table={tableData}
          pageNumber={recordsPageNumber}
          setPageNumber={setRecordsPageNumber}
          defaultEntriesPerPage={defaultEntriesPerPage}
          setDefaultEntriesPerPage={setDefaultEntriesPerPage}
          isLoading={isLoadingData || isRefetchingData}
          noDataText={noDataText}
          sx={{
            'tbody>tr>td:nth-of-type(2)': { pr: 0, pl: 1 },
          }}
        />
      }
    </Grid>
  );
}
