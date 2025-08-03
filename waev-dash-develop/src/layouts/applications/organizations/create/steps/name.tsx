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
import { FormField } from 'components';
import { InputEvent } from 'types';

// Images
// import team2 from "example-assets/images/team-2.jpg";
interface Props {
  setOrgNameInput?: any;
  orgNameInput?: string;
}
export function Name({ setOrgNameInput, orgNameInput }: Props): JSX.Element {

  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            Let&apos;s start with the basic information
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          What's the name of the Organization?
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        <Grid container spacing={3} justifyContent="center">
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
              <FormField
                type="text"
                label="Organization Name"
                value={orgNameInput}
                onChange={(e: InputEvent) => setOrgNameInput(e.target.value)}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}
