// @mui material components
import { Autocomplete } from '@mui/material';

import { MDInput } from 'components';
import { SelectedEntityContext, CurrentUserContext } from 'contexts';

import { useContext, useListOrganizations, useState } from 'hooks';
import { Organization, SelectEvent } from 'types';
import { defineMessages, useIntl } from 'utils';

const messages = defineMessages({
  selectLabel: {
    id: 'settings.organization_dropdown.label',
    defaultMessage: 'Select an Organization',
  },
});

interface OrganizationDropdownProps {
  placeholderText?: string;
  [key: string]: any;
}

export function OrganizationDropdown({ placeholderText }: OrganizationDropdownProps): JSX.Element {
  const intl = useIntl();
  const { setSelectedOrganizationId, selectedOrganization } = useContext(SelectedEntityContext);
  const { currentUser, token } = useContext(CurrentUserContext);

  const { data: organizations } = useListOrganizations(currentUser, token);
  const [inputValue, setInputValue] = useState<string>('');

  // const { data: selectedOrganization, isLoading: isLoadingSelectedOrganization } = useGetOrganization();

  const handleChange = (_e: SelectEvent | any, value: Organization | string | null) => {
    if (value && typeof value !== 'string') {
      setSelectedOrganizationId(value.id);
    }
  };

  return (
    organizations?.length && (
      <Autocomplete
        fullWidth
        disableClearable
        // @ts-ignore
        value={selectedOrganization || null}
        options={organizations}
        // @ts-ignore
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_, i) => setInputValue(i)}
        // @ts-ignore
        getOptionLabel={(option) => option.attributes.name}
        // disablePortal
        // value={{ label: selectedOrganization?.attributes.name, id: selectedOrganization?.id }}
        // defaultValue={''}
        // filterOptions={(options, _state) => options}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        // loading={!!selectedOrganization?.attributes.name}
        size="medium"
        renderInput={(params) => (
          <MDInput
            {...params}
            label={placeholderText || intl.formatMessage(messages.selectLabel)}
          />
        )}
      />
    )
  );
}
