// @mui material components
import { Icon } from '@mui/material';

// Waev Dashboard components
import { FlashingLoader, MDAvatar, MDBox, MDTypography, DataInfoActionCard } from 'components';
import { GroupRecordContext, RecordContext, SelectedEntityContext } from 'contexts';
import {
  useContext,
  useEffect,
  useListUserGroups,
  useListOrgGroups,
  useState,
  useListDeployments,
} from 'hooks';
import { defineMessages, FormattedMessage, useIntl } from 'utils';

// Custom styles for GroupsList
export function DataGroupsList(): JSX.Element {
  const intl = useIntl();
  const {
    setSelectedDeploymentId,
    selectedDeploymentId,
    setSelectedGroupId,
    selectedOrganizationId,
  } = useContext(SelectedEntityContext);
  const { setSelectedEntity } = useContext(RecordContext);
  const { organizationDeploymentIds } = useContext(GroupRecordContext);
  const { data: userGroups } = useListUserGroups();
  const allOrgGroups = useListOrgGroups(organizationDeploymentIds);
  const allOrgGroupsFiltered = allOrgGroups?.filter((group) => !!group?.data?.data[0]);
  const unwrappedOrgGroups = allOrgGroupsFiltered?.map((group) => group?.data?.data).flat();

  const [isOrganizationGroupsLoaded, setIsOrganizationGroupsLoaded] = useState<boolean>(false);
  const { data: deployments } = useListDeployments(selectedOrganizationId);

  useEffect(() => {
    !allOrgGroups.some((result) => result.isLoading) && setIsOrganizationGroupsLoaded(true);
  }, [allOrgGroups]);

  function getFilteredGroupsList() {
    const mappedBadGroupIds = unwrappedOrgGroups && unwrappedOrgGroups?.map((group) => group?.id);

    return (
      userGroups &&
      mappedBadGroupIds &&
      (userGroups || []).filter((userGroups) => !mappedBadGroupIds?.includes(userGroups?.id))
    );
  }
  const messages = defineMessages({
    withOrginizationAccessGroups: {
      id: 'deployments.groups_access.titleWithOrgGroups',
      defaultMessage: 'All Other Shared Access Groups',
    },
    noOrginizationAccessGroups: {
      id: 'deployments.groups_access.titleWithNoOrgGroups',
      defaultMessage: 'All Shared Access Groups',
    },
  });

  return (
    <MDBox alignItems="center" mr={3}>
      <MDBox display="flex" alignItems="center" pl={2} pb={1}>
        {!isOrganizationGroupsLoaded || getFilteredGroupsList()?.length > 0 ? (
          <>
            {allOrgGroups?.length > 0 ? (
              <MDTypography variant="subtitle2" textTransform="capitalize" fontWeight="medium">
                {intl.formatMessage(messages.withOrginizationAccessGroups)}
              </MDTypography>
            ) : (
              <MDTypography variant="subtitle2" textTransform="capitalize" fontWeight="medium">
                {intl.formatMessage(messages.noOrginizationAccessGroups)}
              </MDTypography>
            )}
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
        {userGroups &&
          isOrganizationGroupsLoaded &&
          !!userGroups.length &&
          getFilteredGroupsList() &&
          getFilteredGroupsList()?.map((groupData, i) => {
            const avatar = (
              <MDAvatar bgColor="info" alt="something here" shadow="md" key={`icon-${i}`}>
                <Icon fontSize="medium">groups</Icon>
              </MDAvatar>
            );

            return (
              <DataInfoActionCard
                name={groupData?.attributes.name}
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
