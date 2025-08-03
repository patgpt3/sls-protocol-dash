import { capitalize } from '@mui/material';
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';

import { PermissionsSelector } from 'layouts';
import { EntityTypes } from 'types';

interface PermissionsStepProps {
  entityType: EntityTypes;
}

export function PermissionsStep({ entityType }: PermissionsStepProps): JSX.Element {
  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            Add some permissions!
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          What do you want this user to have access to?
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        <MDBox ml="39%">
          <PermissionsSelector permissionType={capitalize(entityType)} />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
