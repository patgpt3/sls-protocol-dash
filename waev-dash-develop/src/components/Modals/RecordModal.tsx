import {
  Card,
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
  Icon,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Tab,
  Tabs,
} from '@mui/material';
import {
  MDBox,
  MDTypography,
  WaevPlaceholderIcon,
  FancyIconButton,
  FlashingLoader,
  WaevAvatar,
} from 'components';
import { ViewUserRecords } from 'layouts';
import moment from 'moment';
import colors from 'assets/theme/base/colors';
import { WaevTableRecord } from 'types';
import { DeploymentRecordContext, DeploymentUserRecordsContext } from 'contexts';
import { useContext, useEffect, useState } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  tab1: {
    id: 'view_data.record_modal.tab1',
    defaultMessage: 'Selected Record',
  },
  tab2: {
    id: 'view_data.record_modal.tab2',
    defaultMessage: 'User Details',
  },
  tab3: {
    id: 'view_data.record_modal.tab3',
    defaultMessage: 'User History',
  },
  noOptIns: {
    id: 'view_data.record_modal.no_opt_ins',
    defaultMessage: 'No Opt Ins',
  },
  noOptOuts: {
    id: 'view_data.record_modal.no_opt_outs',
    defaultMessage: 'No Opt Outs',
  },
  blockchainLinks: {
    id: 'view_data.record_modal.blockchain_links',
    defaultMessage: 'Blockchain Links',
  },
  data: {
    id: 'view_data.record_modal.data',
    defaultMessage: 'Data',
  },
  pii: {
    id: 'view_data.record_modal.pii',
    defaultMessage: 'PII',
  },
  anonymous_data: {
    id: 'view_data.record_modal.anonymous_data',
    defaultMessage: 'Anonymous Data',
  },
  meta_data: {
    id: 'view_data.record_modal.meta_data',
    defaultMessage: 'Meta Data',
  },
  waev_id: {
    id: 'view_data.record_modal.waev_connector',
    defaultMessage: 'Waev Connector',
  },
});

interface RecordModalProps {
  isOpen?: boolean;
  setIsOpen?: (value: any) => void;
  waevData?: WaevTableRecord[];
  modalTab: string;
  setModalTab: (value: string) => void;
  onCloseClick: () => void;
}
interface ListedItem {
  key: string;
  value: boolean;
}

export function RecordModal({
  isOpen,
  setIsOpen,
  waevData,
  modalTab,
  setModalTab,
  onCloseClick,
}: RecordModalProps) {
  const intl = useIntl();
  const { white, info, dark } = colors;

  const handleClose = () => {
    setIsOpen(false);
    onCloseClick();
  };

  const { dataGetUserDetails, isLoadingGetUserDetails, selectedRecord, selectedUserDetailsId } =
    useContext(DeploymentRecordContext);

  const { userRecordsData, isLoadingData, isRefetchingData } = useContext(
    DeploymentUserRecordsContext
  );

  const [optInsAndOuts, setOptInsAndOuts] = useState<{ optIns: string[]; optOuts: string[] }>({
    optIns: [],
    optOuts: [],
  });

  const waevTableRecord = waevData && waevData.length > 0 && waevData.filter((e) => e);

  const listed =
    modalTab === 'user_details'
      ? Object.keys(dataGetUserDetails?.attributes?.data.anon?.data || {})?.reduce(
          (acc: ListedItem[], col) => {
            if (dataGetUserDetails?.attributes?.data.anon.data[col] !== null) {
              acc.push({
                key: col,
                value: dataGetUserDetails?.attributes?.data.anon.data[col],
              } as ListedItem);
            }
            return acc;
          },
          []
        )
      : waevTableRecord &&
        Object.keys(selectedRecord?.fullRecord?.attributes?.anon?.data || {})?.reduce(
          (acc: ListedItem[], col) => {
            if (selectedRecord?.fullRecord?.attributes?.anon?.data[col] !== null) {
              acc.push({
                key: col,
                value: selectedRecord?.fullRecord?.attributes?.anon?.data[col],
              } as unknown as ListedItem);
            }
            return acc;
          },
          []
        );
  const metaListed =
    waevTableRecord &&
    Object.keys(selectedRecord?.fullRecord?.attributes?.meta?.data || {})?.reduce(
      (acc: ListedItem[], col) => {
        if (selectedRecord?.fullRecord?.attributes?.meta?.data[col] !== null) {
          acc.push({
            key: col,
            value: selectedRecord?.fullRecord?.attributes?.meta?.data[col],
          } as unknown as ListedItem);
        }
        return acc;
      },
      []
    );

  const privateListed =
    modalTab === 'user_details'
      ? Object.keys(dataGetUserDetails?.attributes.data.pii?.data || {})?.reduce(
          (acc: ListedItem[], col) => {
            if (dataGetUserDetails?.attributes.data.pii.data[col] !== null) {
              acc.push({
                key: col,
                value: dataGetUserDetails?.attributes.data.pii.data[col],
              } as ListedItem);
            }
            return acc;
          },
          []
        )
      : waevTableRecord &&
        Object.keys(selectedRecord?.fullRecord?.attributes?.pii?.data || {})?.reduce(
          (acc: ListedItem[], col) => {
            if (selectedRecord?.fullRecord?.attributes?.pii?.data[col] !== null) {
              acc.push({
                key: col,
                value: selectedRecord?.fullRecord?.attributes?.pii?.data[col],
              } as unknown as ListedItem);
            }
            return acc;
          },
          []
        );

  const isThereAnyValueListed = listed?.length && listed.some((item) => item.value);
  const isThereAnyMetaValueListed = metaListed?.length && metaListed.some((item) => item.value);
  const isThereAnyValuePrivateListed =
    privateListed?.length && privateListed.some((item) => item.value);
  const isThereAnyOptIns =
    dataGetUserDetails &&
    Object.values(dataGetUserDetails?.attributes?.flags).some((element) => element === true);
  const isThereAnyOptOuts =
    dataGetUserDetails &&
    Object.values(dataGetUserDetails?.attributes?.flags).some((element) => element === false);

  const optInsToArray = (flags: Record<string, boolean>) => {
    return Object.keys(flags || {}).reduce(
      (acc, flag) => {
        if (flags[flag]) {
          acc.optIns.push(flag);
        } else {
          acc.optOuts.push(flag);
        }
        return acc;
      },
      { optIns: [], optOuts: [] }
    );
  };

  useEffect(() => {
    if (dataGetUserDetails && dataGetUserDetails?.attributes.flags) {
      setOptInsAndOuts(optInsToArray(dataGetUserDetails?.attributes.flags));
    }
  }, [dataGetUserDetails]);

  const optInTableBody = () => {
    return new Array(Math.max(optInsAndOuts.optIns.length, optInsAndOuts.optOuts.length))
      .fill('')
      .map((_, i) => (
        <TableRow
          key={`Opt-In-Out-${i}`}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell
            sx={{ color: white.main, whiteSpace: 'pre', opacity: isThereAnyOptIns ? '1' : '0.5' }}
            component="th"
            scope="row"
          >
            {isThereAnyOptIns ? (
              optInsAndOuts.optIns[i] ? (
                <>
                  <Icon color="success" sx={{ verticalAlign: 'middle' }}>
                    check_circle
                  </Icon>
                  {' ' + optInsAndOuts.optIns[i]}
                </>
              ) : (
                ''
              )
            ) : i === 0 ? (
              <>{intl.formatMessage(messages.noOptIns)}</>
            ) : (
              ''
            )}{' '}
          </TableCell>
          <TableCell
            sx={{ color: white.main, whiteSpace: 'pre', opacity: isThereAnyOptOuts ? '1' : '0.5' }}
            align="left"
          >
            {isThereAnyOptOuts ? (
              optInsAndOuts.optOuts[i] ? (
                <>
                  <Icon color="error" sx={{ verticalAlign: 'middle' }}>
                    cancel
                  </Icon>
                  {' ' + optInsAndOuts.optOuts[i]}
                </>
              ) : (
                ''
              )
            ) : i === 0 ? (
              <>{intl.formatMessage(messages.noOptOuts)}</>
            ) : (
              ''
            )}
          </TableCell>
        </TableRow>
      ));
  };

  const gnosisBlockchainLink = (
    <Link
      sx={{ ml: 1 }}
      target="_blank"
      textOverflow="ellipsis"
      overflow="hidden"
      color="#1A73E8"
      href={`https://blockscout.com/xdai/mainnet/tx/${
        waevTableRecord && selectedRecord?.transactions?.flags_update_transaction_id
      }`}
    >
      <MDTypography
        component="span"
        variant="button"
        fontWeight="regular"
        color="info"
        whiteSpace="nowrap"
      >
        {waevTableRecord && selectedRecord?.transactions?.flags_update_transaction_id}
      </MDTypography>
    </Link>
  );

  const solanaBlockchainLink = (
    <Link
      sx={{ ml: 1 }}
      target="_blank"
      textOverflow="ellipsis"
      overflow="hidden"
      color="#1A73E8"
      href={`https://explorer.solana.com/tx/${
        waevTableRecord && selectedRecord?.transactions?.announce_tx
      }?cluster=devnet`}
    >
      <MDTypography
        component="span"
        variant="button"
        fontWeight="regular"
        color="info"
        whiteSpace="nowrap"
      >
        {waevTableRecord && selectedRecord?.transactions?.announce_tx}
      </MDTypography>
    </Link>
  );

  const handleSetModalTab = (event: React.SyntheticEvent, value: string) => {
    setModalTab(value);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth={modalTab === 'user_history' ? 'xl' : 'md'}
      sx={{
        '.MuiDialog-paper': {
          backgroundColor: 'transparent !important',
          paddingTop: '20px',
          marginTop: '30px',
          boxShadow: '0',
          '&::-webkit-scrollbar': {
            display: 'none' /* hid scroll bar for Chrome and Safari */,
          },
          '&': {
            msOverflowStyle: 'none' /* IE and Edge */,
            scrollbarWidth: 'none' /* Firefox */,
          },
        },
      }}
    >
      <MDBox sx={{ justifyContent: 'flex-end', display: 'flex' }}>
        <IconButton
          size="small"
          disableRipple
          onClick={handleClose}
          sx={{
            mb: '-37px',
            zIndex: 1500,
          }}
        >
          {/* <MDBox
            component="button"
            sx={{
              backgroundColor: 'transparent !important',
              border: 'none !important',
            }}
          > */}
          {/* <Icon
            fontSize={'medium'}
            sx={{
              color: 'transparent !important',
              '&:hover, &:focus': {
                color: `${info.main} !important`,
              },
            }}
          >
            close
          </Icon> */}
          {/* </MDBox> */}
        </IconButton>
      </MDBox>
      <Card>
        <MDBox p={2}>
          <MDBox display="flex" alignItems="center">
            <WaevPlaceholderIcon
              alt="profile-image"
              size="xl"
              bgColor={'dark'}
              variant="rounded"
              gradient="info"
              width="80%"
              height="80%"
              sx={{
                mt: -6,
                // @ts-ignore
                borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
              }}
            />
            <MDBox ml={2} mt={-1} lineHeight={0}>
              <MDTypography variant="h5" fontWeight="bold" mt={2}>
                {modalTab === 'user_details' ? (
                  <FormattedMessage
                    id="view_data.record_modal.current_data"
                    defaultMessage="User's Current Data"
                  />
                ) : (
                  <FormattedMessage
                    id="view_data.record_modal.selected_record"
                    defaultMessage="Selected Record"
                  />
                )}
              </MDTypography>
              <MDTypography variant="h6" fontWeight="medium" component="span" color="info">
                {selectedUserDetailsId || ''}
              </MDTypography>
            </MDBox>

            <MDBox sx={{ ml: 'auto', mr: 2 }}>
              {isLoadingGetUserDetails ? (
                <MDBox sx={{ ml: 'auto', mr: 2, minWidth: '50px' }}>
                  <FlashingLoader />
                </MDBox>
              ) : (
                <FancyIconButton
                  color="info"
                  // icon="search"
                  icon="close"
                  onClick={onCloseClick}
                />
              )}
            </MDBox>
          </MDBox>

          {/* <Grid container spacing={3} alignItems="left" px={2} pt={3}></Grid> */}

          <Divider />

          {selectedUserDetailsId && (
            <Grid item xs={12} my={2} mx={3}>
              <Tabs
                orientation="horizontal"
                value={modalTab}
                onChange={handleSetModalTab}
                sx={{ bgcolor: dark.main }}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: info.main,
                  },
                }}
              >
                <Tab
                  label={intl.formatMessage(messages.tab1)}
                  value={'selected_record'}
                  sx={{ px: 1.5 }}
                />
                <Tab
                  label={intl.formatMessage(messages.tab2)}
                  value={'user_details'}
                  sx={{ px: 1.5 }}
                />
                <Tab
                  label={intl.formatMessage(messages.tab3)}
                  value={'user_history'}
                  sx={{ px: 1.5 }}
                />
              </Tabs>
            </Grid>
          )}

          {(isLoadingGetUserDetails && modalTab === 'user_details') ||
          (modalTab === 'user_history' && (isLoadingData || isRefetchingData)) ? (
            <WaevAvatar
              alt="profile-image-loading"
              size="lg"
              shadow="sm"
              bgColor="info"
              isAnimating={true}
              fadeOpacity={'1'}
              opacity="1"
              sx={{ position: 'relative', mx: 'auto' }}
            />
          ) : modalTab === 'user_history' ? (
            <ViewUserRecords userRecordsData={userRecordsData} />
          ) : (
            <DialogContent sx={{ pt: 0 }}>
              {modalTab === 'user_details' ? null : selectedRecord?.transactions?.announce_tx &&
                selectedRecord?.transactions?.flags_update_transaction_id ? (
                <DialogContentText
                  id="alert-dialog-user"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <MDBox
                    display="flex"
                    component="span"
                    flexDirection={'row'}
                    sx={{
                      whiteSpace: 'pre',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 'bold',
                      mr: 3,
                    }}
                  >
                    {`${intl.formatMessage(messages.blockchainLinks)}: `}
                  </MDBox>
                  <MDBox
                    display="flex"
                    component="span"
                    flexDirection={'row'}
                    sx={{
                      whiteSpace: 'pre',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'rgba(255, 255, 255, 0.8)',
                      mr: 3,
                      pt: '10px',
                      pb: '3px',
                    }}
                  >
                    {'      Solana:'}
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
                      color: 'rgba(255, 255, 255, 0.8)',
                      mr: 3,
                      pb: '10px',
                    }}
                  >
                    {'      Gnosis:'}
                    {gnosisBlockchainLink}
                  </MDBox>
                </DialogContentText>
              ) : (
                <DialogContentText
                  id="alert-dialog-user"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <MDBox
                    display="flex"
                    component="span"
                    flexDirection={'row'}
                    sx={{
                      whiteSpace: 'pre',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'rgba(255, 255, 255, 0.5)',
                      mr: 3,
                      pt: '10px',
                      justifyContent: 'center',
                    }}
                  >
                    <FormattedMessage
                      id="view_data.record_modal.no_links"
                      defaultMessage="No Links Found"
                    />
                  </MDBox>
                </DialogContentText>
              )}
              <DialogContentText
                id="alert-dialog-data"
                sx={{
                  fontWeight: 'bold',
                }}
              >
                {waevTableRecord && selectedRecord && `${intl.formatMessage(messages.data)}:`}
              </DialogContentText>
              {modalTab === 'user_details' && (
                <TableContainer
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    margin: '10px',
                    width: 'auto',
                    marginBottom: '20px',
                  }}
                  component={Paper}
                >
                  <Table aria-label="waev connector table">
                    <TableHead sx={{ display: 'contents' }}>
                      <TableRow>
                        <TableCell sx={{ color: white.main }}>
                          {`${intl.formatMessage(messages.waev_id)}:`}
                        </TableCell>
                        <TableCell align="left" sx={{ color: white.main }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key={`Waev-id`}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell
                          sx={{
                            color: white.main,
                            whiteSpace: 'pre',
                            textTransform: 'capitalize',
                            width: '50%',
                          }}
                          component="th"
                          scope="row"
                        >
                          {selectedRecord?.fullRecord?.attributes?.uid}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <TableContainer
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  //marginRight: '10px',
                  margin: '10px',
                  marginBottom: '20px',
                  width: 'auto',
                }}
                component={Paper}
              >
                <Table aria-label="simple table one">
                  <TableHead sx={{ display: 'contents' }}>
                    <TableRow>
                      <TableCell sx={{ color: white.main }}>
                        {`${intl.formatMessage(messages.pii)}:`}
                      </TableCell>
                      <TableCell align="left" sx={{ color: white.main }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isThereAnyValuePrivateListed ? (
                      privateListed?.map((rowOne, i) =>
                        rowOne.value ? (
                          <TableRow
                            key={`PrivateList-${i}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell
                              sx={{
                                color: white.main,
                                whiteSpace: 'pre',
                                textTransform: 'capitalize',
                                width: '50%',
                              }}
                              component="th"
                              scope="row"
                            >
                              {rowOne.key.replace(/_/g, ' ').concat(':')}
                            </TableCell>
                            <TableCell sx={{ color: white.main, whiteSpace: 'pre' }} align="left">
                              {rowOne.value}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={`PrivateList-${i}`}></TableRow>
                        )
                      )
                    ) : (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell
                          sx={{
                            color: white.main,
                            whiteSpace: 'pre',
                            textTransform: 'capitalize',
                            width: '100%',
                            textAlign: 'center',
                            opacity: '0.5',
                          }}
                        >
                          <FormattedMessage
                            id="view_data.record_modal.no_pii_data"
                            defaultMessage="No PII Data"
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  margin: '10px',
                  width: 'auto',
                  mb: '20px',
                }}
                component={Paper}
              >
                <Table aria-label="simple table two">
                  <TableHead sx={{ display: 'contents' }}>
                    <TableRow>
                      <TableCell sx={{ color: white.main }}>{`${intl.formatMessage(
                        messages.anonymous_data
                      )}:`}</TableCell>
                      <TableCell align="left" sx={{ color: white.main }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isThereAnyValueListed ? (
                      listed?.map((rowTwo, n) =>
                        rowTwo.value ? (
                          <TableRow
                            key={`Non-PrivateList-${n}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell
                              sx={{
                                color: white.main,
                                whiteSpace: 'pre',
                                textTransform: 'capitalize',
                                width: '50%',
                              }}
                              component="th"
                              scope="row"
                            >
                              {rowTwo.key.replace(/_/g, ' ').concat(':')}
                            </TableCell>
                            <TableCell sx={{ color: white.main, whiteSpace: 'pre' }} align="left">
                              {rowTwo.value}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={`Non-PrivateList-Empty-${n}`}></TableRow>
                        )
                      )
                    ) : (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell
                          sx={{
                            color: white.main,
                            whiteSpace: 'pre',
                            textTransform: 'capitalize',
                            width: '100%',
                            textAlign: 'center',
                            opacity: '0.5',
                          }}
                        >
                          <FormattedMessage
                            id="view_data.record_modal.no_anonymous_data"
                            defaultMessage="No Anonymous Data"
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  margin: '10px',
                  width: 'auto',
                }}
                component={Paper}
              >
                <Table aria-label="simple table three">
                  <TableHead sx={{ display: 'contents' }}>
                    <TableRow>
                      <TableCell sx={{ color: white.main }}>{`${intl.formatMessage(
                        messages.meta_data
                      )}:`}</TableCell>
                      <TableCell align="left" sx={{ color: white.main }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isThereAnyMetaValueListed ? (
                      metaListed?.map((rowThree, n) =>
                        rowThree.value ? (
                          <TableRow
                            key={`Non-PrivateList-${n}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell
                              sx={{
                                color: white.main,
                                whiteSpace: 'pre',
                                // textTransform: 'capitalize',
                                width: '50%',
                              }}
                              component="th"
                              scope="row"
                            >
                              {rowThree.key.replace(/_/g, ' ').concat(':')}
                            </TableCell>
                            <TableCell sx={{ color: white.main, whiteSpace: 'pre' }} align="left">
                              {rowThree.value}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={`Non-PrivateList-Empty-${n}`}></TableRow>
                        )
                      )
                    ) : (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell
                          sx={{
                            color: white.main,
                            whiteSpace: 'pre',
                            textTransform: 'capitalize',
                            width: '100%',
                            textAlign: 'center',
                            opacity: '0.5',
                          }}
                        >
                          <FormattedMessage
                            id="view_data.record_modal.no_meta_data"
                            defaultMessage="No Meta Data"
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {modalTab === 'user_details' && (
                <>
                  <DialogContentText
                    id="alert-dialog-optInStatus"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    <FormattedMessage
                      id="view_data.record_modal.opt_in_status"
                      defaultMessage="Opt In Status"
                    />
                  </DialogContentText>
                  <TableContainer
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      margin: '10px',
                      width: 'auto',
                    }}
                    component={Paper}
                  >
                    <Table aria-label="simple table three">
                      <TableHead sx={{ display: 'contents' }}>
                        <TableRow>
                          <TableCell sx={{ color: white.main, width: '50%' }}>
                            <FormattedMessage
                              id="view_data.record_modal.opt_in"
                              defaultMessage="Opt In"
                            />
                            {':'}
                          </TableCell>
                          <TableCell align="left" sx={{ color: white.main, width: '50%' }}>
                            <FormattedMessage
                              id="view_data.record_modal.opt_out"
                              defaultMessage="Opt Out"
                            />
                            {':'}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataGetUserDetails &&
                        Object.keys(dataGetUserDetails.attributes.flags).length !== 0 ? (
                          optInTableBody()
                        ) : (
                          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell
                              sx={{ color: white.main, whiteSpace: 'pre', opacity: '0.5' }}
                              component="th"
                              scope="row"
                            >
                              {intl.formatMessage(messages.noOptIns)}
                            </TableCell>
                            <TableCell
                              sx={{ color: white.main, whiteSpace: 'pre', opacity: '0.5' }}
                              align="left"
                            >
                              {intl.formatMessage(messages.noOptOuts)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </DialogContent>
          )}

          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            {modalTab === 'selected_record' && (
              <MDBox ml="auto" display="flex" flexDirection="column" lineHeight={0} mr={3}>
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  component="span"
                  justifyContent="end"
                  display="flex"
                  textAlign="right"
                >
                  {waevTableRecord && selectedRecord?.fullRecord?.attributes?.timestamp ? (
                    <FormattedMessage
                      id="view_data.record_modal.created_on"
                      defaultMessage="Created On"
                    />
                  ) : (
                    ''
                  )}
                </MDTypography>
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="secondary"
                  justifyContent="end"
                  display="flex"
                  component="span"
                  textAlign="right"
                >
                  {waevTableRecord && selectedRecord?.fullRecord?.attributes?.timestamp
                    ? moment(selectedRecord.fullRecord.attributes.timestamp * 1000).format(
                        'ddd, MMM D [@] h:mm a'
                      )
                    : ''}
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </MDBox>
      </Card>
    </Dialog>
  );
}
