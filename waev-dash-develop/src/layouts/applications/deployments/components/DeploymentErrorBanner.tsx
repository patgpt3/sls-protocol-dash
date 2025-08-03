import { IconButton, Icon } from '@mui/material';
import { Banner, ConfirmationModal, MDBox } from 'components';
import MDAlertCloseIcon from 'components/Elements/MDAlert/MDAlertCloseIcon';
import { DeploymentContext, SelectedEntityContext } from 'contexts';
import { useDeleteDeployment } from 'hooks';
import { useContext, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Deployment } from 'types';

export interface DeploymentErrorBannerProps {
  deployment: Deployment;
}

export function DeploymentErrorBanner({ deployment }: DeploymentErrorBannerProps): JSX.Element {
  const intl = useIntl();

  const { cleanup } = useContext(DeploymentContext);
  const messages = defineMessages({
    cancel: {
      id: 'ErrorBanner.header.button.cancel',
      defaultMessage: 'Cancel',
    },
    deleteTitle: {
      id: 'ErrorBanner.header.delete.title',
      defaultMessage: `Delete Deployment'}?`,
    },
    deleteDescription1: {
      id: 'ErrorBanner.header.delete.description1',
      defaultMessage: `Are you sure you want to delete`,
    },
    yes: {
      id: 'ErrorBanner.header.delete.yes',
      defaultMessage: 'Yes',
    },
  });
  const { selectedOrganizationId } = useContext(SelectedEntityContext);

  const { mutate: deleteFailedDeployment } = useDeleteDeployment(
    deployment.id,
    selectedOrganizationId,
    cleanup
  );

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
          subtitle={`The deployment "${deployment?.attributes.name}" failed to be created. Delete?`}
          actionsSection={actions}
        />
        <ConfirmationModal
          isOpen={deleteCheck}
          setIsOpen={setDeleteCheck}
          title={intl.formatMessage(messages.deleteTitle)}
          description={`${intl.formatMessage(messages.deleteDescription1)} ${
            deployment?.attributes.name
          }?`}
          primaryText={intl.formatMessage(messages.yes)}
          onPrimaryClick={() => {
            deleteFailedDeployment();
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
