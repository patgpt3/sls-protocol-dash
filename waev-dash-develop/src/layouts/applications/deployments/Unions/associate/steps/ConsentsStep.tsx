import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';
import { UnionContext, OptInFlagContext } from 'contexts';
import { useContext } from 'hooks';
import { FlagsSelector } from '../FlagsSelector';
import { FormattedMessage } from 'utils';

export function ConsentsStep(): JSX.Element {
  const { consentFlagsInput } = useContext(UnionContext);
  const { optInFlags } = useContext(OptInFlagContext);

  return (
    <MDBox>
      {optInFlags.length !== 0 && (
        <>
          <MDBox width="82%" textAlign="center" mx="auto" my={4}>
            <MDBox mb={1}>
              <MDTypography variant="h5" fontWeight="regular">
                <FormattedMessage
                  id="deployments.unions.consents_step.title"
                  defaultMessage="Add some consents!"
                />
              </MDTypography>
            </MDBox>
            <MDTypography variant="body2" color="text">
              <FormattedMessage
                id="deployments.unions.consents_step.body"
                defaultMessage="Select all consents required to access the data."
              />
            </MDTypography>
          </MDBox>
          <MDBox mt={2}>
            <MDBox ml="39%">
              <FlagsSelector />
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
                <FormattedMessage
                  id="deployments.unions.consents_step.description"
                  defaultMessage="If no consents are selected, this Data Union will have access to all records in the
                deployment by default."
                />
              </MDTypography>
            </MDBox>
          )
        ) : (
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            my={4}
            px={4}
          >
            <MDBox>
              <MDTypography color="error" variant="body2" fontWeight="regular">
                <FormattedMessage
                  id="deployments.unions.consents_step.warning"
                  defaultMessage="WARNING"
                />
                {':'}
              </MDTypography>
              <MDTypography variant="body2" color="text" mr={2}>
                <FormattedMessage
                  id="deployments.unions.consents_step.validation"
                  defaultMessage="There are no consent flags created, so this Data Union will have access to all records in the deployment by default."
                />
              </MDTypography>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}
