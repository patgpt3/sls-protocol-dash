/* eslint-disable no-empty-pattern */
// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Waev Dashboard components
import { MDBox, MDTypography, MDButton, FormField } from 'components';
import { PermissionContext, CurrentUserContext } from 'contexts';
import { useContext, useState } from 'hooks';
import { InputEvent } from 'types';
import { defineMessages, useIntl } from 'utils';

function getSteps(): string[] {
  return ['User Information'];
}

interface UserUpdateWizardProps {
  // onCancel?: () => void;
}

const messages = defineMessages({
  title: {
    id: 'user.update.title',
    defaultMessage: 'Update User',
  },
  updateHeader: {
    id: 'user.update.header',
    defaultMessage: 'Update Your Name:',
  },
  firstNameLabel: {
    id: 'user.update.firstNameLabel',
    defaultMessage: 'First Name',
  },
  lastNameLabel: {
    id: 'user.update.lastNameLabel',
    defaultMessage: 'Last Name',
  },
  updateButton: {
    id: 'user.update.updateButton',
    defaultMessage: 'Update',
  },
  cancelButton: {
    id: 'user.update.cancelButton',
    defaultMessage: 'Cancel',
  },
});

export function UserUpdateWizard({}: UserUpdateWizardProps): JSX.Element {
  const { cleanup } = useContext(PermissionContext);
  const intl = useIntl();
  const {
    dataGetMe,
    firstNameInput,
    setFirstNameInput,
    lastNameInput,
    setLastNameInput,
    setUpdateUser,
    updateUserNames,
  } = useContext(CurrentUserContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeStep, _setActiveStep] = useState<number>(0);

  const steps = getSteps();

  const handleSubmit = () => updateUserNames();
  const handleCancel = () => {
    setUpdateUser(undefined);
    setFirstNameInput('');
    setLastNameInput('');
    cleanup();
  };

  return (
    <MDBox pb={8}>
      <Grid container justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={12} lg={8}>
          <MDBox mt={6} mb={8} textAlign="center">
            <MDBox mb={1}>
              <MDTypography variant="h3" fontWeight="bold">
                {intl.formatMessage(messages.title)}
              </MDTypography>
            </MDBox>
          </MDBox>
          <Card>
            <MDBox mt={-3} mx={2}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </MDBox>
            <MDBox p={2}>
              <MDBox>
                {
                  <MDBox>
                    <MDBox width="82%" textAlign="center" mx="auto" my={4}>
                      <MDBox mb={1}>
                        <MDTypography variant="h5" fontWeight="regular">
                          {intl.formatMessage(messages.updateHeader)}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <MDBox mt={2}>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={8}>
                          <MDBox mb={2}>
                            <FormField
                              type="text"
                              label={intl.formatMessage(messages.firstNameLabel)}
                              varient="outlined"
                              placeholder={dataGetMe.attributes.first_name}
                              value={firstNameInput}
                              onChange={(e: InputEvent) => setFirstNameInput(e.target.value)}
                            />
                          </MDBox>
                          <MDBox mb={2}>
                            <FormField
                              type="text"
                              label={intl.formatMessage(messages.lastNameLabel)}
                              value={lastNameInput}
                              placeholder={dataGetMe.attributes.last_name}
                              varient="outlined"
                              onChange={(e: InputEvent) => setLastNameInput(e.target.value)}
                            />
                          </MDBox>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </MDBox>
                }
                <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                  <MDButton
                    sx={{ mr: 'auto' }}
                    variant="gradient"
                    color="dark"
                    onClick={handleCancel}
                  >
                    {intl.formatMessage(messages.cancelButton)}
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={handleSubmit}
                    disabled={!(firstNameInput && lastNameInput)}
                  >
                    {intl.formatMessage(messages.updateButton)}
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}
