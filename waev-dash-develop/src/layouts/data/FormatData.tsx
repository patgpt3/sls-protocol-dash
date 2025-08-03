import moment from 'moment';
import { FormattedMessage } from 'utils';
import { FancyIconButton, WordLoader, MDBox, MDTypography } from 'components';
import { Icon, IconButton, Link, Tooltip } from '@mui/material';
import { TableData, WaevMetaRecord, WaevTableRecord } from 'types';
import { uniqueKeysFromObjectArray, emptyCell, defineMessages } from 'utils';
import colors from 'assets/theme-dark/base/colors';
import React from 'react';
import { IntlShape } from 'react-intl/src/types';

export const waevResponseToTableData = (
  waevData: WaevTableRecord[],
  isPretty: boolean,
  handleShowUserDetailsClick: (isShow?: boolean) => void,
  onClickGetFullRecord: (id: string) => void,
  setSelectedStoreId: (id: string) => void,
  setIsModalOpen: (isModalOpen: boolean) => void,
  selectedUUID: string,
  intl: IntlShape,
  setModalTab: (modalTab: string) => void,
  setSelectedUserDetailsId: (id: string) => void,
  setSelectedRecord: (record: WaevTableRecord) => void
  // userIdFieldName: string
  // waevSlimData: RecordSlimAttributes[],
  // waevFullData: RecordFullAttributes[],
): TableData => {
  // Gets unique set of keys from array
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
      <FormattedMessage id="format_data.encrypted.text" defaultMessage="Encrypted" />
    </MDTypography>
  );
  const toolTipTitles = defineMessages({
    expandTooltip: {
      id: 'records.tooltip.expand',
      defaultMessage: 'Get Decrypted Record',
    },
    refetchTooltip: {
      id: 'records.tooltip.refetch',
      defaultMessage: 'Try Refetching',
    },
  });

  const { info, success, secondary, text } = colors;
  if (waevData && waevData.length > 0) {
    const waevFullData = waevData.map((datum) => datum?.fullRecord).filter((e) => e); // Removes any empty arrays;

    if (waevFullData && waevFullData.length > 0) {
      // Full Data
      userFieldColumns = uniqueKeysFromObjectArray(
        waevFullData && waevFullData.length
          ? waevFullData.map((datum) => datum?.attributes?.anon?.data)
          : []
      );

      userPrivateFieldColumns = uniqueKeysFromObjectArray(
        waevFullData.map((datum) => datum?.attributes?.pii?.data)
      );

      sharedFields = (userFieldColumns || []).filter((value) =>
        userPrivateFieldColumns.includes(value)
      );

      isUuidPrivate = userPrivateFieldColumns.includes(selectedUUID);

      nonUuidFieldColumns = userFieldColumns.filter((colName) => colName !== selectedUUID);
      nonUuidPrivateFieldColumns = userPrivateFieldColumns.filter(
        (colName) => colName !== selectedUUID
      );

      columns = isPretty
        ? [
            {
              Header: '',
              accessor: 'waev-user-id',
              width: '5%',
              disableSort: true,
            },
            {
              Header: 'Blockchain ID',
              accessor: 'waev-blockchain-id',
              width: '10%',
            },
            {
              Header: 'Waev Connector',
              accessor: 'waev-uid',
              width: '10%',
            },
            {
              Header: 'Private Fields',
              accessor: 'waev-private-fields',
              color: success.main,
            },
            {
              Header: 'Anon Fields',
              accessor: 'waev-fields',
              color: info.main,
            },
            // {
            //   Header: 'Opt In Status',
            //   accessor: 'waev-opt-in-status',
            // },
            {
              Header: 'Date / Time',
              accessor: 'waev-timestamp',
            },
          ]
        : [
            {
              Header: '',
              accessor: 'waev-user-id',
              width: '5%',
              disableSort: true,
            },
            {
              Header: 'Blockchain ID',
              accessor: 'waev-blockchain-id',
              width: '10%',
            },
            {
              Header: 'Waev Connector',
              accessor: 'waev-uid',
              width: '10%',
            },
            {
              Header: <MDBox sx={{ color: secondary.main }}>{`${selectedUUID} *`}</MDBox>,
              private: !!isUuidPrivate,
              accessor: 'waev-private-fields',
              color: success.main,
              toolTipElement: isUuidPrivate ? (
                <React.Fragment>
                  {'User Field ('}
                  <Icon fontSize="inherit">lock</Icon>
                  {' Private)'}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {' User Field ('}
                  <Icon fontSize="inherit">lock_open</Icon>
                  {' Public)'}
                </React.Fragment>
              ),
              tooltipPlacement: 'top',
            },

            ...nonUuidPrivateFieldColumns.map((colName) => {
              return {
                Header: colName,
                private: true,
                accessor: colName,
                color: success.main,
                toolTipElement: (
                  <React.Fragment>
                    <Icon fontSize="inherit">lock</Icon>
                    {' Private Field'}
                  </React.Fragment>
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
                  <React.Fragment>
                    <Icon fontSize="inherit">lock_open</Icon>
                    {' Public Field'}
                  </React.Fragment>
                ),
                tooltipPlacement: 'top',
              };
            }),
            {
              Header: 'Date / Time',
              accessor: 'waev-timestamp',
            },
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

    rows = waevData.map((data) => {
      const solanaBlockchainLink = (
        <MDBox sx={{ maxWidth: isPretty ? '10vw' : 'unset', minWidth: 'max-content' }}>
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
              // color="info"
            >
              None
            </MDTypography>
          )}
        </MDBox>
      );
      const gnosisBlockchainLink = (
        <MDBox sx={{ maxWidth: isPretty ? '10vw' : 'unset', minWidth: 'max-content' }}>
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
              // color="info"
            >
              None
            </MDTypography>
          )}
        </MDBox>
      );

      if (data?.fullRecord) {
        // Full
        // const flags = padWithZeros(data.fullData.record?.flags || 0, 3);
        // // const optInEmail = flags.slice(-3, -2) !== '0';
        // const optInEmail = flags.slice(-2, -1) !== '0';
        // const optInPhone = flags.slice(-1) !== '0';
        const dataMap: WaevMetaRecord = {
          // 'waev-anon': JSON.stringify(data.attributes?.anon.data),
          'waev-blockchain-id': data?.storeId ? (
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
          'waev-timestamp': moment(data?.fullRecord?.attributes?.timestamp * 1000).format(
            'ddd, MMM D [@] h:mm a'
          ),
        };

        if (isPretty) {
          const privateValuesData = (
            <MDBox display="grid">
              {/* {Object.keys(data.eventData?.otherData?.meta).map((eventKey, i) => {
              return (
                <MDBox key={eventKey} display="flex" pr={2}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                    {eventKey}: &nbsp;
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    &nbsp;{data.eventData?.otherData?.meta[eventKey]}
                  </MDTypography>
                </MDBox>
              );
            })} */}

              {(!data?.fullRecord?.attributes?.pii?.data ||
                Object.keys(data?.fullRecord?.attributes?.pii?.data).length === 0) &&
                emptyCell}

              {Object.keys(data?.fullRecord?.attributes?.pii?.data || []).map((eventKey, i) => {
                return (
                  <MDBox key={eventKey} display="flex" pr={2}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                      {eventKey}: &nbsp;
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      opacity={data?.fullRecord?.attributes?.pii?.data[eventKey] ? 1 : 0.5}
                    >
                      &nbsp;
                      {data?.fullRecord?.attributes?.pii?.data[eventKey] ?? 'No value'}
                    </MDTypography>
                  </MDBox>
                );
              })}
            </MDBox>
          );

          const valuesData = (
            <MDBox display="grid">
              {(!data.fullRecord?.attributes?.anon?.data ||
                Object.keys(data.fullRecord?.attributes?.anon?.data).length === 0) &&
                emptyCell}

              {Object.keys(data.fullRecord?.attributes?.anon?.data || []).map((eventKey, i) => {
                return (
                  <MDBox key={eventKey} display="flex" pr={2}>
                    <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                      {eventKey}: &nbsp;
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      opacity={data?.fullRecord?.attributes?.anon?.data[eventKey] ? 1 : 0.5}
                    >
                      &nbsp;
                      {data?.fullRecord?.attributes?.anon?.data[eventKey] ?? 'No value'}
                    </MDTypography>
                  </MDBox>
                );
              })}
            </MDBox>
          );
          dataMap['waev-private-fields'] = privateValuesData;
          dataMap['waev-fields'] = valuesData;
          dataMap['waev-uid'] = `${data?.fullRecord?.attributes?.uid?.slice(0, 16)}...`;
        } else {
          // Is Not Pretty
          userPrivateFieldColumns.forEach((slug) => {
            //@ts-ignore
            dataMap[slug] = data?.fullRecord?.attributes?.pii?.data?.[slug] ?? emptyCell;
          });
          userFieldColumns.forEach((slug) => {
            if (sharedFields.includes(slug)) {
              dataMap[`${slug}*`] = data?.fullRecord?.attributes?.anon?.data?.[slug] ?? emptyCell;
            } else {
              dataMap[slug] = data?.fullRecord?.attributes?.anon?.data?.[slug] ?? emptyCell;
            }
          });
          dataMap['waev-private-fields'] = isUuidPrivate
            ? data?.fullRecord?.attributes?.pii?.data
              ? data?.fullRecord?.attributes?.pii?.data?.[selectedUUID] ?? emptyCell
              : encryptedText
            : data?.fullRecord?.attributes?.anon?.data
            ? data?.fullRecord?.attributes?.anon?.data?.[selectedUUID] ?? emptyCell
            : encryptedText;
        }
        let selectedUuidValue: any = isUuidPrivate
          ? data?.fullRecord?.attributes?.pii?.data?.[selectedUUID]
          : data?.fullRecord?.attributes?.anon?.data?.[selectedUUID];

        dataMap['waev-uid'] = `${data?.fullRecord?.attributes?.uid?.slice(0, 16)}...`;
        dataMap['waev-user-id'] = (
          <>
            <MDBox sx={{ display: 'flex', flexDirection: 'row' }}>
              <FancyIconButton
                color="info"
                size={'small'}
                iconSize={'small'}
                icon={'newspaper'}
                tooltip={'Record Details'}
                tooltipPlacement={'top'}
                onClick={() => {
                  setSelectedRecord(data);
                  setSelectedStoreId(data?.storeId);
                  handleShowUserDetailsClick(false);
                  setModalTab('selected_record');
                  setIsModalOpen(true);
                  setSelectedUserDetailsId(selectedUuidValue);
                }}
              />

              {(isUuidPrivate
                ? data?.fullRecord?.attributes?.pii?.data?.[selectedUUID]
                : data?.fullRecord?.attributes?.anon?.data?.[selectedUUID]) && (
                <>
                  <FancyIconButton
                    color="info"
                    size={'small'}
                    iconSize={'small'}
                    icon={'person'}
                    tooltip={'User Details'}
                    tooltipPlacement={'top'}
                    onClick={() => {
                      setSelectedRecord(data);
                      setSelectedStoreId(data?.storeId);
                      handleShowUserDetailsClick(true);
                      setModalTab('user_details');
                      setIsModalOpen(true);
                      setSelectedUserDetailsId(selectedUuidValue);
                    }}
                  />
                  <FancyIconButton
                    color="info"
                    size={'small'}
                    iconSize={'small'}
                    icon={'history'}
                    tooltip={'User History'}
                    tooltipPlacement={'top'}
                    onClick={() => {
                      setSelectedRecord(data);
                      setSelectedStoreId(data?.storeId);
                      handleShowUserDetailsClick(false);
                      setModalTab('user_history');
                      setIsModalOpen(true);
                      setSelectedUserDetailsId(selectedUuidValue);
                    }}
                  />
                </>
              )}
            </MDBox>
          </>
        );

        return dataMap;
      } else {
        // Slim Data
        const userButtons =
          data?.isLoadingFull && !data?.errorFull ? (
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
              sx={{ maxWidth: isPretty ? '10vw' : 'unset' }}
            >
              {data?.errorFull ? (
                data?.errorFull.error?.message === 'Failed to fetch' ? (
                  <MDBox>
                    <MDTypography
                      color="error"
                      variant="button"
                      textTransform="capitalize"
                      verticalAlign="middle"
                      sx={{ fontWeight: 500 }}
                    >
                      <FormattedMessage
                        id="format_data.failedFetch.text"
                        defaultMessage="Failed to Fetch"
                      />
                    </MDTypography>
                    <Tooltip
                      title={intl.formatMessage(toolTipTitles.refetchTooltip)}
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
                        id="format_data.denied.text"
                        defaultMessage="Access Denied"
                      />
                    </MDTypography>
                  </>
                )
              ) : (
                <Tooltip title={intl.formatMessage(toolTipTitles.expandTooltip)} placement={'top'}>
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
          'waev-private-fields': userButtons,
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

export const waevEncryptedResponseToTableData = (
  // waevSlimData: RecordSlimAttributes[],
  // waevFullData: RecordFullAttributes[],
  waevData: WaevTableRecord[],
  isPretty: boolean
): TableData => {
  // Gets unique set of keys from array
  const { text } = colors;

  const columns = [
    {
      Header: 'Blockchain ID',
      accessor: 'waev-blockchain-id',
    },
    {
      Header: 'User',
      accessor: 'waev-user-id',
      width: '10%',
    },
    {
      Header: 'Data',
      accessor: 'waev-data',
    },
    // {
    //   Header: 'Opt In Status',
    //   accessor: 'waev-opt-in-status',
    // },
    {
      Header: 'Date / Time',
      accessor: 'waev-timestamp',
    },
  ];
  let rows: any[] = [];

  const waevSlimData = (waevData || []).filter((e) => e);

  const simpleRows: any =
    waevSlimData && waevSlimData.length
      ? (
          waevSlimData.map((data) => {
            const solanaBlockchainLink = (
              <MDBox sx={{ maxWidth: isPretty ? '10vw' : 'unset', minWidth: 'max-content' }}>
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
                    // color="info"
                  >
                    None
                  </MDTypography>
                )}
              </MDBox>
            );
            const gnosisBlockchainLink = (
              <MDBox sx={{ maxWidth: isPretty ? '10vw' : 'unset', minWidth: 'max-content' }}>
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
                    // color="info"
                  >
                    None
                  </MDTypography>
                )}
              </MDBox>
            );

            const encryptedText = (
              <MDTypography
                color="error"
                variant="button"
                fontWeight="bold"
                textTransform="capitalize"
              >
                Encrypted
              </MDTypography>
            );

            const encryptedData = (
              <MDBox sx={{ maxWidth: '20vw' }}>
                <MDTypography
                  color="error"
                  variant="button"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  {isPretty
                    ? data?.fullRecord?.attributes?.store_id
                    : `${data?.fullRecord?.attributes?.store_id?.slice(0, 8)}...`}
                </MDTypography>
              </MDBox>
            );

            const dataMap: WaevMetaRecord = {
              'waev-blockchain-id': data?.fullRecord?.attributes?.store_id ? (
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
              'waev-uuid': encryptedText || emptyCell,
              'waev-data': data?.fullRecord?.attributes?.store_id ? encryptedData : emptyCell,
              // 'waev-opt-in-status': encryptedText || emptyCell,
              'waev-timestamp': encryptedText || emptyCell,
            };

            return dataMap;
          }) || []
        ).filter((e) => e)
      : [];

  rows = rows.concat(simpleRows);

  return { columns, rows };
};
