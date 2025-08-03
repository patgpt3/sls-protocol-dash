// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Waev Dashboard components
import { MDBox, MDTypography, MDButton } from 'components';
import { OrganizationContext } from 'contexts';
import { useContext, useState, useCreateOrganization } from 'hooks';

// Wizard page components
import { Name } from './steps';

function getSteps(): string[] {
  return ['Name'];
}

function getStepContent(
  stepIndex: number,
  orgNameInput: string,
  setOrgNameInput: any
): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <Name orgNameInput={orgNameInput} setOrgNameInput={setOrgNameInput} />;
    // case 2:
    //   return <DataIngest />;
    // case 3:
    //   return <DataRules />;
    // case 4:
    //   return <Keys />;
    // case 4:
    //   return <API />;
    default:
      return null;
  }
}

interface OrganizationsWizardProps {
  onCancel?: () => void;
}

export function OrganizationsWizard({ onCancel }: OrganizationsWizardProps): JSX.Element {
  const {
    isLoadingOrganization,
    setOrgNameInput: setOrgNameInputContext,
    setIsAddingOrg,
  } = useContext(OrganizationContext);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [orgNameInput, setOrgNameInput] = useState<string>('');

  const { mutate: createOrganization } = useCreateOrganization(orgNameInput);

  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleSubmit = () => {
    setOrgNameInputContext(orgNameInput);
    createOrganization();
    setIsAddingOrg(false);
  };
  const handleCancel = () => onCancel();

  return (
    <MDBox pb={8}>
      <Grid container justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={12} lg={8}>
          <MDBox mt={6} mb={8} textAlign="center">
            <MDBox mb={1}>
              <MDTypography variant="h3" fontWeight="bold">
                Create an Organization
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
                {getStepContent(activeStep, orgNameInput, setOrgNameInput)}
                <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                  {activeStep === 0 ? (
                    <MDBox />
                  ) : (
                    <MDButton variant="outlined" color="dark" onClick={handleBack}>
                      back
                    </MDButton>
                  )}{' '}
                  {onCancel && (
                    <MDButton
                      sx={{ mr: 'auto' }}
                      variant="gradient"
                      color="dark"
                      onClick={handleCancel}
                    >
                      Cancel
                    </MDButton>
                  )}
                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={!isLastStep ? handleNext : handleSubmit}
                    disabled={!!isLoadingOrganization}

                    // display="flex"
                    // disabled={false}
                  >
                    {isLastStep
                      ? isLoadingOrganization
                        ? // ? false
                          'processing...'
                        : 'create'
                      : 'next'}
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
