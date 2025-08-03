// @mui material components
import Grid from '@mui/material/Grid';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';

// Wizard application components
import { FormField } from 'components';
import { InputEvent } from 'types';
import { GroupContext } from 'contexts';
import { useContext } from 'react';

export function Name(): JSX.Element {
  const { groupNameInput, setGroupNameInput } = useContext(GroupContext);

  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            Let&apos;s start with the basic information
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          What's the name of the Group?
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={8}>
            <MDBox mb={2}>
              <FormField
                type="text"
                label="Group Name"
                value={groupNameInput}
                onChange={(e: InputEvent) => setGroupNameInput(e.target.value)}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}
