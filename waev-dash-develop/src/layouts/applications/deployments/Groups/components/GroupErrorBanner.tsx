import { IconButton, Icon } from '@mui/material';
import { Banner, ConfirmationModal, MDBox } from 'components';
import MDAlertCloseIcon from 'components/Elements/MDAlert/MDAlertCloseIcon';
import { GroupContext, SelectedEntityContext } from 'contexts';
import { useDeleteGroup } from 'hooks';
import { useContext, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Group } from 'types';

export interface GroupErrorBannerProps {
  group: Group;
}

export function GroupErrorBanner({ group }: GroupErrorBannerProps): JSX.Element {
  const intl = useIntl();

  const { cleanup } = useContext(GroupContext);
  const messages = defineMessages({
    cancel: {
      id: 'GroupErrorBanner.header.button.cancel',
      defaultMessage: 'Cancel',
    },
    deleteTitle: {
      id: 'GroupErrorBanner.header.delete.title',
      defaultMessage: `Delete Group'}?`,
    },
    deleteDescription1: {
      id: 'GroupErrorBanner.header.delete.description1',
      defaultMessage: `Are you sure you want to delete`,
    },
    yes: {
      id: 'GroupErrorBanner.header.delete.yes',
      defaultMessage: 'Yes',
    },
  });
  const { selectedOrganizationId } = useContext(SelectedEntityContext);

  const { mutate: deleteFailedGroup } = useDeleteGroup(group.id, selectedOrganizationId, cleanup);

  const [deleteCheck, setDeleteCheck] = useState<boolean>(false);
  const [isBannerOpen, setIsBannerOpen] = useState<boolean>(true);

  const actions = (
    <MDBox sx={{ textAlign: 'end' }}>
      <IconButton
        size="large"
        aria-label="close"
        color="default"
        onClick={() => {
          setDeleteCheck(true);
        }}
      >
        <Icon fontSize="large">delete</Icon>
      </IconButton>
      <MDAlertCloseIcon
        onClick={() => {
          setIsBannerOpen(false);
        }}
        sx={{ fontSize: '50px', verticalAlign: 'middle', ml: '1rem', mr: 2 }}
      >
        &times;
      </MDAlertCloseIcon>
    </MDBox>
  );

  return (
    isBannerOpen && (
      <>
        <Banner
          bg="error"
          title="Error!"
          subtitle={`The group "${group?.attributes.name}" failed to be created. Delete?`}
          isLoading
          actionsSection={actions}
        />
        <ConfirmationModal
          isOpen={deleteCheck}
          setIsOpen={setDeleteCheck}
          title={intl.formatMessage(messages.deleteTitle)}
          description={`${intl.formatMessage(messages.deleteDescription1)} ${
            group?.attributes.name
          }?`}
          primaryText={intl.formatMessage(messages.yes)}
          onPrimaryClick={() => {
            deleteFailedGroup();
            setDeleteCheck(false);
          }}
          secondaryText={intl.formatMessage(messages.cancel)}
          onSecondaryClick={() => {
            setDeleteCheck(false);
          }}
        />
      </>
    )
  );
}
