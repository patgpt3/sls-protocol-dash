import { useContext } from 'react';

// @mui material components
import { Grid, Icon, List, ListItem, Divider } from '@mui/material';
import colors from 'assets/theme-dark/base/colors';
import React from 'react';
import {
  DataTable,
  FancyCheckbox,
  MDBox,
  MDButton,
  MDTypography,
  FlashingLoader,
} from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { setIsTablePretty, clearCSVData } from 'store';
import { DeploymentRecordContext } from 'contexts';
import { Deployment, Organization, Row, CSVRecordType, RootStateType, OptInFlag } from 'types';
import { emptyCell, crossSiteFadeInKeyframes } from 'utils';
import { useUploadRecordsCSV } from 'hooks';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  columnView: {
    id: 'create_records.csv_data.column_view',
    defaultMessage: 'Column View',
  },
  rowView: {
    id: 'create_records.csv_data.row_view',
    defaultMessage: 'Row View',
  },
  noRecords: {
    id: 'create_records.csv_data.no_records',
    defaultMessage: 'No Records Found In CSV File.',
  },
  noValue: {
    id: 'create_records.csv_data.header.no_value',
    defaultMessage: 'No value',
  },
  private: {
    id: 'create_records.csv_data.text.private',
    defaultMessage: 'Private',
  },
  public: {
    id: 'create_records.csv_data.text.public',
    defaultMessage: 'Public',
  },
  user: {
    id: 'create_records.csv_data.text.user',
    defaultMessage: 'User',
  },
  field: {
    id: 'create_records.csv_data.text.field',
    defaultMessage: 'Field',
  },
  fields: {
    id: 'create_records.csv_data.text.fields',
    defaultMessage: 'Fields',
  },
  anon: {
    id: 'create_records.csv_data.text.anon',
    defaultMessage: 'Anon',
  },
  consent: {
    id: 'create_records.csv_data.text.consent',
    defaultMessage: 'Consent',
  },
  notInConfig: {
    id: 'create_records.csv_data.text.not_in_config',
    defaultMessage: 'Not In Config',
  },
  requiredValidation: {
    id: 'create_records.csv_data.required_validation',
    defaultMessage: 'records do not have a value for the required',
  },
  acceptedValues: {
    id: 'create_records.csv_data.accepted_values_validation',
    defaultMessage: 'The accepted values are: 1, 0, true or false.',
  },
  unacceptedValidation1: {
    id: 'create_records.csv_data.unaccepted_values_validation1',
    defaultMessage: 'consent field value is unsupported and will be ignored during import.',
  },
  unacceptedValidation2: {
    id: 'create_records.csv_data.unaccepted_values_validation2',
    defaultMessage: 'consent field values are unsupported and will be ignored during import.',
  },
});

interface CSVTableProps {
  onUploadCSV: () => void;
  onDownload: () => void;
  selectedDeployment: Deployment;
  selectedOrganization: Organization;
  optInFlags: OptInFlag[];
  csvFile: File;
  setCsvFile: (file: File | null) => void;
}

export function CSVRecordsTable({
  onUploadCSV,
  onDownload,
  selectedDeployment,
  selectedOrganization,
  optInFlags,
  csvFile,
  setCsvFile,
}: CSVTableProps): JSX.Element {
  const dispatch = useDispatch();
  const intl = useIntl();
  const { info, success, secondary, error, white, warning } = colors;

  const {
    isLoadingData,
    isRefetchingData,
    recordsPageNumber,
    setRecordsPageNumber,
    defaultEntriesPerPage,
    setDefaultEntriesPerPage,
  } = useContext(DeploymentRecordContext);

  const csvData = useSelector((state: RootStateType) => state.records.csv_data);
  const isTablePretty = useSelector((state: RootStateType) => state.records.isTablePretty);

  const userField: string = selectedDeployment?.attributes?.config?.user_field;

  let columns: any[] = [];
  let rows: any[] = [];
  let configFields: string[] = selectedDeployment?.attributes?.config?.fields
    ? selectedDeployment?.attributes?.config?.fields.map((e: { name: string }) => e.name)
    : [];
  let configPrivateFields: string[] = selectedDeployment?.attributes?.config?.private_fields
    ? selectedDeployment?.attributes?.config?.private_fields.map((e: { name: string }) => e.name)
    : [];
  let fieldsNotInConfig: string[] = [];
  let isUserFieldPrivate: boolean = configPrivateFields.includes(userField);
  let sharedFields: string[] = (configFields || []).filter((value) =>
    configPrivateFields.includes(value)
  );
  let nonUuidFieldColumns: string[] = configFields.filter((colName) => colName !== userField);
  let nonUuidPrivateFieldColumns: string[] = configPrivateFields.filter(
    (colName) => colName !== userField
  );
  let flagFields: string[] = optInFlags
    ? optInFlags.map((flag: OptInFlag) => flag?.attributes?.field_selector)
    : [];
  let onlyOptInFields: string[] = flagFields.filter(
    (value: string) => !(configPrivateFields.includes(value) || configFields.includes(value))
  );

  if (csvData && csvData.headers.length > 0 && userField) {
    csvData.headers.forEach((value: string) => {
      if (
        value &&
        !configFields.includes(value) &&
        !configPrivateFields.includes(value) &&
        !flagFields.includes(value)
      ) {
        fieldsNotInConfig.push(value);
      }
    });
  }

  const files: File[] = csvFile ? [csvFile] : [];

  const { isLoading: isLoadingUploadRecordsCSV, mutate: uploadRecordsCSV } = useUploadRecordsCSV(
    selectedDeployment?.id,
    files
  );

  const handleCancel = () => {
    dispatch(clearCSVData());
    setCsvFile(null);
  };

  const onImportRecords = () => {
    uploadRecordsCSV();
    dispatch(clearCSVData());
    setCsvFile(null);
  };

  const leftHeader = (
    <FancyCheckbox
      isSelected={isTablePretty}
      onSelect={() => dispatch(setIsTablePretty(!isTablePretty))}
      icon={isTablePretty ? 'view_column' : 'list'}
      tooltip={
        isTablePretty
          ? intl.formatMessage(messages.columnView)
          : intl.formatMessage(messages.rowView)
      }
      tooltipPlacement="top"
    />
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
  ) : csvData ? (
    <MDBox display="flex" alignItems="center" justifyContent="center" mb={0.5} ml={-1.5}>
      <MDTypography variant="button" fontWeight="regular">
        {intl.formatMessage(messages.noRecords)}
      </MDTypography>
    </MDBox>
  ) : null;

  const renderCSVTableData = () => {
    if (csvData && csvData.headers.length > 0 && userField) {
      if (isTablePretty) {
        columns = [
          {
            Header: `${intl.formatMessage(messages.user)} ${intl.formatMessage(messages.field)}`,
            accessor: 'deployment-user-field',
          },
          {
            Header: `${intl.formatMessage(messages.private)} ${intl.formatMessage(
              messages.fields
            )}`,
            accessor: 'deployment-private-fields',
            color: success.main,
          },
          {
            Header: `${intl.formatMessage(messages.anon)} ${intl.formatMessage(messages.fields)}`,
            accessor: 'deployment-fields',
            color: info.main,
          },
        ];

        if (flagFields.length > 0) {
          columns.push({
            Header: `${intl.formatMessage(messages.consent)} ${intl.formatMessage(
              messages.fields
            )}`,
            accessor: 'deployment-opt-in-fields',
            color: warning.main,
          });
        }

        if (fieldsNotInConfig.length > 0) {
          columns.push({
            Header: `${intl.formatMessage(messages.notInConfig)} ${intl.formatMessage(
              messages.fields
            )}`,
            accessor: 'not-in-config-fields',
            color: error.main,
          });
        }

        rows = csvData.records.map((record: CSVRecordType) => {
          const userFieldValue = (
            <MDBox display="grid">
              <MDBox display="flex" pr={2}>
                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                  {userField}: &nbsp;
                </MDTypography>
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  opacity={record[userField] ? 1 : 0.5}
                >
                  &nbsp;
                  {userField && record[userField]
                    ? record[userField]
                    : intl.formatMessage(messages.noValue)}
                </MDTypography>
              </MDBox>
            </MDBox>
          );

          const fieldsValues =
            configFields.length > 0 ? (
              <MDBox display="grid">
                {configFields.map((field: string) => {
                  return (
                    <MDBox key={field} display="flex" pr={2}>
                      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        {field}: &nbsp;
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        opacity={record[field] ? 1 : 0.5}
                      >
                        &nbsp;
                        {field && record[field]
                          ? record[field]
                          : intl.formatMessage(messages.noValue)}
                      </MDTypography>
                    </MDBox>
                  );
                })}
              </MDBox>
            ) : (
              emptyCell
            );

          const privateFieldsValues =
            configPrivateFields.length > 0 ? (
              <MDBox display="grid">
                {configPrivateFields.map((privateField: string) => {
                  return (
                    <MDBox key={privateField} display="flex" pr={2}>
                      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        {privateField}: &nbsp;
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        opacity={record[privateField] ? 1 : 0.5}
                      >
                        &nbsp;
                        {privateField && record[privateField]
                          ? record[privateField]
                          : intl.formatMessage(messages.noValue)}
                      </MDTypography>
                    </MDBox>
                  );
                })}
              </MDBox>
            ) : (
              emptyCell
            );

          const optInFieldsValues =
            flagFields.length > 0 ? (
              <MDBox display="grid">
                {flagFields.map((value: string, i: number) => {
                  return (
                    <MDBox key={i} display="flex" pr={2}>
                      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        {value}: &nbsp;
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        opacity={record[value] ? 1 : 0.5}
                      >
                        &nbsp;
                        {value && record[value]
                          ? record[value]
                          : intl.formatMessage(messages.noValue)}
                      </MDTypography>
                    </MDBox>
                  );
                })}
              </MDBox>
            ) : (
              emptyCell
            );

          const notInConfigValues =
            fieldsNotInConfig.length > 0 ? (
              <MDBox display="grid">
                {fieldsNotInConfig.map((value: string) => {
                  return (
                    <MDBox key={value} display="flex" pr={2}>
                      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                        {value}: &nbsp;
                      </MDTypography>
                      <MDTypography
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        opacity={record[value] ? 1 : 0.5}
                      >
                        &nbsp;
                        {value && record[value]
                          ? record[value]
                          : intl.formatMessage(messages.noValue)}
                      </MDTypography>
                    </MDBox>
                  );
                })}
              </MDBox>
            ) : (
              emptyCell
            );

          let dataMap: Row = {
            'deployment-user-field': userFieldValue,
            'deployment-fields': fieldsValues,
            'deployment-private-fields': privateFieldsValues,
            'deployment-opt-in-fields': optInFieldsValues,
            'not-in-config-fields': notInConfigValues,
          };
          return dataMap;
        });
      } else {
        columns = [
          {
            Header: <MDBox sx={{ color: secondary.main }}>{`${userField} *`}</MDBox>,
            private: !!isUserFieldPrivate,
            accessor: 'deploy-user-field',
            color: success.main,
            toolTipElement: isUserFieldPrivate ? (
              <React.Fragment>
                {`${intl.formatMessage(messages.user)} ${intl.formatMessage(messages.field)} (`}
                <Icon fontSize="inherit">lock</Icon>
                {` ${intl.formatMessage(messages.private)})`}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {` ${intl.formatMessage(messages.user)} ${intl.formatMessage(messages.field)} (`}
                <Icon fontSize="inherit">lock_open</Icon>
                {` ${intl.formatMessage(messages.public)})`}
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
                  {` ${intl.formatMessage(messages.private)} ${intl.formatMessage(messages.field)}`}
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
                  {` ${intl.formatMessage(messages.public)} ${intl.formatMessage(messages.field)}`}
                </React.Fragment>
              ),
              tooltipPlacement: 'top',
            };
          }),

          ...onlyOptInFields.map((colName) => {
            return {
              Header: colName,
              accessor: colName,
              color: warning.main,
              toolTipElement: (
                <React.Fragment>{`${intl.formatMessage(messages.consent)} ${intl.formatMessage(
                  messages.field
                )}`}</React.Fragment>
              ),
              tooltipPlacement: 'top',
            };
          }),

          ...fieldsNotInConfig.map((colName) => {
            return {
              Header: colName,
              accessor: colName,
              color: error.main,
              toolTipElement: (
                <React.Fragment>{`${intl.formatMessage(messages.notInConfig)} ${intl.formatMessage(
                  messages.field
                )}`}</React.Fragment>
              ),
              tooltipPlacement: 'top',
            };
          }),
        ];

        rows = csvData.records.map((record: any) => {
          let dataMap: Row = {};
          configFields.forEach((field) => {
            //@ts-ignore
            dataMap[field] = record[field] ? record[field] : emptyCell;
          });

          configPrivateFields.forEach((field) => {
            //@ts-ignore
            dataMap[field] = record[field] ? record[field] : emptyCell;
          });

          flagFields.forEach((field) => {
            //@ts-ignore
            dataMap[field] = record[field] ? record[field] : emptyCell;
          });

          fieldsNotInConfig.forEach((field) => {
            //@ts-ignore
            dataMap[field] = record[field] ? record[field] : emptyCell;
          });

          dataMap['deploy-user-field'] = record[userField] ? record[userField] : emptyCell;

          return dataMap;
        });
      }
    }

    return { columns, rows };
  };

  const tableData = renderCSVTableData();

  const noUuidValueRecords: CSVRecordType[] = [];
  const acceptedFlagValues: string[] = ['0', '1', 'false', 'true', ''];
  const unsupportedFlagValues: string[] = [];

  if (csvData && csvData.records.length > 0) {
    csvData.records.forEach((record) => {
      if (!record[userField]) noUuidValueRecords.push(record);
      for (const key in record) {
        if (
          onlyOptInFields.includes(key) &&
          !acceptedFlagValues.includes(record[key].toLowerCase())
        ) {
          unsupportedFlagValues.push(record[key]);
        }
      }
    });
  }

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        px={2}
        mt={2}
        display="flex"
        flexDirection="column"
        sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
      >
        <MDTypography variant="h5">
          <FormattedMessage id="create_records.import.header" defaultMessage="Data Import" />
        </MDTypography>
        <Divider />
        <MDTypography variant="body2">
          <FormattedMessage
            id="create_records.import.text"
            defaultMessage="You can import records in bulk via CSV file using the process below:"
          />
        </MDTypography>
        <List sx={{ listStyleType: 'disc', pl: 4, pt: 1 }}>
          <ListItem sx={{ display: 'list-item', color: white.main }}>
            <MDTypography variant="body2" pb={1}>
              <FormattedMessage
                id="create_records.import.bullet1"
                defaultMessage="Use the “Download Template” button to download a template for this deployment."
              />
            </MDTypography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', color: white.main }}>
            <MDTypography variant="body2" pb={1}>
              <FormattedMessage
                id="create_records.import.bullet2"
                defaultMessage="Create the CSV you’d like to upload, so that it matches the template provided. It must
				be a comma “,” delimited file and we do not currently support semicolon delimited “;”
				files. Column order does not matter but properly named headers are required and any
				lines of data missing a User ID “uuid” will be omitted. Any fields containing a comma
				must be quote wrapped."
              />
            </MDTypography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', color: white.main }}>
            <MDTypography variant="body2" pb={1}>
              <FormattedMessage
                id="create_records.import.bullet3"
                defaultMessage="To set consent field values, use a value of 1, 0, true or false. If no value is provided no changes will be made to the consent field for that record."
              />
            </MDTypography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', color: white.main }}>
            <MDTypography variant="body2" pb={1}>
              <FormattedMessage
                id="create_records.import.bullet4"
                defaultMessage="Upload the CSV you created using the “Add from CSV” button."
              />
            </MDTypography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', color: white.main }}>
            <MDTypography variant="body2" pb={1}>
              <FormattedMessage
                id="create_records.import.bullet5"
                defaultMessage="Review the data preview to ensure the file is properly formatted and the data displays
				correctly in the preview. If revisions are needed click the “Cancel” button and repeat
				the process."
              />
            </MDTypography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', color: white.main }}>
            <MDTypography variant="body2" pb={1}>
              <FormattedMessage
                id="create_records.import.bullet6"
                defaultMessage="Click the “Import” button to import all records in the uploaded file. Please note that
				this action is permanent and cannot be undone."
              />
            </MDTypography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', color: white.main }}>
            <MDTypography variant="body2" pb={1}>
              <FormattedMessage
                id="create_records.import.bullet7"
                defaultMessage="User ID field value is required. Only the records that have a value for this field can
				be imported."
              />
            </MDTypography>
          </ListItem>
        </List>
      </Grid>
      <Grid
        item
        xs={12}
        px={2}
        mb={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      ></Grid>
      {csvData ? (
        <Grid item xs={12}>
          {selectedOrganization && selectedDeployment && (
            <>
              <DataTable
                table={tableData}
                canSearch={!isTablePretty}
                leftHeader={leftHeader}
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
              {noUuidValueRecords.length > 0 && (
                <Grid
                  item
                  xs={12}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mx={2}
                  mb={3}
                >
                  <MDTypography display="block" variant="button" color="error">
                    {`${noUuidValueRecords.length} ${intl.formatMessage(
                      messages.requiredValidation
                    )} "${userField}" ${intl.formatMessage(messages.field).toLowerCase()}.`}
                  </MDTypography>
                </Grid>
              )}
              {unsupportedFlagValues.length > 0 && (
                <Grid
                  item
                  xs={12}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mx={2}
                  mb={3}
                >
                  <MDTypography display="block" variant="button" color="error">
                    {unsupportedFlagValues.length === 1
                      ? `${unsupportedFlagValues.length} ${intl.formatMessage(
                          messages.unacceptedValidation1
                        )} ${intl.formatMessage(messages.acceptedValues)}`
                      : `${unsupportedFlagValues.length} ${intl.formatMessage(
                          messages.unacceptedValidation2
                        )}  ${intl.formatMessage(messages.acceptedValues)}`}
                  </MDTypography>
                </Grid>
              )}
              <Grid item xs={12} display="flex" justifyContent="center"></Grid>
              <Grid item xs={12} display="flex" justifyContent="space-between">
                <MDButton variant="gradient" color="info" onClick={handleCancel} sx={{ ml: 2 }}>
                  <FormattedMessage id="create_records.button.cancel" defaultMessage="Cancel" />
                </MDButton>
                <MDButton
                  disabled={
                    !(csvData.records.length > 0) ||
                    noUuidValueRecords.length === csvData.records.length
                  }
                  variant="gradient"
                  color="info"
                  onClick={onImportRecords}
                  sx={{ mr: 2 }}
                >
                  <FormattedMessage id="create_records.button.import" defaultMessage="Import" />
                </MDButton>
              </Grid>
            </>
          )}
        </Grid>
      ) : isLoadingUploadRecordsCSV ? (
        <Grid item xs={12} my={2} display="flex" justifyContent="center">
          <MDBox sx={{ width: '100%' }} data-testid="register-loading-status">
            <FlashingLoader />
          </MDBox>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          sx={{ animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
        >
          <MDButton
            variant="gradient"
            color="info"
            onClick={onDownload}
            sx={{ ml: 2 }}
            value="download"
          >
            <FormattedMessage
              id="create_records.button.template"
              defaultMessage="Download Template"
            />
          </MDButton>
          <MDButton variant="gradient" color="info" onClick={onUploadCSV} sx={{ mr: 2 }}>
            <FormattedMessage id="create_records.button.upload" defaultMessage="Add from CSV" />
          </MDButton>
        </Grid>
      )}
    </Grid>
  );
}
