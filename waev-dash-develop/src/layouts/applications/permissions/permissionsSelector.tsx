import { useContext } from 'hooks';
import { PermissionContext } from 'contexts';

import { FancyCheckbox, MDBox, MDTypography } from 'components';
import { Icon, Tooltip } from '@mui/material';
import { PermissionKeys } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  entity: {
    id: 'permissions.selector.entity',
    defaultMessage: 'entity',
  },
  tooltip1Part1: {
    id: 'permissions.selector.tooltip1.part1',
    defaultMessage:
      'The admin permission will allow all, EXCEPT removing the owner from or deleting the',
  },
  tooltip1Part2: {
    id: 'permissions.selector.tooltip1.part2',
    defaultMessage: 'Check this if they need to be able to add users.',
  },
  tooltip2: {
    id: 'permissions.selector.tooltip2',
    defaultMessage:
      'The read permission allows the user to see the permissions of other users in this',
  },
  tooltip3Part1: {
    id: 'permissions.selector.tooltip3.part1',
    defaultMessage:
      'The write permission includes read, but will also allow them to make changes to',
  },
  tooltip3Part2: {
    id: 'permissions.selector.tooltip3.part2',
    defaultMessage: 'but does not allow them to add users',
  },
});

// TODO(MFB): Change this to EntityType
interface PermissionSelectorProps {
  permissionType?: string;
}

export function PermissionsSelector({ permissionType }: PermissionSelectorProps): JSX.Element {
  const intl = useIntl();
  const {
    inputIsAdmin,
    setInputIsAdmin,
    inputIsRead,
    setInputIsRead,
    inputIsWrite,
    setInputIsWrite,
  } = useContext(PermissionContext);

  const restrictedPermissions: PermissionKeys[] | undefined =
    permissionType === 'Group' ? ['admin', 'read'] : undefined;

  return (
    <MDBox>
      {(!restrictedPermissions || restrictedPermissions.includes('admin')) && (
        <MDBox display="flex" alignItems="center">
          <Tooltip
            title={`${intl.formatMessage(messages.tooltip1Part1)} ${
              permissionType || intl.formatMessage(messages.entity)
            }. ${intl.formatMessage(messages.tooltip1Part2)}`}
            placement="left"
          >
            <MDBox>
              <Icon color="info" fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }}>
                info
              </Icon>
              <FancyCheckbox
                isSelected={inputIsAdmin}
                icon="lock"
                onSelect={() => setInputIsAdmin(!inputIsAdmin)}
              />
              <MDTypography variant="caption" color="text" mr={2}>
                <FormattedMessage id="permissions.selector.option.admin" defaultMessage="Admin" />{' '}
              </MDTypography>
            </MDBox>
          </Tooltip>
        </MDBox>
      )}

      {(!restrictedPermissions || restrictedPermissions.includes('read')) && (
        <MDBox display="flex" alignItems="center">
          <Tooltip
            title={`${intl.formatMessage(messages.tooltip2)} ${
              permissionType || intl.formatMessage(messages.entity)
            }.`}
            placement="left"
          >
            <MDBox>
              <Icon color="info" fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }}>
                info
              </Icon>
              <FancyCheckbox
                isSelected={inputIsRead}
                icon="lock"
                // isDisabled={isShowJustRead}
                onSelect={() => setInputIsRead(!inputIsRead)}
              />
              <MDTypography variant="caption" color="text">
                <FormattedMessage id="permissions.selector.option.read" defaultMessage="Read" />
              </MDTypography>
            </MDBox>
          </Tooltip>
        </MDBox>
      )}

      {(!restrictedPermissions || restrictedPermissions.includes('write')) && (
        <MDBox display="flex" alignItems="center">
          <Tooltip
            title={`${intl.formatMessage(messages.tooltip3Part1)}  ${
              permissionType || intl.formatMessage(messages.entity)
            }, ${intl.formatMessage(messages.tooltip3Part2)}.`}
            placement="left"
          >
            <MDBox>
              <Icon color="info" fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }}>
                info
              </Icon>
              <FancyCheckbox
                isSelected={inputIsWrite}
                icon="lock"
                onSelect={() => setInputIsWrite(!inputIsWrite)}
              />
              <MDTypography variant="caption" color="text">
                <FormattedMessage id="permissions.selector.option.write" defaultMessage="Write" />
              </MDTypography>
            </MDBox>
          </Tooltip>
        </MDBox>
      )}
    </MDBox>
  );
}
