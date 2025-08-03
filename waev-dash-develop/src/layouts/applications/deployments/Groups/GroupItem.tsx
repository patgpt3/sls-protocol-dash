// @mui material components
import { Divider, Icon, Tooltip } from '@mui/material';

// Waev Dashboard components
import {
  FlashingLoader,
  Fold,
  MDAvatar,
  MDBox,
  MDTypography,
  QuickInfoActionCard,
} from 'components';
import {
  CurrentUserContext,
  GroupContext,
  PermissionContext,
  SelectedEntityContext,
} from 'contexts';
import { useContext, useListOptInFlags, useMemo } from 'hooks';

import { Group, Integration } from 'types';
import { PermissionsView } from '../Permissions';
import { GroupConsentTable } from './GroupConsentTable';
import borders from 'assets/theme/base/borders';
import colors from 'assets/theme/base/colors';
import { isUserAllowed } from 'utils';

const { borderRadius } = borders;

// Declaring prop types for the DeploymentsList
interface Props {
  group: Group;
  index: number;
}

// Custom styles for DeploymentsList
export function GroupItem({ group, index }: Props): JSX.Element {
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedDeploymentId } = useContext(SelectedEntityContext);
  const { data: optInFlags } = useListOptInFlags(selectedDeploymentId);
  const { setUpdatingGroup, updatingGroup, setIsDeletingGroup } = useContext(GroupContext);
  const { isLoadingPermissions } = useContext(PermissionContext);

  const isHasOwnerOrAdminAccess = useMemo(
    () => isUserAllowed(group?.fullPermissions, currentUser.attributes.email, ['owner', 'admin']),
    [group, group.id]
  );

  const avatarAccessible = (
    <MDAvatar bgColor="info" alt="something here" shadow="md">
      <Icon fontSize="medium">enhanced_encryption</Icon>
    </MDAvatar>
  );

  const status = () => {
    switch (group.attributes.status) {
      case 'processing':
        return { title: 'This Group is still pending', color: colors.warning.main };
      case 'pending':
        return {
          title: 'This Group is still processing',
          color: colors.warning.main,
        };

      case 'failed':
        return { title: 'This Group has failed to create. You may want to delete it and try again.', color: colors.error.main };

      default:
        return {};
    }
  };

  return (
    <>
      {index > 0 && <Divider />}
      <MDBox alignItems="center" mr={3}>
        <Fold<Integration>
          storageKey="foldedGroups"
          title={
            group.attributes.status === 'failed'
              ? `${group.attributes.name} (Failed)`
              : group.attributes.name
          }
          item="standardWeb"
          titleBarActionContents={
            <>
              {group.attributes.status !== 'complete' && (
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
              )}
              {group?.fullPermissions && group?.fullPermissions?.length && (
                <MDTypography
                  ml={1}
                  color="secondary"
                  variant="subtitle2"
                  textTransform="capitalize"
                  fontWeight="medium"
                >
                  {` (${group?.fullPermissions?.length})`}
                </MDTypography>
              )}

              {isLoadingPermissions ? (
                <MDBox width="20%" marginLeft="auto">
                  <FlashingLoader />
                </MDBox>
              ) : updatingGroup ? (
                isHasOwnerOrAdminAccess && (
                  <MDBox display="flex" ml="auto">
                    <MDTypography
                      color="secondary"
                      onClick={() => {
                        setIsDeletingGroup(true);
                      }}
                      // onClick={openDropdownMenu}
                      sx={{
                        ml: 'auto',
                        alignSelf: 'flex-start',
                        mr: 1,
                      }}
                    >
                      <Icon color="error" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        delete
                      </Icon>
                    </MDTypography>
                    <MDTypography
                      color="secondary"
                      onClick={() => {
                        setUpdatingGroup(undefined);
                      }}
                      // onClick={openDropdownMenu}
                      sx={{
                        ml: 'auto',
                        alignSelf: 'flex-start',
                        mr: 1,
                      }}
                    >
                      <Icon color="secondary" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        cancel
                      </Icon>
                    </MDTypography>
                  </MDBox>
                )
              ) : (
                isHasOwnerOrAdminAccess && (
                  <MDTypography
                    color="secondary"
                    onClick={() => {
                      setUpdatingGroup(group);
                    }}
                    sx={{
                      ml: 'auto',
                      alignSelf: 'flex-start',
                      mr: 1,
                    }}
                  >
                    <Icon color="info" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                      edit
                    </Icon>
                  </MDTypography>
                )
              )}
            </>
          }
          contents={
            <>
              {/* Consents */}

              <MDBox ml={3}>
                <Tooltip
                  title="If a user has consented to all of the selected fields, that user's record will be available to the group. "
                  placement="top"
                >
                  <MDTypography variant="h5" alignSelf="center">
                    Consent{' '}
                    <Icon fontSize="small" color="info" sx={{ transform: 'scale(0.75)' }}>
                      info
                    </Icon>
                  </MDTypography>
                </Tooltip>
                {/* </MDBox> */}
                {optInFlags?.length &&
                group.attributes.config.flags &&
                (group.attributes.config.flags.length > 0 ||
                  group.attributes.config.flags.some((consent) =>
                    optInFlags.map((flag) => flag.attributes.field_selector).includes(consent)
                  )) ? (
                  <GroupConsentTable group={group} />
                ) : (
                  <>
                    <MDTypography variant="body2" alignSelf="center" mt={1}>
                      No Consents defined, and therefore there are no Opt-Outs.
                    </MDTypography>
                    <MDTypography variant="body2" alignSelf="center" mt={1}>
                      All records will be shown.
                    </MDTypography>
                  </>
                )}
              </MDBox>

              <MDBox
                ml={3}
                my={3}
                pt={2}
                pb={1}
                sx={{
                  border: '2px',
                  borderRadius: borderRadius.xl,
                  borderStyle: 'solid',
                }}
              >
                <Tooltip
                  title="For records available to the group, only these types of fields will be accessible and displayed."
                  placement="top"
                >
                  <MDTypography variant="h5" alignSelf="center">
                    Data Accessible{' '}
                    <Icon fontSize="small" color="info" sx={{ transform: 'scale(0.75)' }}>
                      info
                    </Icon>
                  </MDTypography>
                </Tooltip>
                <MDBox
                  justifyContent="space-evenly"
                  sx={{
                    display: 'flex',
                    mt: 2,
                  }}
                >
                  {(group?.attributes.config?.parts || []).includes('pii') && (
                    <QuickInfoActionCard
                      name="Private Fields"
                      image={avatarAccessible}
                      color="info"
                      // onClick={() => onRouteClick(Group Data
                      label={
                        <Icon sx={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 'large' }}>
                          open_in_browser
                        </Icon>
                      }
                      // index={`Group Access ${group.id}`}
                      // key={`Group Access ${group.id}`}
                    />
                  )}
                  {(group.attributes.config?.parts || []).includes('anon') && (
                    <QuickInfoActionCard
                      name="Anon Fields"
                      image={avatarAccessible}
                      color="info"
                      // onClick={() => onRouteClick(Group Data
                      label={
                        <Icon sx={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 'large' }}>
                          open_in_browser
                        </Icon>
                      }
                      // index={`Group Access ${group.id}`}
                      // key={`Group Access ${group.id}`}
                    />
                  )}
                  {(group.attributes.config?.parts || []).includes('meta') && (
                    <QuickInfoActionCard
                      name="Meta Information"
                      image={avatarAccessible}
                      color="info"
                      // onClick={() => onRouteClick(Group Data
                      label={
                        <Icon sx={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 'large' }}>
                          open_in_browser
                        </Icon>
                      }
                      // index={`Group Access ${group.id}`}
                      // key={`Group Access ${group.id}`}
                    />
                  )}
                  {!(group.attributes.config?.parts || []).includes('pii') &&
                    !(group.attributes.config?.parts || []).includes('anon') &&
                    !(group.attributes.config?.parts || []).includes('meta') && (
                      <MDTypography variant="body2" alignSelf="center" mb={1} mx={3}>
                        No Fields for the available Records will be accessible to this Group.
                      </MDTypography>
                    )}
                </MDBox>
              </MDBox>
              {/* <Divider /> */}

              {/* Users */}
              {isHasOwnerOrAdminAccess && (
                <MDBox mt={-1}>
                  <PermissionsView entity={group} entityType="group" />
                </MDBox>
              )}
            </>
          }
        />
      </MDBox>
    </>
  );
}
