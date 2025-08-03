// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { MDBox, MDTypography, MDButton } from 'components';
import { UnionContext } from 'contexts';
import { useContext, useState } from 'hooks';
import { NameStep } from './steps';
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
  processing: {
    id: 'unions.create_union_wizard.button.processing',
    defaultMessage: 'processing...',
  },
});

function getSteps(): string[] {
  return ['Name'];
}

function getStepContent(
  stepIndex: number,
  unionNameInput: string,
  setUnionNameInput: any
): JSX.Element {
  switch (stepIndex) {
    case 0:
      return <NameStep unionNameInput={unionNameInput} setUnionNameInput={setUnionNameInput} />;
    default:
      return <NameStep unionNameInput={unionNameInput} setUnionNameInput={setUnionNameInput} />;
  }
}

interface CreateUnionWizardProps {
  sx?: any;
}

export function CreateUnionWizard({ sx }: CreateUnionWizardProps): JSX.Element {
  const intl = useIntl();
  const { isLoadingUnion, unionNameInput, setUnionNameInput, setIsAddingUnion, createUnion } =
    useContext(UnionContext);

  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = getSteps();
  const isLastStep: boolean = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);

  const handleSubmit = () => {
    createUnion();
    setIsAddingUnion(false);
    setUnionNameInput('');
  };

  const handleCancel = () => {
    setIsAddingUnion(false);
    setUnionNameInput('');
  };

  return (
    <MDBox pb={8}>
      <Grid container justifyContent="center" sx={{ my: 4 }}>
        <Grid item xs={12} lg={8}>
          <MDBox mt={6} mb={8} textAlign="center">
            <MDBox mb={1}>
              <MDTypography variant="h3" fontWeight="bold">
                <FormattedMessage
                  id="unions.create_union_wizard.explanation"
                  defaultMessage="Create a Data Union"
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
                {getStepContent(activeStep, unionNameInput, setUnionNameInput)}
                <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                  <MDButton
                    sx={{ mr: 'auto' }}
                    variant="gradient"
                    color="dark"
                    onClick={handleCancel}
                  >
                    {intl.formatMessage(messages.cancel)}
                  </MDButton>
                  <MDBox>
                    <MDButton
                      variant="gradient"
                      color="dark"
                      onClick={isLastStep ? handleSubmit : handleNext}
                      disabled={unionNameInput === ''}
                    >
                      {isLoadingUnion
                        ? intl.formatMessage(messages.processing)
                        : intl.formatMessage(messages.create)}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}
