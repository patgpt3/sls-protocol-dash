import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
import { GroupContext, OptInFlagContext } from 'contexts';
import { useContext } from 'hooks';

import { GroupSelector } from '../groupsSelector';

export function Fields(): JSX.Element {
  const { consentFlagsInput } = useContext(GroupContext);
  const { optInFlags } = useContext(OptInFlagContext);

  return (
    <MDBox>
      {optInFlags.length !== 0 && (
        <>
          <MDBox width="82%" textAlign="center" mx="auto" my={4}>
            <MDBox mb={1}>
              <MDTypography variant="h5" fontWeight="regular">
                Add some consents!
              </MDTypography>
            </MDBox>
            <MDTypography variant="body2" color="text">
              Select All Consents Required to Access the Data
            </MDTypography>
          </MDBox>
          <MDBox mt={2}>
            <MDBox ml="39%">
              <GroupSelector />
            </MDBox>
          </MDBox>
        </>
      )}
      {/* @ts-ignore */}
      <MDBox justifyContent={'center'} textAlign={'-webkit-center'}>
        {optInFlags.length !== 0 ? (
          consentFlagsInput.length === 0 && (
            <MDBox
              display="flex"
              pt={4}
              maxWidth="65%"
              justifyContent={'center'}
              textAlign="center"
            >
              <MDTypography color="error" variant="body2" fontWeight="regular" mr={1}>
                *
              </MDTypography>
              <MDTypography color="text" variant="body2" fontWeight="regular">
                If no consents are selected, this group will have access to all records in the
                deployment by default.
              </MDTypography>
            </MDBox>
          )
        ) : (
          <MDBox display="flex" alignItems="center" my={4} px={4}>
            <MDBox>
              <MDTypography color="error" variant="body2" fontWeight="regular">
                WARNING:
              </MDTypography>
              <MDTypography variant="body2" color="text" mr={2}>
                {`There are no consent flags created, so this group will have access to all records in the deployment by default.`}
              </MDTypography>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}
