// @mui material components
import { Icon, IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';

import {
  ConfirmationModal,
  DeploymentDropdown,
  FlashingLoader,
  FormField,
  MDBox,
  MDButton,
  MDTypography,
  Header,
} from 'components';
import {
  DeploymentContext,
  SelectedEntityContext,
  OrganizationContext,
  CurrentUserContext,
  PermissionContext,
} from 'contexts';
import { useContext, useListDeployments, useListOrganizations, useState } from 'hooks';
import { InputEvent } from 'types';
import { defineMessages, useIntl, FormattedMessage } from 'utils';

const messages = defineMessages({
  cancel: {
    id: 'deployments.header.button.cancel',
    defaultMessage: 'Cancel',
  },
  deleteTitle: {
    id: 'deployments.header.delete.title',
    defaultMessage: 'Delete Deployment?',
  },
  deleteDescription1: {
    id: 'deployments.header.delete.description1',
    defaultMessage: 'Are you sure you want to delete',
  },
  deleteDescription2: {
    id: 'deployments.header.delete.description2',
    defaultMessage: 'this deployment',
  },
  yes: {
    id: 'deployments.header.delete.yes',
    defaultMessage: 'Yes',
  },
});

interface HeaderProps {
  onClickAddDeployment: () => void;
  isAddingDeployment: boolean;
  onCancel: () => void;
  sx?: any;
  isHeaderDisabled: boolean;
}

export function DeploymentHeader({
  onClickAddDeployment,
  isAddingDeployment,
  isHeaderDisabled,
  onCancel,
  sx,
}: HeaderProps): JSX.Element {
  const intl = useIntl();
  const {
    isLoadingOrganization,
    isLoadingDeployment,
    selectedDeployment,
    selectedOrganization,
    selectedOrganizationId,
    selectedGroup,
  } = useContext(SelectedEntityContext);
  const {
    cleanup,
    deleteDeployment,
    deploymentNameInput,
    isHasWriteAccess,
    onUpdateNameSubmit,
    setDeploymentNameInput,
    setUpdatingSection,
    updatingDeployment,
    updatingSection,
    isLoadingCreateDeployment,
    isLoadingDeleteDeployment,
    toggleUpdatingDeployment,
  } = useContext(DeploymentContext);
  const { isHasOwnerOrAdminAccess } = useContext(OrganizationContext);
  const { currentUser, token } = useContext(CurrentUserContext);
  const { addingPermissionsType } = useContext(PermissionContext);
  const [isConfirmationDelete, setIsConfirmationDelete] = useState<boolean>(false);

  const { isLoading: isLoadingOrganizations } = useListOrganizations(currentUser, token);
  const { data: deployments, isLoading: isLoadingDeployments } =
    useListDeployments(selectedOrganizationId);

  const onClickEditDeployment = () => {
    toggleUpdatingDeployment(true);
    setUpdatingSection('header');
    setDeploymentNameInput(selectedDeployment.attributes.name);
  };
  const onClickCancelDeployment = () => {
    cleanup();
  };
  const onClickSaveDeployment = () => {
    onUpdateNameSubmit();
    // setUpdatingSection(undefined);
  };
  const onDeleteConfirm = () => {
    deleteDeployment();
    setIsConfirmationDelete(false);
  };
  const fadeInKeyframes = () => keyframes`
  0% { opacity: 0; }
  70% { opacity: 0; }
  100% { opacity: 1; }
`;

  const titleSection = isAddingDeployment ? (
    <MDBox height="100%" mt={0.5} lineHeight={1}>
      <MDTypography variant="h5" fontWeight="medium">
        <FormattedMessage
          id="deployments.header.create.title"
          defaultMessage="Create A Deployment"
        />
      </MDTypography>
      <MDTypography variant="button" color="text" fontWeight="medium">
        {selectedOrganization?.attributes.name}
      </MDTypography>
    </MDBox>
  ) : updatingDeployment &&
    updatingSection === 'header' &&
    !isLoadingCreateDeployment &&
    !isLoadingDeleteDeployment ? (
    <MDBox height="100%" mt={0.5} lineHeight={1}>
      <FormField
        type="text"
        label="Deployment Name"
        placeholder={selectedDeployment?.attributes.name}
        value={deploymentNameInput}
        onChange={(e: InputEvent) => setDeploymentNameInput(e.target.value)}
      />
      <MDTypography variant="button" color="text" fontWeight="medium">
        <FormattedMessage id="deployments.header.updating" defaultMessage="Updating Deployment" />
      </MDTypography>
    </MDBox>
  ) : (
    <MDBox height="100%" mt={0.5} lineHeight={1}>
      <MDTypography variant="h5" fontWeight="medium">
        {addingPermissionsType === 'group'
          ? 'Group Permissions'
          : !isLoadingDeleteDeployment && (
              <FormattedMessage id="deployments.header.title" defaultMessage="Deployments" />
            )}
      </MDTypography>
      <MDTypography variant="button" color="text" fontWeight="medium">
        {addingPermissionsType === 'group'
          ? selectedGroup.attributes.name
          : (!isLoadingDeleteDeployment &&
              // !isLoadingCreateDeployment &&
              selectedDeployment?.attributes.name) ||
            ''}
      </MDTypography>
    </MDBox>
  );

  const actionsSection = isAddingDeployment ? (
    <MDBox
      display="flex"
      justifyContent={{ md: 'flex-end', sm: 'flex-end', xs: 'flex-end' }}
      alignItems="center"
      lineHeight={1}
    >
      <MDButton variant="gradient" color="info" onClick={onCancel}>
        <Icon>cancel</Icon>&nbsp;{` ${intl.formatMessage(messages.cancel)}`}
      </MDButton>
    </MDBox>
  ) : (
    selectedOrganization &&
    (!updatingSection || updatingSection === 'header') && (
      <MDBox
        display="flex"
        justifyContent={{ xs: 'space-between', sm: 'flex-end', md: 'flex-end' }}
        alignItems="center"
        lineHeight={1}
        width="100%"
      >
        {updatingDeployment &&
        updatingSection === 'header' &&
        !isLoadingCreateDeployment &&
        !isLoadingDeleteDeployment ? (
          <>
            <IconButton
              size="large"
              aria-label="save"
              color="success"
              disabled={!deploymentNameInput}
              onClick={onClickSaveDeployment}
            >
              <Icon color="success" fontSize="large">
                check
              </Icon>
            </IconButton>
            <IconButton
              size="large"
              aria-label="close"
              color="secondary"
              onClick={onClickCancelDeployment}
            >
              <Icon fontSize="large">cancel</Icon>
            </IconButton>
            <IconButton
              size="large"
              aria-label="close"
              color="error"
              onClick={() => setIsConfirmationDelete(true)}
            >
              <Icon fontSize="large">delete_forever</Icon>
            </IconButton>
            <ConfirmationModal
              isOpen={isConfirmationDelete}
              setIsOpen={setIsConfirmationDelete}
              title={intl.formatMessage(messages.deleteTitle)}
              description={`${intl.formatMessage(messages.deleteDescription1)} ${
                updatingDeployment?.attributes.name ||
                intl.formatMessage(messages.deleteDescription2)
              }?`}
              primaryText={intl.formatMessage(messages.yes)}
              onPrimaryClick={() => {
                onDeleteConfirm();
                setIsConfirmationDelete(false);
              }}
              secondaryText={intl.formatMessage(messages.cancel)}
              onSecondaryClick={() => setIsConfirmationDelete(false)}
            />
          </>
        ) : isLoadingDeployment || isLoadingCreateDeployment || isLoadingDeleteDeployment ? (
          <MDBox width="50%">
            <FlashingLoader />
          </MDBox>
        ) : (
          <>
            {!isHeaderDisabled &&
              (isLoadingOrganization || isLoadingOrganizations || isLoadingDeployments ? (
                <MDBox
                  alignSelf="center"
                  sx={{ width: '100%' }}
                  data-testid="deployment-loading-status"
                >
                  <FlashingLoader />
                </MDBox>
              ) : deployments && deployments.length ? (
                <DeploymentDropdown />
              ) : (
                <>
                  {selectedOrganization &&
                    isHasOwnerOrAdminAccess &&
                    !isLoadingDeployments &&
                    !(addingPermissionsType === 'group') && (
                      <MDButton
                        variant="gradient"
                        color="info"
                        onClick={onClickAddDeployment}
                        id="addDep"
                        sx={{ mr: -4 }}
                      >
                        <Icon>add</Icon>&nbsp; Add New
                      </MDButton>
                    )}
                </>
              ))}
            <MDBox
              textAlign="end"
              display="inline-block"
              width="10%"
              ml={1}
              sx={{ animation: `0.5s ease-out ${fadeInKeyframes()}` }}
            >
              {selectedDeployment && isHasWriteAccess && !(addingPermissionsType === 'group') && (
                <>
                  {isHasOwnerOrAdminAccess && (
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="info"
                      onClick={onClickAddDeployment}
                    >
                      <Icon fontSize="small">add</Icon>
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="info"
                    onClick={onClickEditDeployment}
                  >
                    <Icon fontSize="small">edit</Icon>
                  </IconButton>
                </>
              )}
              {!selectedDeployment &&
                deployments.length > 0 &&
                !(addingPermissionsType === 'group') &&
                deployments.every((dep) => dep?.attributes.status !== 'complete') && (
                  <>
                    {isHasOwnerOrAdminAccess && (
                      <IconButton
                        size="small"
                        aria-label="close"
                        color="info"
                        onClick={onClickAddDeployment}
                      >
                        <Icon fontSize="small">add</Icon>
                      </IconButton>
                    )}
                  </>
                )}
            </MDBox>
          </>
        )}
      </MDBox>
    )
  );

  return (
    <Header avatar="rocket-launch" title={titleSection} actionsSection={actionsSection} sx={sx} />
  );
}
