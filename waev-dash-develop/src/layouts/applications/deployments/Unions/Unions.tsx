import { FlashingLoader, MDBox, MDTypography } from 'components';
import { UnionContext } from 'contexts';
import { useContext } from 'react';
import { DeploymentUnionList } from './DeploymentUnionList';
import { FormattedMessage } from 'utils';

export function Unions(): JSX.Element {
  const { deploymentUnions, isLoadingDeploymentUnions } = useContext(UnionContext);

  return isLoadingDeploymentUnions ? (
    <MDBox width="100%">
      <FlashingLoader />
    </MDBox>
  ) : (
    <>
      {deploymentUnions?.length ? (
        <DeploymentUnionList unions={deploymentUnions} />
      ) : (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          <MDTypography variant="button" fontWeight="light" color="text" justifyContent="center">
            <FormattedMessage
              id="deployments.unions.placeholder"
              defaultMessage="Not Shared With Any Data Union"
            />
          </MDTypography>
        </MDBox>
      )}
    </>
  );
}
