// @mui material components
import { Grid } from '@mui/material';

import { MDBox, MDTypography } from 'components';
import { FormattedMessage } from 'utils';

export function DeploymentCode(): JSX.Element {
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={7}>
        <MDBox mb={1}>
          <MDTypography variant="h5">
            <FormattedMessage id="deployments.code.title" defaultMessage="Code + API Endpoints" />
          </MDTypography>
        </MDBox>
        <MDBox mb={2}>
          <MDTypography variant="body2" color="text">
            <FormattedMessage
              id="deployments.code.body"
              defaultMessage="Display deployment code and endpoints."
            />
          </MDTypography>
        </MDBox>
      </Grid>
      <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
        {/* <MDButton variant="gradient" color="info" onClick={onClickAddOrg}>
        <Icon>add</Icon>&nbsp; Add New
      </MDButton> */}
      </Grid>
    </Grid>
  );
}
