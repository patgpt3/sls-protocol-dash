// @mui material components
import { Icon, Divider, Grid, Switch, Tooltip } from '@mui/material';

import { FormField, InfoCard, MDBox, MDTypography, QuickInfoActionCard } from 'components';
import { DeploymentContext, SelectedEntityContext, NotificationContext } from 'contexts';
import { useContext } from 'hooks';
import { IngestFieldsInput } from './IngestFieldsInput';
import { IngestPrivateFieldsInput } from './IngestPrivateFieldsInput';
import { OptInFlags } from '../OptInFlags';
import { InputEvent } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  title: {
    id: 'deployments.data_ingest.info_card.title',
    defaultMessage: 'Data Ingest',
  },
  none: {
    id: 'deployments.data_ingest.none',
    defaultMessage: 'None',
  },
  descriptionTooltip: {
    id: 'deployments.data_ingest.description.tooltip',
    defaultMessage:
      'The User ID field is the unique field to each user in your deployment, such as an email',
  },
  formLabel: {
    id: 'deployments.data_ingest.form.label',
    defaultMessage: 'User ID Field Name',
  },
  success: {
    id: 'deployments.data_ingest.success.title',
    defaultMessage: 'Success',
  },
  updateMessage: {
    id: 'deployments.data_ingest.update.message',
    defaultMessage: 'Deployment Updated',
  },
});

// DataIngest page components

export function DataIngest(): JSX.Element {
  const intl = useIntl();
  const { selectedDeployment } = useContext(SelectedEntityContext);
  const {
    isDuplicateFieldAlert,
    isUserRequiredAlert,
    isEmptyConfigAlert,
    ingestUserField,
    setIngestUserField,
    updatingDeployment,
    isIngestAllFields,
    setIsIngestAllFields,
    updatingSection,
    setUpdatingSection,
    onUpdateSubmit,
    cleanup,
    isHasWriteAccess,
  } = useContext(DeploymentContext);
  const { setSuccessNotification } = useContext(NotificationContext);

  const ingestToggle = (
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
        <FormattedMessage id="deployments.data_ingest.toggle" defaultMessage="Ingest All Fields" />
      </MDTypography>
    </MDBox>
  );

  const body = (
    <MDBox alignItems="center" px={3}>
      {selectedDeployment?.attributes?.config ? (
        <>
          {!updatingDeployment || !(updatingSection === 'dataIngest') ? (
            <>
              <MDBox my={1} lineHeight={1}>
                <MDBox component="li" display="flex" alignItems="center" py={1} mb={1}>
                  {/* <MDBox mr={2}>
                      <MDAvatar bgColor="info" alt="something here" shadow="md">
                        <Icon fontSize="medium">person</Icon>
                      </MDAvatar>
                    </MDBox> */}
                  <QuickInfoActionCard
                    name="User Field"
                    description={
                      selectedDeployment?.attributes?.config?.user_field ||
                      intl.formatMessage(messages.none)
                    }
                    image={<Icon fontSize="medium">person</Icon>}
                    color={'info'}
                    descriptionWeight="light"
                  />
                  {/* <UserFieldDropdown /> */}
                </MDBox>
              </MDBox>
              <MDBox my={1} lineHeight={1}>
                <MDBox component="li" display="flex" alignItems="center" py={1} mb={1}>
                  {/* <MDBox mr={2}>
                      <MDAvatar bgColor="info" alt="something here" shadow="md">
                        <Icon fontSize="medium">lock</Icon>
                      </MDAvatar>
                    </MDBox> */}
                  {/* <PrivateFieldsDropdown /> */}

                  <QuickInfoActionCard
                    name="Private Fields"
                    description={
                      selectedDeployment?.attributes?.config?.private_fields?.length
                        ? selectedDeployment?.attributes?.config?.private_fields?.map((field) => {
                            return field.name;
                          })
                        : intl.formatMessage(messages.none)
                    }
                    descriptionIcon="horizontal_rule"
                    image={<Icon fontSize="medium">lock</Icon>}
                    color={'info'}
                    descriptionWeight="light"
                  />
                </MDBox>
              </MDBox>
              <MDBox my={1} lineHeight={1}>
                <QuickInfoActionCard
                  name="Anon Fields"
                  description={
                    selectedDeployment?.attributes?.config?.fields?.length
                      ? selectedDeployment?.attributes?.config?.fields?.map((field) => {
                          return field.name;
                        })
                      : intl.formatMessage(messages.none)
                  }
                  image={<Icon fontSize="medium">web</Icon>}
                  color={'info'}
                  descriptionIcon="horizontal_rule"
                  descriptionWeight="light"
                  // onClick={() => setIsEditingFields(true)}
                  // isDisabled={isEditingUserField || isEditingPrivateFields}
                />
              </MDBox>
            </>
          ) : (
            <>
              <MDBox mt={2}>
                {!isIngestAllFields && (
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <IngestPrivateFieldsInput />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                        <Tooltip
                          title={intl.formatMessage(messages.descriptionTooltip)}
                          placement="bottom"
                        >
                          <MDTypography color="text" variant="body2" fontWeight="regular">
                            {'Click ('}
                            {
                              <Icon
                                sx={{ verticalAlign: 'text-bottom' }}
                                color="info"
                                fontSize="small"
                              >
                                person
                              </Icon>
                            }
                            {') '}
                            <FormattedMessage
                              id="deployments.data_ingest.to_define"
                              defaultMessage="to define which field is the User ID Field."
                            />
                          </MDTypography>
                        </Tooltip>
                      </MDBox>
                    )}

                    {isIngestAllFields && (
                      <FormField
                        type="text"
                        label={intl.formatMessage(messages.formLabel)}
                        value={ingestUserField}
                        onChange={(e: InputEvent) => setIngestUserField(e.target.value)}
                      />
                    )}

                    {isIngestAllFields && !ingestUserField && (
                      <MDBox display="flex" justifyContent="center">
                        <MDTypography color="error" variant="body2" fontWeight="regular" mr={1}>
                          *
                        </MDTypography>
                        <Tooltip
                          title={intl.formatMessage(messages.descriptionTooltip)}
                          placement="bottom"
                        >
                          <MDTypography color="text" variant="body2" fontWeight="regular">
                            <FormattedMessage
                              id="deployments.data_ingest.uuid_required"
                              defaultMessage="Naming a User ID Field is required."
                            />
                          </MDTypography>
                        </Tooltip>
                      </MDBox>
                    )}

                    {/* Tests to see if there is no checkbox and is dirty. */}
                    {isDuplicateFieldAlert && (
                      <MDTypography color="error" variant="body2" fontWeight="regular">
                        {'* '}{' '}
                        <FormattedMessage
                          id="deployments.data_ingest.duplicate_field"
                          defaultMessage="Duplicate field found between anon and private fields..."
                        />
                      </MDTypography>
                    )}
                  </MDBox>
                </MDBox>
              </MDBox>
              {!isIngestAllFields && (
                <>
                  <Divider />
                  <OptInFlags />
                </>
              )}
            </>
          )}
        </>
      ) : (
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="button" fontWeight="light" color="text">
            <FormattedMessage
              id="deployments.data_ingest.no_configurations"
              defaultMessage="No Data Configurations"
            />
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );

  const onClickSaveDeployment = () => {
    onUpdateSubmit();
    setSuccessNotification({
      title: intl.formatMessage(messages.success),
      message: intl.formatMessage(messages.updateMessage),
    });
  };

  const onClickCancel = () => {
    setUpdatingSection(undefined);
    cleanup();
  };

  return updatingDeployment && updatingSection ? (
    updatingSection === 'dataIngest' ? (
      <InfoCard
        title={intl.formatMessage(messages.title)}
        icon="data_object"
        description={updatingDeployment && ingestToggle}
        value={body}
        // menuIconRightFontWeight={400}
        menuIconRight="cancel"
        menuIconRightColor="error"
        onClickRight={onClickCancel}
        menuIconLeftFontWeight={400}
        menuIconLeft="check_circle"
        menuIconLeftColor="success"
        onClickLeft={!isUserRequiredAlert && !isEmptyConfigAlert && onClickSaveDeployment}
      />
    ) : (
      <InfoCard title={intl.formatMessage(messages.title)} icon="data_object" value={body} />
    )
  ) : (
    <InfoCard
      title={intl.formatMessage(messages.title)}
      icon="data_object"
      // description={updatingDeployment && ingestToggle}
      value={body}
      menuIconRightFontWeight={400}
      menuIconRight="edit"
      onClickRight={isHasWriteAccess ? () => setUpdatingSection('dataIngest') : undefined}
      menuIconLeftFontWeight={400}
    />
  );
}
