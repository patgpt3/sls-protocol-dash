import { Autocomplete } from '@mui/material';
import { InfoCard, MDInput } from 'components';
import { SelectedEntityContext, UnionContext } from 'contexts';
import { useContext, useState } from 'hooks';
import { defineMessages, useIntl } from 'utils';
import { SelectEvent } from 'types';

export const messages = defineMessages({
  selectLabel: {
    id: 'deployments.select_union.select_label',
    defaultMessage: 'Select a Data Union',
  },
  unions: {
    id: 'deployments.select_union.title',
    defaultMessage: 'Data Unions Public List',
  },
});

export function SelectUnion(): JSX.Element {
  const intl = useIntl();
  const { publicUnions, associatedUnion, setAssociatedUnion, deploymentUnions } =
    useContext(UnionContext);
  const { selectedOrganization } = useContext(SelectedEntityContext);

  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (_e: SelectEvent | any, value: any) => {
    if (value && value.id && typeof value.id === 'string') {
      setAssociatedUnion(value);
    }
  };

  const deploymentUnionsIds: string[] = deploymentUnions.map((item) => item?.attributes?.union_id);
  const filteredPublicUnions = publicUnions.filter(
    (item) => !deploymentUnionsIds.includes(item.id)
  );
  const selectedValue: any = associatedUnion ?? undefined;

  const selectUnionDropdown = publicUnions?.length && (
    <Autocomplete
      fullWidth
      disableClearable
      sx={{ mt: 3 }}
      value={selectedValue}
      options={filteredPublicUnions}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(_, i) => setInputValue(i)}
      getOptionLabel={(option: any) => option.attributes.name}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      size="medium"
      renderInput={(params) => (
        <MDInput {...params} label={intl.formatMessage(messages.selectLabel)} />
      )}
    />
  );

  return selectedOrganization ? (
    <InfoCard
      icon="web"
      title={intl.formatMessage(messages.unions)}
      description={selectUnionDropdown}
      isLight
    />
  ) : (
    <></>
  );
}
