import { Grid } from '@mui/material';
import { MDBox, MDTypography } from 'components';
import { FormattedMessage } from 'utils';
import { SelectUnion } from '../SelectUnion';

export function UnionsStep(): JSX.Element {
  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="body2" color="text">
            <FormattedMessage
              id="deployments.unions_step.title"
              defaultMessage="Select a Data Union to share data with."
            />
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={2}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6}>
            <SelectUnion />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}
