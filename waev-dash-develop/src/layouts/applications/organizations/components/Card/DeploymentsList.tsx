// @mui material components
import { Grid, Icon, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
// Waev Dashboard components
import {
  DataInfoActionCard,
  FlashingLoader,
  Fold,
  MDAvatar,
  MDBox,
  MDTypography,
} from 'components';
import { CurrentUserContext, DeploymentContext, SelectedEntityContext } from 'contexts';
import { useContext, useListDeployments, useMemo, useNavigate } from 'hooks';
import { Integration, Organization } from 'types';
import { isUserAllowed, defineMessages, useIntl } from 'utils';
import colors from 'assets/theme/base/colors';

const { info } = colors;

const messages = defineMessages({
  associatedDeployments: {
    id: 'settings.deployments_list.associated_deployments',
    defaultMessage: 'Associated Deployments',
  },
  deploymentsLink: {
    id: 'settings.deployments_list.deployments',
    defaultMessage: 'Deployments',
  },
  noDeployments1: {
    id: 'settings.deployments_list.no_deployments1',
    defaultMessage: 'You have no deployments. Go to the',
  },
  noDeployments2: {
    id: 'settings.deployments_list.no_deployments2',
    defaultMessage: 'page to create one.',
  },
});

// Declaring prop types for the DeploymentsList
interface Props {
  org: Organization;
}

// Custom styles for DeploymentsList
export function DeploymentsList({ org }: Props): JSX.Element {
  const intl = useIntl();
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedOrganization, setSelectedOrganizationId, setSelectedDeploymentId } =
    useContext(SelectedEntityContext);
  const { setIsAddingDeployment, setUpdatingOrganization: setUpdatingOrganizationForDeployment } =
    useContext(DeploymentContext);

  const { data: deployments, isLoading: isLoadingDeployments } = useListDeployments(org.id);
  const navigate = useNavigate();

  const onAddDeploymentClick = () => {
    setSelectedOrganizationId(org.id);
    setUpdatingOrganizationForDeployment(org);
    setIsAddingDeployment(true);
  };

  const isHasOwnerOrAdminAccess = useMemo(
    () =>
      isUserAllowed(selectedOrganization?.fullPermissions, currentUser.attributes.email, [
        'owner',
        'admin',
      ]),
    [selectedOrganization, org.id]
  );

  const onRouteClick = (deploymentId: string) => {
    setSelectedOrganizationId(org.id);
    const validDeployments = (deployments || []).filter(
      (dep) => dep?.attributes?.status === 'complete'
    );
    const validDep = validDeployments.find((dep) => dep.id === deploymentId);
    validDep && setSelectedDeploymentId(deploymentId);
    navigate('../deployments', { replace: true });
  };

  return (
    <MDBox alignItems="center" mr={3}>
      {isLoadingDeployments || deployments?.length > 0 ? (
        <Fold<Integration>
          storageKey="foldedDeployments"
          title={intl.formatMessage(messages.associatedDeployments)}
          item="standardWeb"
          contents={
            <MDBox ml={3} mt={3} mb={3}>
              <Grid container>
                {deployments &&
                  !!deployments.length &&
                  deployments.map((deploymentData, i) => {
                    const avatar = (
                      <MDAvatar
                        bgColor="info"
                        alt="something here"
                        shadow="md"
                        key={`DepIcon-${i}`}
                      >
                        <Icon fontSize="medium">rocket-launch</Icon>
                      </MDAvatar>
                    );

                    return (
                      <Grid item md={12} lg={6} key={`grid-${i}`} width="100%">
                        <MDBox px={1.5}>
                          <DataInfoActionCard
                            name={
                              deploymentData.attributes.status !== 'complete' ? (
                                <MDBox display="flex">
                                  <MDTypography
                                    variant="button"
                                    fontWeight="medium"
                                    data-testid="quick-info-name"
                                  >
                                    {deploymentData.attributes.name}
                                  </MDTypography>
                                  <Tooltip
                                    title={`This deployment is ${deploymentData.attributes.status}`}
                                    placement="top"
                                  >
                                    <Icon
                                      sx={{
                                        ml: 1,
                                        color:
                                          deploymentData.attributes.status !== 'failed'
                                            ? colors.warning.main
                                            : colors.error.main,
                                      }}
                                    >
                                      error
                                    </Icon>
                                  </Tooltip>
                                </MDBox>
                              ) : (
                                <MDBox display="flex">
                                  <MDTypography
                                    variant="button"
                                    fontWeight="medium"
                                    data-testid="quick-info-name"
                                  >
                                    {deploymentData.attributes.name}
                                  </MDTypography>
                                </MDBox>
                              )
                            }
                            image={avatar}
                            color={'info'}
                            isDisabled={deploymentData.attributes.status !== 'complete'}
                            onClick={() => onRouteClick(deploymentData.id)}
                            label={
                              <MDTypography
                                variant="h4"
                                fontWeight="large"
                                color="info"
                                sx={{ mt: '10px' }}
                              >
                                <Icon fontSize="large" color="info">
                                  chevron_right_rounded
                                </Icon>
                              </MDTypography>
                            }
                            index={`DeploymentData-${i}`}
                            key={`DeploymentData-${i}`}
                          />
                        </MDBox>
                      </Grid>
                    );
                  })}
              </Grid>
            </MDBox>
          }
          titleBarActionContents={
            <>
              {deployments && deployments?.length && (
                <MDTypography
                  ml={1}
                  color="secondary"
                  variant="subtitle2"
                  textTransform="capitalize"
                  fontWeight="medium"
                >
                  {` (${deployments?.length})`}
                </MDTypography>
              )}

              {isLoadingDeployments ? (
                <MDBox width="20%" marginLeft="auto">
                  <FlashingLoader />
                </MDBox>
              ) : (
                isHasOwnerOrAdminAccess && (
                  <MDTypography
                    color="secondary"
                    component="button"
                    onClick={onAddDeploymentClick}
                    sx={{
                      ml: 'auto',
                      alignSelf: 'flex-start',
                      mr: 1,
                      backgroundColor: 'transparent !important',
                      border: 'none !important',
                    }}
                  >
                    <Icon color="info" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                      add
                    </Icon>
                  </MDTypography>
                )
              )}
            </>
          }
        />
      ) : (
        <MDBox textAlign="center">
          <MDTypography sx={{ ml: 3, py: 2 }} variant="button" fontWeight="regular">
            {intl.formatMessage(messages.noDeployments1)}{' '}
            <Link
              to={'/deployments'}
              style={{
                color: info.main,
                pointerEvents: 'inherit',
              }}
            >
              {intl.formatMessage(messages.deploymentsLink)}
            </Link>{' '}
            {intl.formatMessage(messages.noDeployments2)}
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
}
