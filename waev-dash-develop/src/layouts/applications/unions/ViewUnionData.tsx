import { useEffect, useState } from 'react';
import { Card, Grid, Tooltip, Divider } from '@mui/material';
import {
  FancyIconButton,
  FlashingLoader,
  InputWithAction,
  DashboardLayout,
  DashboardNavbar,
  DataTable,
  MDBox,
  MDTypography,
} from 'components';
import {
  useIntl,
  defineMessages,
  FormattedMessage,
  crossSiteFadeInKeyframes,
  emptyCell,
} from 'utils';
import { useNavigate, useGetUnionUserDetails, useQueryClient } from 'hooks';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedUnion } from 'store';
import { RootStateType, UnionUserRecords, UnionRecordField } from 'types';
import colors from 'assets/theme-dark/base/colors';

const messages = defineMessages({
  dataUnion: {
    id: 'view_union_data.tooltip.data_union',
    defaultMessage: 'Data Union',
  },
  back: {
    id: 'view_union_data.tooltip.back',
    defaultMessage: 'Back to Select a Data Union',
  },
  searchPlaceholder: {
    id: 'view_union_data.search_placeholder',
    defaultMessage: 'Search for user data',
  },
  privateFields: {
    id: 'view_union_data.private_fields',
    defaultMessage: 'Private Fields',
  },
  anonFields: {
    id: 'view_union_data.anon_fields',
    defaultMessage: 'Anon Fields',
  },
  userField: {
    id: 'view_union_data.user_field',
    defaultMessage: 'User Field',
  },
  waevUid: {
    id: 'view_union_data.waev_uid',
    defaultMessage: 'Waev Connector',
  },
  consentFields: {
    id: 'view_union_data.consent_fields',
    defaultMessage: 'Consent Fields',
  },
  metaFields: {
    id: 'view_union_data.meta_fields',
    defaultMessage: 'Meta Fields',
  },
});

export function ViewUnionData(): JSX.Element {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { info, success, warning } = colors;

  const [isFirstSearched, setIsFirstSearched] = useState<boolean>(false);
  const [userSearchInput, setUserSearchInput] = useState<string>('');
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);
  const [userRecordsData, setUserRecordsData] = useState<UnionUserRecords | null>(null);

  const selectedUnion = useSelector((state: RootStateType) => state.unions.selected_union);

  const {
    data: unionUserData,
    isLoading: isLoadingUnionRecords,
    isRefetching: isRefetchingUnionRecords,
    refetch: getUnionRecords,
  } = useGetUnionUserDetails(selectedUnion?.unionId, userIdentifier);

  useEffect(() => {
    setUserIdentifier(null);
    if (unionUserData?.attributes) {
      setUserRecordsData(unionUserData.attributes);
    }
  }, [unionUserData]);

  useEffect(() => {
    if (userIdentifier) {
      getUnionRecords();
    }
  }, [userIdentifier]);

  const isLoadingData = isLoadingUnionRecords || isRefetchingUnionRecords;

  const waevUid = userRecordsData?.uid ?? null;
  const piiFields: string[] = userRecordsData?.data?.pii
    ? userRecordsData?.data?.pii.map((e: UnionRecordField) => e.value)
    : [];
  const anonFields: string[] = userRecordsData?.data?.anon
    ? userRecordsData?.data?.anon.map((e: UnionRecordField) => e.value)
    : [];
  const flagFields: string[] = userRecordsData?.data?.flags
    ? userRecordsData?.data?.flags.map((e: UnionRecordField) => e.value)
    : [];
  const metaFields: string[] = userRecordsData?.data?.meta
    ? userRecordsData?.data?.meta.map((e: UnionRecordField) => e.value)
    : [];

  const totalFields: number = piiFields.length + anonFields.length + metaFields.length;

  if (!selectedUnion) {
    navigate('/deployments');
    return <></>;
  }

  const goToSelectionPage = (selectionPage: string) => {
    navigate(`/${selectionPage}`);
    dispatch(clearSelectedUnion());
  };

  const onSearchSubmit = () => {
    queryClient.removeQueries([`UnionUserDetails`, selectedUnion?.unionId, userSearchInput]);
    setUserIdentifier(userSearchInput);
    setUserSearchInput('');
    setIsFirstSearched(true);
    setUserRecordsData(null);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && userSearchInput.length > 0) {
      onSearchSubmit();
    }
  };

  let columns: any[] = [];
  let rows: any[] = [];

  const renderTableData = () => {
    if (totalFields > 0) {
      if (waevUid) {
        columns.push({
          Header: `${intl.formatMessage(messages.waevUid)}`,
          accessor: 'union-waev-uid',
        });
      }

      if (piiFields.length > 0) {
        columns.push({
          Header: `${intl.formatMessage(messages.privateFields)}`,
          accessor: 'union-private-fields',
          color: success.main,
        });
      }

      if (anonFields.length > 0) {
        columns.push({
          Header: `${intl.formatMessage(messages.anonFields)}`,
          accessor: 'union-anon-fields',
          color: info.main,
        });
      }

      // if (flagFields.length > 0) {
      //   columns.push({
      //     Header: `${intl.formatMessage(messages.consentFields)}`,
      //     accessor: 'union-flags-fields',
      //     color: warning.main,
      //   });
      // }

      if (metaFields.length > 0) {
        columns.push({
          Header: `${intl.formatMessage(messages.metaFields)}`,
          accessor: 'union-meta-fields',
        });
      }

      const privateFieldsValues =
        piiFields.length > 0 ? (
          <MDBox display="grid">
            {userRecordsData?.data?.pii.map((privateField: UnionRecordField, i: number) => {
              return (
                <MDBox key={i} display="flex" pr={2}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                    {privateField.key}: &nbsp;
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    &nbsp;
                    {privateField.value}
                  </MDTypography>
                </MDBox>
              );
            })}
          </MDBox>
        ) : (
          emptyCell
        );

      const anonFieldsValues =
        anonFields.length > 0 ? (
          <MDBox display="grid">
            {userRecordsData?.data?.anon.map((anonField: UnionRecordField, i: number) => {
              return (
                <MDBox key={i} display="flex" pr={2}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                    {anonField.key}: &nbsp;
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    &nbsp;
                    {anonField.value}
                  </MDTypography>
                </MDBox>
              );
            })}
          </MDBox>
        ) : (
          emptyCell
        );

      const flagFieldsValues =
        flagFields.length > 0 ? (
          <MDBox display="grid">
            {userRecordsData?.data?.flags.map((flagField: UnionRecordField, i: number) => {
              return (
                <MDBox key={i} display="flex" pr={2}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                    {flagField.key}: &nbsp;
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    &nbsp;
                    {String(flagField.value)}
                  </MDTypography>
                </MDBox>
              );
            })}
          </MDBox>
        ) : (
          emptyCell
        );

      const metaFieldsValues =
        metaFields.length > 0 ? (
          <MDBox display="grid">
            {userRecordsData?.data?.meta.map((metaField: UnionRecordField, i: number) => {
              return (
                <MDBox key={i} display="flex" pr={2}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                    {metaField.key}: &nbsp;
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    &nbsp;
                    {metaField.value}
                  </MDTypography>
                </MDBox>
              );
            })}
          </MDBox>
        ) : (
          emptyCell
        );

      rows = [
        {
          'union-waev-uid': waevUid ? `${waevUid.slice(0, 16)}...` : emptyCell,
          'union-private-fields': privateFieldsValues,
          'union-anon-fields': anonFieldsValues,
          // 'union-flags-fields': flagFieldsValues,
          'union-meta-fields': metaFieldsValues,
        },
      ];
    }

    return { columns, rows };
  };

  const tableData = renderTableData();

  const userSearch = (
    <InputWithAction
      value={userSearchInput || ''}
      placeholder={intl.formatMessage(messages.searchPlaceholder)}
      onChange={setUserSearchInput}
      onPrimaryClick={() => onSearchSubmit()}
      onKeyDown={onKeyDown}
      primaryTooltip={intl.formatMessage(messages.searchPlaceholder)}
      disablePrimaryWhenEmpty
      buttonsOnRight
      primaryIcon="search"
    />
  );

  const noDataText = isLoadingData ? (
    <MDBox alignSelf="center" sx={{ width: '95%' }} data-testid="union-loading-status">
      <FlashingLoader />
    </MDBox>
  ) : (
    <MDBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      mb={0.5}
      ml={-1.5}
      sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
    >
      <MDTypography variant="button" fontWeight="regular">
        {isFirstSearched ? (
          <FormattedMessage
            id="view_union_data.placeholder.no_data"
            defaultMessage="No Data Found."
          />
        ) : (
          <FormattedMessage
            id="view_union_data.placeholder.description"
            defaultMessage="Enter an email address in the search field to find user data."
          />
        )}
      </MDTypography>
    </MDBox>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} xl={11.5}>
          <Card sx={{ paddingBottom: 3, minHeight: '50vh' }}>
            <Grid px={3} pt={1} lineHeight={1} container>
              <Grid item xs={7} md={7} pr={3}>
                <MDTypography pt={2} pl={1} variant="h5" fontWeight="medium">
                  <FormattedMessage
                    id="view_union_data.title"
                    defaultMessage="View Data Union Records"
                  />
                </MDTypography>
              </Grid>
              <Grid item xs={5} md={5}>
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
                    onClick={() => goToSelectionPage(selectedUnion.selectionPage)}
                    tooltip={intl.formatMessage(messages.back)}
                    tooltipPlacement="top"
                  />
                  <Tooltip title={intl.formatMessage(messages.dataUnion)} placement="top">
                    <MDTypography variant="h5" fontWeight="medium" mt={2} mr={2}>
                      {selectedUnion.unionName}
                    </MDTypography>
                  </Tooltip>
                </MDBox>
              </Grid>
            </Grid>
            <Divider sx={{ margin: 0 }} />
            <Grid item xs={12}>
              <DataTable
                table={tableData}
                leftHeader={userSearch}
                pageNumber={0}
                setPageNumber={() => {}}
                showTotalEntries={false}
                isHidePages={true}
                noDataText={noDataText}
                sx={{
                  'tbody>tr>td:nth-of-type(2)': { pr: 0, pl: 1 },
                }}
              />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
