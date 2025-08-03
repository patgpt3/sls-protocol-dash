// @mui material components
import { Autocomplete } from '@mui/material';

import { MDInput } from 'components';
import { PermissionContext, SelectedEntityContext } from 'contexts';

import { useContext, useState } from 'hooks';
import { OrganizationPermissions, SelectEvent } from 'types';
import { defineMessages, useIntl } from 'utils';

const messages = defineMessages({
  enterEmail: {
    id: 'permissions.dropdown.enter.email',
    defaultMessage: 'Enter an Email',
  },
});

interface PermissionsDropdownProps {
  placeholderText?: string;
  selectedEnrolledUser?: any;
  permissionsListFilter?: string;
  [key: string]: any;
}

export function PermissionsDropdown({ placeholderText }: PermissionsDropdownProps): JSX.Element {
  const intl = useIntl();
  const { selectedDeployment, selectedOrganization } = useContext(SelectedEntityContext);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  const { emailInput, setEmailInput } = useContext(PermissionContext);
  const handleChange = (_e: SelectEvent | any, value: OrganizationPermissions | null | any) => {
    setSelectedUserId(value?.id);
  };

  function getFilteredPermissionsList() {
    let otherPermissions = selectedDeployment?.fullPermissions;
    const mappedBadUsers = otherPermissions.map(
      (otherPermission) => otherPermission.attributes?.users?.email
    );

    return (selectedOrganization?.fullPermissions || []).filter(
      (orgPermission) => !mappedBadUsers.includes(orgPermission.attributes.users.email)
    );
  }

  const orgEnrolledUsersList = selectedDeployment?.fullPermissions && getFilteredPermissionsList().map(
    (permissionData: OrganizationPermissions, i) => permissionData
  );
  return (
    <Autocomplete
      fullWidth
      // @ts-ignore
      defaultValue={''}
      clearOnBlur={false}
      // freeSolo={true}
      // @ts-ignore
      value={selectedUserId ? orgEnrolledUsersList.find(({ id }) => id === selectedUserId) : null}
      // @ts-ignore
      options={orgEnrolledUsersList}
      onChange={handleChange}
      inputValue={emailInput}
      onInputChange={(_, i) => {
        setEmailInput(i || '');
      }}
      // @ts-ignore
      getOptionLabel={(option) => option?.attributes?.users?.email}
      size="medium"
      renderInput={(params) => (
        <MDInput {...params} label={placeholderText || intl.formatMessage(messages.enterEmail)} />
      )}
    />
  );
}
