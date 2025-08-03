// @mui material components
import { Icon, Tooltip } from '@mui/material';

// Waev Dashboard components
import { DataInfoActionCard, FlashingLoader, MDAvatar, MDBox, MDTypography } from 'components';
import { RecordContext, SelectedEntityContext } from 'contexts';
import { useContext, useListDeployments } from 'hooks';
import { FormattedMessage } from 'utils';
import { Organization } from 'types';

import colors from 'assets/theme/base/colors';

// Declaring prop types for the DeploymentsList
interface Props {
  org: Organization;
}

// Custom styles for DeploymentsList
export function DataDeploymentsList({ org }: Props): JSX.Element {
  const { setSelectedDeploymentId, setSelectedGroupId } = useContext(SelectedEntityContext);
  const { setSelectedEntity } = useContext(RecordContext);

  const { data: deployments, isLoading: isLoadingDeployments } = useListDeployments(org.id);

  return (
    <MDBox alignItems="center" mr={3}>
      <MDBox display="flex" alignItems="center" pl={2} pb={1}>
        {isLoadingDeployments || deployments?.length > 0 ? (
          <>
            <MDTypography variant="subtitle2" textTransform="capitalize" fontWeight="medium">
              <FormattedMessage id="deployments.list.title" defaultMessage="Deployments" />
            </MDTypography>
          </>
        ) : (
          <MDTypography
            sx={{
              ml: 3,
              opacity: '0.5',
            }}
            variant="subtitle2"
            textTransform="capitalize"
            fontWeight="medium"
          >
            <FormattedMessage id="deployments.list.placeholder" defaultMessage="No Deployments" />
          </MDTypography>
        )}
        {isLoadingDeployments && (
          <MDBox width="20%" marginLeft="auto">
            <FlashingLoader />
          </MDBox>
        )}
      </MDBox>
      <MDBox ml={3} mt={1}>
        {deployments &&
          !!deployments.length &&
          deployments.map((deploymentData, i) => {
            const avatar = (
              <MDAvatar bgColor="info" alt="something here" shadow="md">
                <Icon fontSize="medium">rocket-launch</Icon>
              </MDAvatar>
            );

            const isDisabled = deploymentData.attributes.status !== 'complete';
            const status = () => {
              switch (deploymentData.attributes.status) {
                case 'processing':
                  return { title: 'This Deployment is still pending', color: colors.warning.main };
                case 'pending':
                  return {
                    title: 'This Deployment is still processing',
                    color: colors.warning.main,
                  };

                case 'failed':
                  return { title: 'This Deployment has failed.', color: colors.error.main };

                default:
                  return {};
              }
            };

            const name = (
              <MDBox display="flex">
                <MDTypography variant="button" fontWeight="medium" data-testid="quick-info-name">
                  {deploymentData.attributes.name}
                </MDTypography>
                {isDisabled && (
                  <MDBox display="flex" sx={{ verticalAlign: 'middle' }}>
                    <Tooltip title={status().title} placement="top">
                      <Icon
                        sx={{
                          ml: 1,
                          color: status().color,
                        }}
                      >
                        error
                      </Icon>
                    </Tooltip>
                  </MDBox>
                )}
              </MDBox>
            );

            return (
              <DataInfoActionCard
                name={name}
                image={avatar}
                color={'info'}
                isDisabled={isDisabled}
                onClick={() => {
                  const validDeployments = (deployments || []).filter(
                    (dep) => dep?.attributes?.status === 'complete'
                  );
                  const validDep = validDeployments.find((dep) => dep.id === deploymentData.id);
                  validDep && setSelectedDeploymentId(deploymentData.id);
                  setSelectedEntity(deploymentData);
                  setSelectedGroupId(undefined);
                }}
                label={
                  <MDTypography variant="h4" fontWeight="large" color="info" sx={{ mt: '10px' }}>
                    <Icon fontSize="large" color="info">
                      chevron_right_rounded
                    </Icon>
                  </MDTypography>
                }
                index={`DeploymentData-${i}`}
                key={`DeploymentData-${i}`}
              />
            );
          })}
      </MDBox>
    </MDBox>
  );
}
