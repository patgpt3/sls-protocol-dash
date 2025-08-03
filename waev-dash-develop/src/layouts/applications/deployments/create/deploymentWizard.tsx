import { useContext, useState } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDButton from 'components/Elements/MDButton';

// Wizard page components
import {
  NameStep,
  DataIngestStep,
  // OptInFlagsStep,
  //  DataRules
} from './steps';
import { defineMessages, useIntl } from 'utils';
import { DeploymentContext, TourContext } from 'contexts';
// import { TourPopper } from 'components';

const messages = defineMessages({
  create: {
    id: 'deployments.wizard.button.create',
    defaultMessage: 'create',
  },
  cancel: {
    id: 'deployments.wizard.button.cancel',
    defaultMessage: 'cancel',
  },
  next: {
    id: 'deployments.wizard.button.next',
    defaultMessage: 'next',
  },
  back: {
    id: 'deployments.wizard.button.back',
    defaultMessage: 'back',
  },
});

interface DeploymentWizardProps {
  onCancel: () => void;
}

function getSteps(): string[] {
  return ['Name', 'Data Ingest'];
}

function getStepContent(stepIndex: number): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <NameStep />;
    case 1:
      return <DataIngestStep />;
    // case 3:
    //   return <OptInFlagsStep />;
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

export function DeploymentWizard({ onCancel }: DeploymentWizardProps): JSX.Element {
  const intl = useIntl();
  const {
    createDeployment,
    setIsAddingDeployment,
    ingestUserField,
    deploymentNameInput,
    setDeploymentNameInput,
  } = useContext(DeploymentContext);
  const { defaultFlags } = useContext(TourContext);
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleSubmit = () => {
    setIsAddingDeployment(false);
    createDeployment();
    setDeploymentNameInput('');
  };
  const handleCancel = () => {
    onCancel();
    setDeploymentNameInput('');
  };

  const isNextDisabled =
    (isLastStep && !ingestUserField) ||
    deploymentNameInput?.length < 1 ||
    deploymentNameInput === '';

  return (
    <MDBox>
      {/* <TourPopper
        isEnabled={defaultFlags.isHandhold && activeStep === 1}
        open={defaultFlags.isHandhold}
        horizontalOffset={0}
        verticalOffset={0}
        arrowOffset={355}
        placement="top"
        isHideArrow={true}
        message={
          'List Fields with PII on the Left and Fields with Non-Private Information on the Right. Click + to Add'
        }
        elementId={'dataIngestTag'}
      /> */}
      <Grid container justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={12} lg={8} mt={6}>
          {/* <MDBox mt={6} mb={8} textAlign="center">
            <MDBox mb={1}>
              <MDTypography variant="h3" fontWeight="bold">
                Create a Deployment
              </MDTypography>
            </MDBox>
            <MDTypography variant="h5" fontWeight="regular" color="secondary">
              Just need some info...
            </MDTypography>
          </MDBox> */}
          <Card id="dataIngestTag">
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
                  <MDButton variant="gradient" color="dark" onClick={handleCancel}>
                    cancel
                  </MDButton>
                  {activeStep === 0 ? (
                    <MDBox>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        onClick={!isLastStep ? handleNext : undefined}
                        disabled={isNextDisabled}
                      >
                        {isLastStep
                          ? intl.formatMessage(messages.create)
                          : intl.formatMessage(messages.next)}
                      </MDButton>
                    </MDBox>
                  ) : (
                    <MDBox>
                      <MDButton variant="gradient" color="dark" onClick={handleBack} sx={{ mr: 2 }}>
                        {intl.formatMessage(messages.back)}
                      </MDButton>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        disabled={isNextDisabled}
                        onClick={!isLastStep ? handleNext : handleSubmit}
                      >
                        {isLastStep
                          ? intl.formatMessage(messages.create)
                          : intl.formatMessage(messages.next)}
                      </MDButton>
                    </MDBox>
                  )}
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}
