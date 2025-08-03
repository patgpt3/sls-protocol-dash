// @mui material components
import { Grid } from '@mui/material';

import { MDBox, MDTypography } from 'components';
import { FormattedMessage } from 'utils';

// DeploymentKeys page components

export function DeploymentKeys(): JSX.Element {
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={7}>
        <MDBox mb={1}>
          <MDTypography variant="h5">
            <FormattedMessage id="deployments.keys.title" defaultMessage="Keys / Access" />
          </MDTypography>
        </MDBox>
        <MDBox mb={2}>
          <MDTypography variant="body2" color="text">
            <FormattedMessage
              id="deployments.keys.body"
              defaultMessage="This is where keys can be created for internally at the client's company. Maybe this lists users associated with the company? Maybe it's an add access. For MVP these will be all or nothing. Do these even end up being keys actually shown in the UI or do we just custody?"
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
