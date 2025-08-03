import { useContext, useState } from 'react';
// @mui material components
import { Card, Grid, Tabs, Tab, Divider, Icon } from '@mui/material';
import { DashboardLayout, DashboardNavbar, MDBox } from 'components';
import { CreateDataHeader } from './components/CreateDataHeader';
import { CSVRecordsTable } from './components/CSVRecordsTable';
import { SingleRecordForm } from './components/SingleRecordForm';
import {
  SelectedEntityContext,
  OptInFlagContext,
  OrganizationContext,
  NotificationContext,
} from 'contexts';
import { fileOpen } from 'browser-fs-access';
import { useDispatch } from 'react-redux';
import { setCSVData } from 'store';
import colors from 'assets/theme/base/colors';
import Papa from 'papaparse';
import { OptInFlag } from 'types';
import { defineMessages, useIntl } from 'utils';
import { EmptyPage } from 'layouts';

const messages = defineMessages({
  tab1: {
    id: 'create_records.tab1',
    defaultMessage: 'Single Records',
  },
  tab2: {
    id: 'create_records.tab2',
    defaultMessage: 'Bulk Import',
  },
});

export function CreateData(): JSX.Element {
  const dispatch = useDispatch();
  const intl = useIntl();

  const { selectedOrganization, selectedDeployment } = useContext(SelectedEntityContext);
  const { optInFlags, isFetchingOptInFlags } = useContext(OptInFlagContext);
  const { isHasOwnerOrAdminAccess } = useContext(OrganizationContext);
  const { setErrorNotification } = useContext(NotificationContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabValue, setTabValue] = useState<number>(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const openCSVFile = async () => {
    try {
      const file = await fileOpen({
        description: 'CSV file',
        mimeTypes: ['text/csv'],
        extensions: ['.csv'],
        multiple: false,
      });
      return file;
    } catch (err) {
      console.error(err);
    }
  };

  const uploadCSV = (csvfile: File) => {
    Papa.parse(csvfile, {
      complete: (result) => {
        const records = result?.data ?? [];
        // Upload records limit
        if (records.length > 3000) {
          setErrorNotification({
            title: 'Upload Records Limit',
            message: 'Cannot upload more than 3000 records.',
          });
          return;
        }
        const filteredRecords = records.filter((item) => {
          return !(Object.keys(item).length === 1 && Object.values(item)[0] === '');
        });
        const headers = result?.meta?.fields ?? [];
        const filteredHeaders = headers.filter((item) => item.length > 0);
        dispatch(setCSVData({ headers: filteredHeaders, records: filteredRecords }));
        setCsvFile(csvfile);
      },
      header: true,
    });
  };

  const onClickUploadCSV = async () => {
    const csvFile = await openCSVFile();
    if (!csvFile) {
      setErrorNotification({
        title: 'Upload CSV Error',
        message: 'Error in uploading the CSV file.',
      });
      return;
    }
    // If the file size is bigger than 50 MB
    if (csvFile.size > 50 * 1024 * 1024) {
      setErrorNotification({
        title: 'Upload CSV Limit',
        message: 'The CSV file cannot be larger than 50 MB.',
      });
      return;
    }
    uploadCSV(csvFile);
  };

  const onClickDownload = async () => {
    try {
      const configFields: string[] = selectedDeployment?.attributes?.config?.fields
        ? selectedDeployment?.attributes?.config?.fields.map((e: { name: string }) => e.name)
        : [];
      const configPrivateFields: string[] = selectedDeployment?.attributes?.config?.private_fields
        ? selectedDeployment?.attributes?.config?.private_fields.map(
            (e: { name: string }) => e.name
          )
        : [];
      const flagFields: string[] = optInFlags
        ? optInFlags.map((flag: OptInFlag) => flag?.attributes?.field_selector)
        : [];
      const onlyOptInFields: string[] = flagFields.filter(
        (value: string) => !(configPrivateFields.includes(value) || configFields.includes(value))
      );

      const allConfigFields = [...configPrivateFields, ...configFields, ...onlyOptInFields];

      const csvFileData =
        allConfigFields.join(',') + '\n' + allConfigFields.join(' value,') + ' value';

      const blob = new Blob([csvFileData], { type: 'text/csv' });

      const element = document.createElement('a');
      element.href = URL.createObjectURL(blob);
      element.download = 'csv_template.csv';
      document.body.appendChild(element);
      element.click();
    } catch (err) {
      console.error('Download CSV file error: ', err);
    }
  };

  const { dark, info } = colors;

  const handleSetTabValue = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} xl={11.5}>
          <CreateDataHeader />
          {isHasOwnerOrAdminAccess ? (
            <EmptyPage
              page="CreateData"
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
              page="CreateData"
              noOrganizationMessage={`You have no Organizations. Go to the `}
              noOrganizationMessage2={` to get started.`}
              organizationLinkPath={'/pages/account/settings'}
              noDeploymentMessage={'You have no Deployments.'}
              noDeploymentMessage2={' '}
              organizationLinkText={'Settings'}
            />
          )}
          <MDBox pt={5}>
            {selectedOrganization && selectedDeployment && (
              <Card sx={{ paddingBottom: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="left" px={2} pt={3}>
                  <Grid item>
                    <Tabs
                      orientation="horizontal"
                      value={tabValue}
                      onChange={handleSetTabValue}
                      sx={{ bgcolor: dark.main }}
                      TabIndicatorProps={{
                        style: {
                          backgroundColor: info.main,
                        },
                      }}
                    >
                      <Tab
                        label={intl.formatMessage(messages.tab1)}
                        value={1}
                        sx={{ px: 1.5 }}
                        icon={
                          <Icon fontSize="small" sx={{ mt: -0.25 }}>
                            add_box
                          </Icon>
                        }
                      />
                      <Tab
                        label={intl.formatMessage(messages.tab2)}
                        value={2}
                        sx={{ px: 1.5 }}
                        icon={
                          <Icon fontSize="small" sx={{ mt: -0.25 }}>
                            file_upload
                          </Icon>
                        }
                      />
                    </Tabs>
                  </Grid>
                </Grid>
                <Divider />
                {tabValue === 1 ? (
                  <>
                    {selectedOrganization && selectedDeployment && (
                      <SingleRecordForm
                        selectedDeployment={selectedDeployment}
                        optInFlags={optInFlags}
                        isFetchingOptInFlags={isFetchingOptInFlags}
                      />
                    )}
                  </>
                ) : (
                  <CSVRecordsTable
                    onUploadCSV={onClickUploadCSV}
                    onDownload={onClickDownload}
                    selectedOrganization={selectedOrganization}
                    selectedDeployment={selectedDeployment}
                    optInFlags={optInFlags}
                    csvFile={csvFile}
                    setCsvFile={setCsvFile}
                  />
                )}
              </Card>
            )}
          </MDBox>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
