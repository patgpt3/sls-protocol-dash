// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Waev Dashboard components
import { MDBox, MDTypography, MDButton } from 'components';
import { DeploymentContext, GroupContext, SelectedEntityContext } from 'contexts';
import { useContext, useState, useListGroups } from 'hooks';

// Wizard page components
import { Name, Fields, Privileges } from './steps';

function getSteps(): string[] {
  return ['Name', 'Fields', 'Privileges'];
}

function getStepContent(stepIndex: number): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <Name />;
    case 1:
      return <Fields />;
    case 2:
      return <Privileges />;
    default:
      return null;
  }
}

interface GroupsWizardProps {
  onCancel?: () => void;
}

export function GroupsWizard({ onCancel }: GroupsWizardProps): JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);

  const { isLoadingGroup, createGroup, groupNameInput } = useContext(GroupContext);
  const { setIsAddingGroup } = useContext(DeploymentContext);
  const { selectedDeploymentId } = useContext(SelectedEntityContext);

  const { data: groups } = useListGroups(selectedDeploymentId);
  const isGroupsSameName = groups?.some((group) => group?.attributes?.name === groupNameInput);

  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleSubmit = () => {
    createGroup();
    setIsAddingGroup(false);
  };
  const handleCancel = () => onCancel();

  return (
    <MDBox pb={8}>
      <Grid container justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={12} lg={8}>
          <MDBox mt={6} mb={8} textAlign="center">
            <MDBox mb={1}>
              <MDTypography variant="h3" fontWeight="bold">
                Create a Group
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
                {isGroupsSameName && (
                  <MDTypography variant="body2" color="error" textAlign="center">
                    Group name already exists
                  </MDTypography>
                )}
                <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                  {activeStep === 0 ? (
                    <MDBox />
                  ) : (
                    <MDButton variant="gradient" color="dark" sx={{ mr: 2 }} onClick={handleBack}>
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
                    disabled={!groupNameInput || isGroupsSameName}
                  >
                    {isLastStep ? (isLoadingGroup ? 'processing...' : 'create') : 'next'}
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
