// @mui material components
import Grid from '@mui/material/Grid';
// import Icon from "@mui/material/Icon";
// import Tooltip from "@mui/material/Tooltip";

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
// import MDAvatar from "components/MDAvatar";
// import MDButton from "components/MDButton";

// Wizard application components
import { FormField } from 'components/FormField';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  deploymentName: {
    id: 'deployments.data_rules.step.name',
    defaultMessage: 'Deployment Name',
  },
});

// Images
// import team2 from "assets/images/team-2.jpg";

export function DataRulesStep(): JSX.Element {
  const intl = useIntl();
  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            <FormattedMessage
              id="deployments.data_rules.step.title"
              defaultMessage="Let's start with the basic information"
            />
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          <FormattedMessage
            id="deployments.data_rules.step.body"
            defaultMessage="What's the name of the Deployment?"
          />
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={4} container justifyContent="center">
            <MDBox position="relative" height="max-content" mx="auto">
              <MDAvatar src={team2} alt="profile picture" size="xxl" variant="rounded" />
              <MDBox alt="spotify logo" position="absolute" right={0} bottom={0} mr={-1} mb={-1}>
                <Tooltip title="Edit" placement="top">
                  <MDButton variant="gradient" color="info" size="small" iconOnly>
                    <Icon>edit</Icon>
                  </MDButton>
                </Tooltip>
              </MDBox>
            </MDBox>
          </Grid> */}
          <Grid item xs={12} sm={8}>
            <MDBox mb={2}>
              <FormField type="text" label={intl.formatMessage(messages.deploymentName)} />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}
