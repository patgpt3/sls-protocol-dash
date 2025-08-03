import { Icon, IconButton } from '@mui/material';
import colors from 'assets/theme-dark/base/colors';
import rgba from 'assets/theme/functions/rgba';
import {
  ConfirmationModal,
  DataTable,
  FlashingLoader,
  MDBox,
  MDButton,
  MDInput,
  MDTypography,
} from 'components';
import { CurrentUserContext, AccessContext, SelectedEntityContext } from 'contexts';
import { useContext, useEffect, useLocalStorageByUser, useState, useStringsQueue } from 'hooks';
import { Access, InputEvent } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  apiKey: {
    id: 'deployments.accesses.header.api_key',
    defaultMessage: 'API Key',
  },
  deploymentId: {
    id: 'deployments.accesses.header.deployment_id',
    defaultMessage: 'Deployment ID',
  },
  deleteTitle: {
    id: 'deployments.accesses.header.delete.title',
    defaultMessage: 'Delete API Key?',
  },
  deleteDescription: {
    id: 'deployments.accesses.header.delete.description',
    defaultMessage: 'Are you sure you want to remove this API key?',
  },
  cancel: {
    id: 'deployments.accesses.header.delete.cancel',
    defaultMessage: 'Cancel',
  },
  yes: {
    id: 'deployments.accesses.header.delete.yes',
    defaultMessage: 'Yes',
  },
  description: {
    id: 'deployments.accesses.header.description',
    defaultMessage: 'Description',
  },
});

interface AccessesProps {
  isUpdating?: boolean;
}

type AccessesRow = Record<string, string | JSX.Element>;

export function Accesses({ isUpdating }: AccessesProps): JSX.Element {
  const intl = useIntl();
  const { selectedDeploymentId } = useContext(SelectedEntityContext);
  const { currentUser } = useContext(CurrentUserContext);
  const {
    createAccess,
    isLoadingAccesses,
    accesses,
    setUpdatingAccess,
    accessDescriptionInput,
    setAccessDescriptionInput,
    updateAccessId,
    setUpdateAccessId,
    updateAccess,
    updateAccessDescriptionInput,
    setUpdateAccessDescriptionInput,
    setDeletingAccessId,
  } = useContext(AccessContext);

  const [pageNumber, setPageNumber] = useState<number>(0);
  const [defaultEntriesPerPage, setDefaultEntriesPerPage] = useLocalStorageByUser<number>(
    currentUser.id,
    'AccessDefaultEntriesPerPage',
    25
  );
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [stagedDeletingAccessId, setStagedDeletingAccessId] = useState<string>(undefined);
  const [shownAPIKeyIds, showAPIKey, hideAPIKey] = useStringsQueue([]);
  const { info, error } = colors;

  const columns = [
    {
      Header: '',
      accessor: 'access-view',
      width: '10%',
      disableSort: true,
      isFullOpacity: true,
    },
    {
      Header: intl.formatMessage(messages.description),
      accessor: 'access-description',
      width: '30%',
    },
    {
      Header: intl.formatMessage(messages.apiKey),
      accessor: 'access-key',
      width: '30%',
    },
    {
      Header: intl.formatMessage(messages.deploymentId),
      accessor: 'access-Deployment-id',
      disableSort: true,
      width: '30%',
    },
    {
      Header: '',
      accessor: 'access-buttons',
      disableSort: true,
      width: '10%',
      isFullOpacity: true,
    },
  ];

  let rows: AccessesRow[] = [];

  useEffect(() => {
    if (!isUpdating) {
      setUpdateAccessId(undefined);
    }
  }, [isUpdating]);

  if (accesses?.length) {
    rows = accesses?.map((access: Access, i: any) => {
      const viewButton = (
        <IconButton
          size="small"
          aria-label="create-access"
          color={shownAPIKeyIds.includes(access.id) ? 'info' : 'info'}
          // click={createAccess}
          onClick={() => {
            shownAPIKeyIds.includes(access.id) ? hideAPIKey(access.id) : showAPIKey(access.id);
          }}
        >
          <Icon fontSize="small">
            {shownAPIKeyIds.includes(access.id) ? 'visibility_off' : 'visibility'}
          </Icon>
        </IconButton>
      );
      const descriptionUpdate = (
        <MDInput
          value={updateAccessDescriptionInput}
          onChange={(e: InputEvent) => setUpdateAccessDescriptionInput(e.target.value)}
          fullWidth
        ></MDInput>
      );
      if (isUpdating) {
        const buttonRemove = (
          <MDBox display={'flex'} flexDirection="row">
            <IconButton
              size="small"
              aria-label="edit-access"
              color="info"
              disabled={
                !!updateAccessId &&
                (!!updateAccessDescriptionInput ? access.id !== updateAccessId && true : true)
              }
              onClick={() => {
                updateAccessId ? updateAccess() : setUpdateAccessId(access.id);
                setUpdateAccessDescriptionInput(access.attributes.description);
              }}
              sx={{
                '&:disabled': {
                  color: rgba(info.main, 0.4),
                },
              }}
            >
              <Icon fontSize="small">{access.id === updateAccessId ? 'check' : 'edit'}</Icon>
            </IconButton>
            <IconButton
              size="small"
              aria-label="delete-access"
              color="error"
              disabled={!!updateAccessId && access.id !== updateAccessId && true}
              onClick={() => {
                setUpdatingAccess(access);
                setStagedDeletingAccessId(access.id);
                setIsConfirmDelete(true);
              }}
              sx={{
                '&:disabled': {
                  color: rgba(error.main, 0.4),
                },
              }}
            >
              <Icon fontSize="small">delete</Icon>
            </IconButton>
            {access.id === updateAccessId && (
              <IconButton
                size="small"
                aria-label="cancel-rename-access"
                color="secondary"
                onClick={() => {
                  setUpdateAccessId(undefined);
                }}
              >
                <Icon fontSize="small">cancel</Icon>
              </IconButton>
            )}
          </MDBox>
        );

        return {
          'access-view': viewButton,
          'access-description':
            access.id === updateAccessId ? descriptionUpdate : access.attributes.description,
          'access-key': shownAPIKeyIds.includes(access.id)
            ? access.attributes.api_key
            : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          'access-buttons': buttonRemove,
          'access-Deployment-id': selectedDeploymentId,
        };
      }
      return {
        'access-view': viewButton,
        'access-description': access.attributes.description,
        'access-key': shownAPIKeyIds.includes(access.id)
          ? access.attributes.api_key
          : 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        'access-Deployment-id': selectedDeploymentId,
      };
    });
  } else {
    const noAPIKeysDisplay = (
      <MDTypography variant="button" fontWeight="light" color="text" justifyContent="center">
        <FormattedMessage id="deployments.accesses.no_api_keys" defaultMessage="No API Keys" />
      </MDTypography>
    );
    rows[0] = {
      'access-view': '',
      'access-key': noAPIKeysDisplay,
      'access-Deployment-id': '',
    };
  }
  const nameInput = (
    <MDInput
      label="New Description"
      value={accessDescriptionInput}
      disabled={!!updateAccessId}
      onChange={(e: InputEvent) => setAccessDescriptionInput(e.target.value)}
    />
  );
  const addButton = accessDescriptionInput ? (
    <MDButton
      aria-label="create-access"
      color="info"
      size="small"
      onClick={() => createAccess()}
      sx={{ boxSizing: 'border-box' }}
    >
      <Icon>add</Icon>&nbsp; Create API Key
    </MDButton>
  ) : (
    <MDButton
      size="small"
      aria-label="create-access-disabled"
      color="info"
      disabled={true}
      sx={{ boxSizing: 'border-box' }}
    >
      <Icon>add</Icon>&nbsp; Create API Key
    </MDButton>
  );
  const createNew = isUpdating && (
    <MDBox alignItems={'left'} display={'inline- flex'} sx={{ mt: 1, mb: 3 }}>
      <MDBox sx={{ mr: 2 }}>{nameInput}</MDBox>
      <MDBox display={'flex'}>{addButton}</MDBox>
    </MDBox>
  );

  return isLoadingAccesses ? (
    <MDBox width="100%">
      <FlashingLoader />
    </MDBox>
  ) : (
    <>
      {accesses?.length || isUpdating ? (
        <>
          <ConfirmationModal
            isOpen={isConfirmDelete}
            setIsOpen={setIsConfirmDelete}
            title={intl.formatMessage(messages.deleteTitle)}
            description={intl.formatMessage(messages.deleteDescription)}
            primaryText={intl.formatMessage(messages.yes)}
            onPrimaryClick={() => {
              setDeletingAccessId(stagedDeletingAccessId);
              setIsConfirmDelete(false);
              setStagedDeletingAccessId(undefined);
            }}
            secondaryText={intl.formatMessage(messages.cancel)}
            onSecondaryClick={() => {
              setIsConfirmDelete(false);
              setUpdatingAccess(undefined);
              setStagedDeletingAccessId(undefined);
            }}
          />
          {createNew}
          <DataTable
            isLoading={false}
            renderLoader={false}
            table={{ columns, rows }}
            canSearch={false}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            showTotalEntries={!isLoadingAccesses && accesses?.length > 4}
            defaultEntriesPerPage={defaultEntriesPerPage}
            setDefaultEntriesPerPage={setDefaultEntriesPerPage}
            isHidePages={!accesses?.length || accesses?.length < 6}
            sx={{
              'tbody>tr>td>div': { width: '100%' }, // Cell width 100%
              //   'thead>tr>th:first-of-type>div': { display: 'none' }, // This forces the hide of the column sort.
            }}
          />
        </>
      ) : (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          <MDTypography variant="button" fontWeight="light" color="text" justifyContent="center">
            <FormattedMessage
              id="deployments.accesses.no_keys_created"
              defaultMessage="No API Keys Created"
            />
          </MDTypography>
        </MDBox>
      )}
    </>
  );
}
