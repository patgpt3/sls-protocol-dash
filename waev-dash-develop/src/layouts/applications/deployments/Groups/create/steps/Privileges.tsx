import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
import { GroupContext } from 'contexts';
import { useContext } from 'react';

import { GroupAccessesSelector } from '../groupsAccessSelector';

export function Privileges(): JSX.Element {
  const { isAnonFieldAccessInput, isMetaAccessInput, isPIIFieldAccessInput } =
    useContext(GroupContext);

  return (
    <MDBox>
      <MDBox width="82%" textAlign="center" mx="auto" my={4}>
        <MDBox mb={1}>
          <MDTypography variant="h5" fontWeight="regular">
            Add some data!
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text">
          What data do you want this Group to have access to?
        </MDTypography>
      </MDBox>
      <MDBox mt={2}>
        <MDBox ml="39%">
          <GroupAccessesSelector />
        </MDBox>
      </MDBox>
      {/* @ts-ignore */}
      <MDBox justifyContent={'center'} textAlign={'-webkit-center'}>
        {!isAnonFieldAccessInput && !isMetaAccessInput && !isPIIFieldAccessInput && (
          <MDBox display="flex" pt={4} maxWidth="65%" justifyContent={'center'} textAlign="center">
            <MDTypography color="error" variant="body2" fontWeight="regular" mr={1}>
              *
            </MDTypography>
            <MDTypography color="text" variant="body2" fontWeight="regular">
              If no data catagories are selected, this group will have not have access to any data.
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}
