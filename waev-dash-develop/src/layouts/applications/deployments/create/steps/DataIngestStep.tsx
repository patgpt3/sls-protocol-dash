// @mui material components
import { Grid, Icon, Switch, Tooltip } from '@mui/material';

// Waev Dashboard components
import { FormField, MDBox, MDTypography } from 'components';

import {
  // IngestUserField,
  IngestPrivateFieldsInput,
  IngestFieldsInput,
} from '../../DataIngest';
import { DeploymentContext } from 'contexts';
import { useContext } from 'react';
import { InputEvent } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  tooltip: {
    id: 'deployments.data_ingest.step.tooltip',
    defaultMessage:
      'The User ID field is the unique field to each user in your deployment, such as an email',
  },
  click: {
    id: 'deployments.data_ingest.step.click',
    defaultMessage: 'Click',
  },
  define: {
    id: 'deployments.data_ingest.step.define',
    defaultMessage: 'to define which field is the User ID Field.',
  },
  fieldLabel: {
    id: 'deployments.data_ingest.step.field.label',
    defaultMessage: 'User ID Field Name',
  },
});

export const DataIngestStep = (): JSX.Element => {
  const intl = useIntl();
  const {
    isUserRequiredAlert,
    isDuplicateFieldAlert,
    ingestUserField,
    setIngestUserField,
    isIngestAllFields,
    setIsIngestAllFields,
  } = useContext(DeploymentContext);

  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            <FormattedMessage
              id="deployments.data_ingest.step.title"
              defaultMessage="Data Ingest"
            />
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          <FormattedMessage
            id="deployments.data_ingest.step.explanation"
            defaultMessage="(You can adjust this later)"
          />
        </MDTypography>
        <MDBox display="flex" alignItems="center" justifyContent="center" mb={0.5} ml={-1.5}>
          <Switch
            checked={!isIngestAllFields}
            onChange={() => setIsIngestAllFields(!isIngestAllFields)}
          />
          <MDTypography
            variant="button"
            fontWeight="regular"
            color={!isIngestAllFields ? 'light' : 'text'}
          >
            <FormattedMessage
              id="deployments.data_ingest.step.switch"
              defaultMessage="Ingest All Fields"
            />
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={2}>
        {!isIngestAllFields && (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <IngestPrivateFieldsInput />
            </Grid>
            <Grid item xs={12} sm={4}>
              <IngestFieldsInput />
            </Grid>
          </Grid>
        )}

        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            {!isIngestAllFields && isUserRequiredAlert && (
              <MDBox display="flex" justifyContent="center">
                <MDTypography color="error" variant="body2" fontWeight="regular" mr={1}>
                  *
                </MDTypography>
                <Tooltip title={intl.formatMessage(messages.tooltip)} placement="bottom">
                  <MDTypography color="text" variant="body2" fontWeight="regular">
                    {`${intl.formatMessage(messages.click)} (`}
                    {
                      <Icon sx={{ verticalAlign: 'text-bottom' }} color="info" fontSize="small">
                        person
                      </Icon>
                    }
                    {`) ${intl.formatMessage(messages.define)}`}
                  </MDTypography>
                </Tooltip>
              </MDBox>
            )}

            {isIngestAllFields && (
              <FormField
                type="text"
                label={intl.formatMessage(messages.fieldLabel)}
                value={ingestUserField}
                onChange={(e: InputEvent) => setIngestUserField(e.target.value)}
              />
            )}

            {isIngestAllFields && !ingestUserField && (
              <MDBox display="flex" justifyContent="center">
                <MDTypography color="error" variant="body2" fontWeight="regular" mr={1}>
                  *
                </MDTypography>
                <Tooltip title={intl.formatMessage(messages.tooltip)} placement="bottom">
                  <MDTypography color="text" variant="body2" fontWeight="regular">
                    <FormattedMessage
                      id="deployments.data_ingest.step.required"
                      defaultMessage="Naming a User ID Field is required."
                    />
                  </MDTypography>
                </Tooltip>
              </MDBox>
            )}

            {/* {!(ingestPrivateFieldsInput?.length > 0) &&
              !(ingestFieldsInput?.length > 0) &&
              !isIngestAllFields && (
                <MDBox mx={4}>
                  <MDBox display="flex" justifyContent="center" mb={2}>
                    <MDTypography color="error" variant="body2" fontWeight="regular" mr={1}>
                      *
                    </MDTypography>
                    <MDTypography color="text" variant="body2" fontWeight="regular">
                      If no fields are entered above, enter the User ID field here:
                    </MDTypography>
                  </MDBox>
                  <MDBox mx="20%">
                    <FormField
                      type="text"
                      label="User ID Field Name"
                      value={ingestUserField}
                      onChange={(e: InputEvent) => setIngestUserField(e.target.value)}
                    />
                  </MDBox>
                </MDBox>
              )} */}

            {/* Tests to see if there is no checkbox and is dirty. */}
            {isDuplicateFieldAlert && (
              <MDTypography color="error" variant="body2" fontWeight="regular">
                {'* '}
                <FormattedMessage
                  id="deployments.data_ingest.step.duplicate"
                  defaultMessage="Duplicate field found between anon and private fields..."
                />
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
};
