// @mui material components
import { Grid, Icon } from '@mui/material';
// Waev Dashboard components
import { DataInfoActionCard, Fold, MDAvatar, MDBox, MDTypography } from 'components';
import { UnionContext } from 'contexts';
import { useContext, useNavigate } from 'hooks';
import { Integration, Union, UnionDeployment } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';
import { useDispatch } from 'react-redux';
import { setSelectedUnion } from 'store';

const messages = defineMessages({
  unionDeployments: {
    id: 'unions.associated_deployments_list.title',
    defaultMessage: 'Associated Deployments',
  },
  deploymentsLink: {
    id: 'unions.associated_deployments_list.deployments',
    defaultMessage: 'Union Deployments',
  },
  noDeployments1: {
    id: 'unions.associated_deployments_list.no_deployments1',
    defaultMessage: 'You have no union deployments. Go to the',
  },
  noDeployments2: {
    id: 'unions.associated_deployments_list.no_deployments2',
    defaultMessage: 'page to create one.',
  },
});

interface Props {
  union: Union;
}

export function UnionDeploymentsList({ union }: Props): JSX.Element {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { unionDeployments } = useContext(UnionContext);

  const unionDeploymentsData: UnionDeployment[] =
    union?.relationships?.union_deployments?.data?.length > 0
      ? union?.relationships?.union_deployments?.data
      : [];

  const unionDeploymentList = unionDeploymentsData.map((item) => {
    const unionDeploymentData = unionDeployments
      ? unionDeployments.find((element) => element.id === item.id)
      : undefined;

    const unionDeployment = unionDeploymentData ?? item;

    return unionDeployment;
  });

  const onRouteClick = (id: string | undefined) => {
    navigate('../data/view-data', { replace: true });
  };

  const onViewRecordsClick = () => {
    const selectedUnion = {
      unionId: union?.id ?? null,
      unionName: union?.attributes?.name ?? '-',
      selectionPage: 'data-unions',
    };
    dispatch(setSelectedUnion(selectedUnion));
    navigate('/union-data');
  };

  return (
    <MDBox alignItems="center" mr={3}>
      <Fold<Integration>
        storageKey="foldedDeployments"
        title={intl.formatMessage(messages.unionDeployments)}
        item="standardWeb"
        contents={
          <MDBox ml={3} mt={3} mb={1}>
            <Grid container>
              {unionDeploymentList.length && unionDeploymentList.length > 0 ? (
                unionDeploymentList.map((unionDeployment, i) => {
                  const avatar = (
                    <MDAvatar
                      bgColor="info"
                      alt="union deployment"
                      shadow="md"
                      key={`DepIcon-${i}`}
                    >
                      <Icon fontSize="medium">rocket_launch</Icon>
                    </MDAvatar>
                  );

                  return (
                    <Grid item md={12} lg={6} key={`grid-${i}`} width="100%">
                      <MDBox px={1.5}>
                        <DataInfoActionCard
                          name={unionDeployment?.attributes?.deployments?.name ?? '-'}
                          image={avatar}
                          color={'info'}
                          onClick={() => onRouteClick(unionDeployment?.attributes?.deployment_id)}
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
                          index={`UnionDeploymentData-${i}`}
                          key={`UnionDeploymentData-${i}`}
                        />
                      </MDBox>
                    </Grid>
                  );
                })
              ) : (
                <Grid item display="flex" alignItems="center" justifyContent="center" width="100%">
                  <MDBox>
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      justifyContent="center"
                    >
                      <FormattedMessage
                        id="unions.unions_deployments_list.placeholder"
                        defaultMessage="You have no deployments associated with this data union."
                      />
                    </MDTypography>
                  </MDBox>
                </Grid>
              )}
              {unionDeploymentList.length && unionDeploymentList.length > 0 ? (
                <Grid
                  item
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  sx={{ mt: 1 }}
                >
                  <MDBox onClick={onViewRecordsClick} sx={{ cursor: 'pointer' }}>
                    <MDTypography
                      variant="h6"
                      fontWeight="large"
                      color="info"
                      justifyContent="center"
                    >
                      <FormattedMessage
                        id="unions.unions_deployments_list.view_records"
                        defaultMessage="View Records"
                      />
                    </MDTypography>
                  </MDBox>
                  <MDBox>
                    <MDTypography
                      variant="h6"
                      fontWeight="large"
                      color="info"
                      justifyContent="center"
                    >
                      <Icon
                        onClick={onViewRecordsClick}
                        fontSize="medium"
                        color="info"
                        sx={{ mb: -0.8, cursor: 'pointer' }}
                      >
                        chevron_right_rounded
                      </Icon>
                    </MDTypography>
                  </MDBox>
                </Grid>
              ) : null}
            </Grid>
          </MDBox>
        }
        titleBarActionContents={
          <>
            {unionDeploymentList && unionDeploymentList?.length !== undefined ? (
              <MDTypography
                ml={1}
                color="secondary"
                variant="subtitle2"
                textTransform="capitalize"
                fontWeight="medium"
              >
                {` (${unionDeploymentList?.length})`}
              </MDTypography>
            ) : null}
          </>
        }
      />
    </MDBox>
  );
}
