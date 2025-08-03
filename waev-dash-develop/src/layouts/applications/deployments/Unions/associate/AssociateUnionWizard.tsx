// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { MDBox, MDTypography, MDButton } from 'components';
import { UnionContext, DeploymentContext } from 'contexts';
import { useContext, useState } from 'hooks';
import { UnionsStep, ConsentsStep, PrivilegesStep } from './steps';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  create: {
    id: 'unions.create_union_wizard.button.create',
    defaultMessage: 'create',
  },
  cancel: {
    id: 'unions.create_union_wizard.button.cancel',
    defaultMessage: 'cancel',
  },
  next: {
    id: 'unions.create_union_wizard.button.next',
    defaultMessage: 'next',
  },
  back: {
    id: 'unions.create_union_wizard.button.back',
    defaultMessage: 'back',
  },
});

function getSteps(): string[] {
  return ['Data Union', 'Consents', 'Privileges'];
}

function getStepContent(stepIndex: number): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <UnionsStep />;
    case 1:
      return <ConsentsStep />;
    case 2:
      return <PrivilegesStep />;
    default:
      return <UnionsStep />;
  }
}

interface AssociateUnionWizardProps {
  onCancel?: () => void;
}

export function AssociateUnionWizard({ onCancel }: AssociateUnionWizardProps): JSX.Element {
  const intl = useIntl();
  const { associatedUnion, setAssociatedUnion, createUnionDeployment, partsList } =
    useContext(UnionContext);
  const { setIsAssociatingUnion } = useContext(DeploymentContext);

  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  const handleSubmit = () => {
    createUnionDeployment();
    setAssociatedUnion(undefined);
    setIsAssociatingUnion(false);
  };

  const handleCancel = () => {
    setAssociatedUnion(undefined);
    onCancel();
  };

  return (
    <MDBox pb={8}>
      <Grid container justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={12} lg={8}>
          <MDBox mt={6} mb={8} textAlign="center">
            <MDBox mb={1}>
              <MDTypography variant="h3" fontWeight="bold">
                <FormattedMessage
                  id="deployments.unions.associate_union_wizard.explanation"
                  defaultMessage="Share with a Data Union"
                />
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
                {getStepContent(activeStep)}
                <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                  {activeStep === 0 ? (
                    <MDBox />
                  ) : (
                    <MDButton variant="gradient" color="dark" sx={{ mr: 2 }} onClick={handleBack}>
                      {intl.formatMessage(messages.back)}
                    </MDButton>
                  )}{' '}
                  {onCancel && (
                    <MDButton
                      sx={{ mr: 'auto' }}
                      variant="gradient"
                      color="dark"
                      onClick={handleCancel}
                    >
                      {intl.formatMessage(messages.cancel)}
                    </MDButton>
                  )}
                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={!isLastStep ? handleNext : handleSubmit}
                    disabled={
                      associatedUnion === undefined || (isLastStep && partsList.length === 0)
                    }
                  >
                    {isLastStep
                      ? intl.formatMessage(messages.create)
                      : intl.formatMessage(messages.next)}
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
