// @mui material components
import { Autocomplete, Icon } from '@mui/material';
import rgba from 'assets/theme/functions/rgba';

import { ConfirmationModal, FlashingLoader, MDBox, MDInput, MDTypography } from 'components';
import { DeploymentContext, SelectedEntityContext } from 'contexts';

import { useContext, useDeleteDeployment, useListDeployments, useState } from 'hooks';
import { Deployment, SelectEvent } from 'types';
import { defineMessages, useIntl } from 'utils';

interface DeploymentDropdownProps {
  placeholderText?: string;
  [key: string]: any;
}

export function DeploymentDropdown({ placeholderText }: DeploymentDropdownProps): JSX.Element {
  const { selectedOrganizationId, setSelectedDeploymentId, selectedDeployment } =
    useContext(SelectedEntityContext);
  const { cleanup } = useContext(DeploymentContext);
  const { data: deployments, isLoading: isLoadingDeployments } =
    useListDeployments(selectedOrganizationId);
  const [deleteCheck, setDeleteCheck] = useState<boolean>(false);
  const [deleteDeploymentId, setDeleteDeploymentId] = useState<string>(undefined);
  const [inputValue, setInputValue] = useState<string>('');
  const { mutate: deleteFailedDeployment } = useDeleteDeployment(
    deleteDeploymentId,
    selectedOrganizationId,
    cleanup
  );

  const handleChange = (_e: SelectEvent | any, value: Deployment | null | any) => {
    if (value.attributes.status === 'failed') {
      setDeleteDeploymentId(value.id);
      setDeleteCheck(true);
    } else {
      value.attributes.status === 'complete' && setSelectedDeploymentId(value?.id);
    }
  };

  const intl = useIntl();
  const messages = defineMessages({
    dropdownLabel: {
      id: 'deployments.dropdown.label',
      defaultMessage: 'Select a Deployment',
    },
    cancel: {
      id: 'deployments.dropdown.header.button.cancel',
      defaultMessage: 'Cancel',
    },
    deleteTitle: {
      id: 'deployments.dropdown.header.delete.title',
      defaultMessage: 'Delete Deployment?',
    },
    deleteDescription: {
      id: 'deployments.dropdown.header.delete.description',
      defaultMessage: 'This Deployment failed to write to the blockchain, do you want to delete',
    },
    yes: {
      id: 'deployments.dropdown.header.delete.yes',
      defaultMessage: 'Yes',
    },
  });
  return deployments?.length ? (
    !isLoadingDeployments ? (
      <>
        <Autocomplete
          ListboxProps={{
            //@ts-ignore
            sx: {
              // '& ul': {
              '& li.MuiAutocomplete-option': {
                justifyContent: 'space-between !important',
              },
              // },
            },
          }}
          fullWidth
          //@ts-ignore
          defaultValue={selectedDeployment}
          disableClearable
          //@ts-ignore
          value={selectedDeployment}
          options={deployments}
          onChange={handleChange}
          inputValue={inputValue}
          onInputChange={(_, i) => setInputValue(i)}
          //@ts-ignore
          getOptionLabel={(option) =>
            //@ts-ignore
            option?.attributes?.name === selectedDeployment?.attributes.name ? (
              //@ts-ignore
              option?.attributes?.name
            ) : //@ts-ignore
            option?.attributes?.status === 'failed' ? (
              <>
                <MDTypography
                  sx={{ whiteSpace: 'pre', fontSize: '0.875rem', color: rgba('#FFFFFF', 0.4) }}
                  //@ts-ignore
                >{`${option?.attributes?.name}        `}</MDTypography>
                <Icon color="error" fontSize="small">
                  {'delete'}
                </Icon>
              </>
            ) : (
              //@ts-ignore
              option?.attributes?.name
            )
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          getOptionDisabled={(option) =>
            ['pending', 'processing'].includes(option?.attributes?.status)
          }
          size="medium"
          renderInput={(params) => (
            <MDInput
              {...params}
              label={placeholderText || intl.formatMessage(messages.dropdownLabel)}
            />
          )}
          // disablePortal
          // value={{ label: selectedDeployment?.attributes.name, id: selectedDeployment?.id }}
          // defaultValue={''}
          // value={
          //   selectedDeploymentName && selectedDeployment
          //     ? { label: selectedDeploymentName, id: selectedDeployment }
          //     : null
          // }
          // filterOptions={(options, _state) => options}
          // isOptionEqualToValue={(option, value) => option?.id === value?.id}
          // loading={!!selectedDeployment?.attributes.name}
        />
        <ConfirmationModal
          isOpen={deleteCheck}
          setIsOpen={setDeleteCheck}
          title={intl.formatMessage(messages.deleteTitle)}
          description={`${intl.formatMessage(messages.deleteDescription)}?`}
          primaryText={intl.formatMessage(messages.yes)}
          onPrimaryClick={() => {
            deleteFailedDeployment();
            setDeleteDeploymentId(undefined);
            setDeleteCheck(false);
          }}
          secondaryText={intl.formatMessage(messages.cancel)}
          onSecondaryClick={() => {
            setDeleteCheck(false);
          }}
        />
      </>
    ) : (
      <MDBox
        alignSelf="center"
        sx={{ width: '100%' }}
        data-testid="deployment-select-loading-status"
      >
        <FlashingLoader />
      </MDBox>
    )
  ) : (
    <></>
  );
}
