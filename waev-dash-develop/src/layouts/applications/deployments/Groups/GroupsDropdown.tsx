// @mui material components
import { Autocomplete } from '@mui/material';

import { FlashingLoader, MDBox, MDInput } from 'components';
import { SelectedEntityContext } from 'contexts';

import { useContext, useListGroups, useState } from 'hooks';
import { Group, SelectEvent } from 'types';

interface GroupDropdownProps {
  placeholderText?: string;
  [key: string]: any;
}

export function GroupsDropdown({ placeholderText }: GroupDropdownProps): JSX.Element {
  const { selectedOrganizationId, setSelectedGroupId, selectedGroup } =
    useContext(SelectedEntityContext);

  const { data: groups } = useListGroups(selectedOrganizationId);
  const [inputValue, setInputValue] = useState<string>('');
  const handleChange = (_e: SelectEvent | any, value: Group | null | any) => {
    setSelectedGroupId(value?.id);
  };

  return groups?.length ? (
    selectedGroup ? (
      <Autocomplete
        fullWidth
        //@ts-ignore
        defaultValue={selectedGroup}
        disableClearable
        //@ts-ignore
        value={selectedGroup}
        options={groups}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_, i) => setInputValue(i)}
        //@ts-ignore
        getOptionLabel={(option) => option?.attributes?.name}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        size="medium"
        renderInput={(params) => (
          <MDInput {...params} label={placeholderText || 'Select a Group'} />
        )}
        // disablePortal
        // value={{ label: selectedGroup?.attributes.name, id: selectedGroup?.id }}
        // defaultValue={''}
        // value={
        //   selectedGroupName && selectedGroup
        //     ? { label: selectedGroupName, id: selectedGroup }
        //     : null
        // }
        // filterOptions={(options, _state) => options}
        // isOptionEqualToValue={(option, value) => option?.id === value?.id}
        // loading={!!selectedGroup?.attributes.name}
      />
    ) : (
      <MDBox alignSelf="center" sx={{ width: '100%' }} data-testid="group-select-loading-status">
        <FlashingLoader />
      </MDBox>
    )
  ) : (
    <></>
  );
}
