// @mui material components
import { Grid } from '@mui/material';

// Waev Dashboard components
import { MDBox, MDTypography } from 'components';

import { OptInFlags } from '../../OptInFlags';
import { DeploymentContext, OptInFlagContextProvider } from 'contexts';
import { useContext } from 'react';
import { FormattedMessage } from 'utils';

export function OptInFlagsStep(): JSX.Element {
  const { isDuplicateFieldAlert, isIngestAllFields } = useContext(DeploymentContext);

  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            <FormattedMessage
              id="deployments.opt-in_flags.step.title"
              defaultMessage="Opt-In Fields"
            />
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          <FormattedMessage
            id="deployments.opt-in_flags.step.body"
            defaultMessage="(Yup. You can do this later too.)"
          />
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        {!isIngestAllFields && (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={12}>
              <OptInFlagContextProvider>
                <OptInFlags />
              </OptInFlagContextProvider>
            </Grid>
          </Grid>
        )}

        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            {isDuplicateFieldAlert && (
              <MDTypography color="error" variant="body2" fontWeight="regular">
                {'* '}
                <FormattedMessage
                  id="deployments.opt-in_flags.step.duplicate"
                  defaultMessage="Duplicate field found between anon and private fields..."
                />
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
