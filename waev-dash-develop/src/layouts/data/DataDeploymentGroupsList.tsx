// @mui material components
import { Icon, Tooltip } from '@mui/material';

// Waev Dashboard components
import { FlashingLoader, MDAvatar, MDBox, MDTypography, DataInfoActionCard } from 'components';
import { RecordContext, SelectedEntityContext, GroupRecordContext } from 'contexts';
import { useContext, useEffect, useListDeployments, useListOrgGroups, useState } from 'hooks';
import { defineMessages, FormattedMessage, useIntl } from 'utils';
import { Organization } from 'types';

import colors from 'assets/theme/base/colors';

// Declaring prop types for the GroupsList
interface Props {
  org: Organization;
}

const messages = defineMessages({
  sharedAccess: {
    id: 'deployments.shared_access.title',
    defaultMessage: 'Shared Accesses',
  },
});

// Custom styles for GroupsList
export function DataDeploymentGroupsList({ org }: Props): JSX.Element {
  const intl = useIntl();
  const { setSelectedDeploymentId, selectedDeploymentId, setSelectedGroupId } =
    useContext(SelectedEntityContext);
  const { setSelectedEntity } = useContext(RecordContext);
  const { data: deployments } = useListDeployments(org.id);

  const { organizationDeploymentIds } = useContext(GroupRecordContext);
  const [isOrganizationGroupsLoaded, setIsOrganizationGroupsLoaded] = useState<boolean>(false);
  const allOrgGroups = useListOrgGroups(organizationDeploymentIds);
  const allOrgGroupsFiltered = allOrgGroups?.filter((group) => !!group?.data?.data[0]);
  const unwrappedOrgGroups = allOrgGroupsFiltered?.map((group) => group?.data?.data).flat();
  useEffect(() => {
    !allOrgGroups.some((result) => result.isLoading) && setIsOrganizationGroupsLoaded(true);
  }, [allOrgGroups]);

  return (
    <MDBox alignItems="center" mr={3}>
      <MDBox display="flex" alignItems="center" pl={2} pb={1}>
        {!isOrganizationGroupsLoaded || allOrgGroups?.length > 0 ? (
          <>
            <MDTypography variant="subtitle2" textTransform="capitalize" fontWeight="medium">
              {`${org.attributes.name}'s ${intl.formatMessage(messages.sharedAccess)}`}
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
            <FormattedMessage
              id="deployments.shared_access.placeholder"
              defaultMessage="No Shared Accesses"
            />
          </MDTypography>
        )}
        {!isOrganizationGroupsLoaded && (
          <MDBox width="20%" marginLeft="auto">
            <FlashingLoader />
          </MDBox>
        )}
      </MDBox>
      <MDBox ml={3} mt={1}>
        {unwrappedOrgGroups &&
          !!unwrappedOrgGroups.length &&
          isOrganizationGroupsLoaded &&
          unwrappedOrgGroups?.map((groupData, i) => {
            const isDisabled = groupData.attributes.status !== 'complete';
            const status = () => {
              switch (groupData.attributes.status) {
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
                  {groupData.attributes.name}
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

            const avatar = (
              <MDAvatar bgColor="info" alt="something here" shadow="md" key={`icon-${i}`}>
                <Icon fontSize="medium">groups</Icon>
              </MDAvatar>
            );

            return (
              <DataInfoActionCard
                name={name}
                isDisabled={isDisabled}
                // subDescription={groupData.attributes.deployment_id}
                image={avatar}
                color={'info'}
                onClick={() => {
                  const validDeployments = (deployments || []).filter(
                    (dep) => dep?.attributes?.status === 'complete'
                  );
                  const validDep = validDeployments.find((dep) => dep.id === selectedDeploymentId);
                  validDep && setSelectedDeploymentId(selectedDeploymentId);
                  setSelectedEntity(groupData);
                  setSelectedGroupId(groupData.id);
                }}
                label={
                  <MDTypography variant="h4" fontWeight="large" color="info" sx={{ mt: '10px' }}>
                    <Icon fontSize="large" color="info">
                      chevron_right_rounded
                    </Icon>
                  </MDTypography>
                }
                index={`groupDataIndex-${i}`}
                key={`groupDataKey-${i}`}
              />
            );
          })}
      </MDBox>
    </MDBox>
  );
}
