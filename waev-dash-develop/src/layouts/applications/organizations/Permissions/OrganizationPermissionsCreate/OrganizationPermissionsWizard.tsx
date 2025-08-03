/* eslint-disable no-empty-pattern */
// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Waev Dashboard components
import { MDBox, MDTypography, MDButton } from 'components';
import { PermissionContext } from 'contexts';
import { useContext, useState } from 'hooks';

// Wizard page components
import { UserInfo, OrganizationPermissions } from './steps';

function getSteps (): string[] {
  return ['User Information', 'Permissions'];
}

function getStepContent (stepIndex: number): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <UserInfo />;
    case 1:
      return <OrganizationPermissions />;
    default:
      return null;
  }
}

interface OrganizationPermissionsWizardProps {
  // onCancel?: () => void;
}

export function OrganizationPermissionsWizard ({}: OrganizationPermissionsWizardProps): JSX.Element {
  const { createOrganizationPermission, isLoadingPermissions, setAddingPermissionsType, cleanup } =
    useContext(PermissionContext);
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleSubmit = () => createOrganizationPermission();
  // const handleSubmit = () => noop();
  const handleCancel = () => {
    setAddingPermissionsType(undefined);
    cleanup();
  };

  return (
    <MDBox pb={8}>
      <Grid container justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={12} lg={8}>
          <MDBox mt={6} mb={8} textAlign="center">
            <MDBox mb={1}>
              <MDTypography variant="h3" fontWeight="bold">
                Enroll a User
              </MDTypography>
            </MDBox>
            <MDTypography variant="h5" fontWeight="regular" color="secondary">
              Just need some info...
            </MDTypography>
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
                {getStepContent(activeStep)}
                <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                  {activeStep === 0
                    ? (
                    <MDBox />
                      )
                    : (
                    <MDButton variant="gradient" color="dark" onClick={handleBack} sx={{ mr: 2 }}>
                      back
                    </MDButton>
                      )}{' '}
                  <MDButton
                    sx={{ mr: 'auto' }}
                    variant="gradient"
                    color="dark"
                    onClick={handleCancel}
                  >
                    Cancel
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={!isLastStep ? handleNext : handleSubmit}
                    disabled={!!isLoadingPermissions}

                    // display="flex"
                    // disabled={false}
                  >
                    {isLastStep ? (isLoadingPermissions ? 'processing...' : 'create') : 'next'}
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
