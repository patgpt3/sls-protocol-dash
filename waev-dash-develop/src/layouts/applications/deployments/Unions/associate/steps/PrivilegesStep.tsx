import { MDBox, MDTypography } from 'components';
import { PartsSelector } from '../PartsSelector';
import { FormattedMessage } from 'utils';

export function PrivilegesStep(): JSX.Element {
  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            <FormattedMessage
              id="deployments.unions.privileges_step.add"
              defaultMessage="Add some data!"
            />
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          <FormattedMessage
            id="deployments.unions.privileges_step.description"
            defaultMessage="What data do you want this Data Union to have access to?"
          />
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        <MDBox ml="39%">
          <PartsSelector />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
