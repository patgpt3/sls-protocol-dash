import { useContext } from 'react';
// @mui material components
import Grid from '@mui/material/Grid';
// import Icon from "@mui/material/Icon";
// import Tooltip from "@mui/material/Tooltip";

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
import { DeploymentContext } from 'contexts';

// Wizard application components
import { FormField } from 'components/FormField';
import { InputEvent } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  deploymentName: {
    id: 'deployments.wizard.name_step.label',
    defaultMessage: 'Deployment Name',
  },
});

export function NameStep(): JSX.Element {
  const intl = useIntl();
  const { deploymentNameInput, setDeploymentNameInput } = useContext(DeploymentContext);

  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            <FormattedMessage
              id="deployments.wizard.name_step.title"
              defaultMessage="Let's start with the basic information"
            />
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          <FormattedMessage
            id="deployments.wizard.name_step.body"
            defaultMessage="What's the name of the Deployment?"
          />
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={8}>
            <MDBox mb={2}>
              <FormField
                type="text"
                label={intl.formatMessage(messages.deploymentName)}
                value={deploymentNameInput}
                onChange={(e: InputEvent) => setDeploymentNameInput(e.target.value)}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}
