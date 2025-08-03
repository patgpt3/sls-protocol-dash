// @mui material components
import { Grid } from '@mui/material';

import { MDBox, MDTypography } from 'components';
import { FormattedMessage } from 'utils';

// DataRules page components

export function DataRules(): JSX.Element {
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={7}>
        <MDBox mb={1}>
          <MDTypography variant="h5">
            <FormattedMessage
              id="deployments.data_rules.title"
              defaultMessage="Data Rules (Smart Contracts)"
            />
          </MDTypography>
        </MDBox>
        <MDBox mb={2}>
          <MDTypography variant="body2" color="text">
            <FormattedMessage
              id="deployments.data_rules.body"
              defaultMessage="To start this will probably be something basic. Longer term will probably be a library you can pick and choose from. For MVP it probably lists a few standard smart contracts we have like Opt-in, 3rd party data sharing. We'd then need to define what fields are used as inputs like location and opt-in flag."
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
