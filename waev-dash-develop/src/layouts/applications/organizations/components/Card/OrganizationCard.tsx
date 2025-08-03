// @mui material components
import { Card, Divider, Menu, MenuItem, Icon } from '@mui/material';

// Waev Dashboard components
import {
  ConfirmationModal,
  FlashingLoader,
  InputWithAction,
  MDBox,
  MDTypography,
  WaevPlaceholderIcon,
} from 'components';
import { OrganizationContext, SelectedEntityContext, CurrentUserContext } from 'contexts';
import { useContext, useDeleteOrganization, useState, useListOrganizationPermissions } from 'hooks';
import { Organization } from 'types';
import {
  restrictUser,
  isUserAllowed,
  crossSiteFadeInKeyframes,
  FormattedMessage,
  defineMessages,
  useIntl,
} from 'utils';
import { DeploymentsList } from './DeploymentsList';
import { UsersEnrolledList } from './UsersEnrolledList';

// ConfirmationModal this organization
const messages = defineMessages({
  confirmationTitle: {
    id: 'setting.organization_card.confirmation.title',
    defaultMessage: 'Delete Organization?',
  },
  confirmationDescription1: {
    id: 'setting.organization_card.confirmation.description1',
    defaultMessage: 'Are you sure you want to delete',
  },
  confirmationDescription2: {
    id: 'setting.organization_card.confirmation.description2',
    defaultMessage: 'this organization',
  },
  confirmationCancel: {
    id: 'setting.organization_card.confirmation.cancel',
    defaultMessage: 'Cancel',
  },
  confirmationYes: {
    id: 'setting.organization_card.confirmation.yes',
    defaultMessage: 'Yes',
  },
  tooltipSave: {
    id: 'setting.organization_card.tooltip.save',
    defaultMessage: 'Save',
  },
});

// Declaring prop types for the OrganizationCard
interface Props {
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'light';
  org: Organization;
}

// Custom styles for OrganizationCard
export function OrganizationCard({ color = 'dark', org }: Props): JSX.Element {
  const intl = useIntl();
  const {
    updatingOrganization,
    setUpdatingOrganization,
    isUpdatingOrganization,
    isLoadingOrganization,
    setIsUpdatingOrganization,
    setOrgNameInput: setOrgNameInputContext,
  } = useContext(OrganizationContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { selectedOrganization, setSelectedOrganizationId, selectedOrganizationId } =
    useContext(SelectedEntityContext);
  const [isDropdownMenu, setIsDropdownMenu] = useState(null); // Anchor Element
  const [isConfirmationDelete, setIsConfirmationDelete] = useState<boolean>(false);
  const [orgNameInput, setOrgNameInput] = useState<string>('');
  const { data: allPermissions } = useListOrganizationPermissions(selectedOrganizationId);
  const { mutate: deleteOrganization } = useDeleteOrganization(org.id);

  // TeamProfileCard dropdown menu handlers
  const openDropdownMenu = (event: any) => setIsDropdownMenu(event.currentTarget);
  const closeDropdownMenu = () => setIsDropdownMenu(null);

  const onClickEditOrg = (org: Organization) => {
    setSelectedOrganizationId(org.id);
    setUpdatingOrganization(org);
    setIsUpdatingOrganization(true);
    setIsDropdownMenu(null);
  };
  const onClickDeleteOrg = (org: Organization) => {
    deleteOrganization();
    setIsDropdownMenu(null);
  };
  const onEditSubmit = () => {
    setOrgNameInputContext(orgNameInput);
    setIsUpdatingOrganization(false);
  };
  const onEditCancel = () => {
    setOrgNameInput(undefined);
    setUpdatingOrganization(undefined);
    setIsUpdatingOrganization(false);
  };
  const isOwnerOrAdmin = isUserAllowed(org?.fullPermissions, currentUser?.attributes.email, [
    'owner',
    'admin',
  ]);
  const isWrite = isUserAllowed(org?.fullPermissions, currentUser?.attributes.email, [
    'owner',
    'admin',
    'write',
  ]);

  // Dropdown menu template for the OrganizationCard
  const renderMenu = (state: any, close: any, org: Organization) => {
    return (
      <Menu
        anchorEl={state}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(state)}
        onClose={close}
        keepMounted
      >
        {isWrite && (
          <MDBox
            component="button"
            sx={{
              backgroundColor: 'transparent !important',
              border: 'none !important',
            }}
            onClick={() => onClickEditOrg(org)}
          >
            <MenuItem>
              <FormattedMessage id="settings.organization_card.edit" defaultMessage="Edit" />
            </MenuItem>
          </MDBox>
        )}
        {isOwnerOrAdmin && (
          <MenuItem onClick={() => setIsConfirmationDelete(true)}>
            <FormattedMessage id="settings.organization_card.delete" defaultMessage="Delete" />
          </MenuItem>
        )}
      </Menu>
    );
  };

  return (
    <Card sx={{ breakInside: 'avoid-column' }}>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center">
          <WaevPlaceholderIcon
            alt="profile-image"
            size="xl"
            bgColor={color}
            variant="rounded"
            gradient="info"
            width="80%"
            height="80%"
            sx={{
              mt: -6,
              // @ts-ignore
              borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl,
            }}
          />

          <MDBox ml={2} mt={0} mb={3} lineHeight={0}>
            <MDTypography variant="h6" textTransform="capitalize" fontWeight="medium">
              {org.attributes.name}
            </MDTypography>
          </MDBox>
          {org.id && !(isLoadingOrganization && updatingOrganization?.id === org.id) && (
            <MDTypography
              color="secondary"
              component="button"
              onClick={openDropdownMenu}
              sx={{
                ml: 'auto',
                mt: -1,
                alignSelf: 'flex-start',
                py: 1.25,
                backgroundColor: 'transparent !important',
                border: 'none !important',
              }}
            >
              {(isOwnerOrAdmin || isWrite) && (
                <Icon sx={{ cursor: 'pointer', fontWeight: 'bold' }}>more_vert</Icon>
              )}
            </MDTypography>
          )}

          {(isOwnerOrAdmin || isWrite) && renderMenu(isDropdownMenu, closeDropdownMenu, org)}
        </MDBox>
        <ConfirmationModal
          isOpen={isConfirmationDelete}
          setIsOpen={setIsConfirmationDelete}
          title={intl.formatMessage(messages.confirmationTitle)}
          description={`${intl.formatMessage(messages.confirmationDescription1)} ${
            org?.attributes.name || intl.formatMessage(messages.confirmationDescription2)
          }?`}
          primaryText={intl.formatMessage(messages.confirmationYes)}
          onPrimaryClick={() => {
            onClickDeleteOrg(org);
            setIsConfirmationDelete(false);
          }}
          secondaryText={intl.formatMessage(messages.confirmationCancel)}
          onSecondaryClick={() => {
            setIsConfirmationDelete(false);
            setIsDropdownMenu(null);
          }}
        />
        <MDBox my={2} lineHeight={1}>
          {isUpdatingOrganization && updatingOrganization && updatingOrganization.id === org.id ? (
            <InputWithAction
              value={orgNameInput || ''}
              placeholder={selectedOrganization?.attributes.name}
              onChange={setOrgNameInput}
              onPrimaryClick={() => {
                onEditSubmit();
              }}
              primaryTooltip={intl.formatMessage(messages.tooltipSave)}
              onSecondaryClick={onEditCancel}
              secondaryTooltip={intl.formatMessage(messages.confirmationCancel)}
              disablePrimaryWhenEmpty
            />
          ) : (
            <MDTypography variant="button" fontWeight="light" color="text">
              {/* {org.name} */}
            </MDTypography>
          )}
        </MDBox>

        {org.id ? (
          <>
            <MDBox sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}>
              <Divider />
              <DeploymentsList org={org} />
            </MDBox>
            {restrictUser(
              selectedOrganization?.fullPermissions,
              currentUser.attributes.email,
              ['owner', 'admin'],
              <MDBox sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}>
                <Divider />

                <UsersEnrolledList org={org} />
                <Divider />
              </MDBox>
            )}

            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mr={1}
              sx={{ flexFlow: 'row-reverse' }}
            >
              {selectedOrganization && allPermissions && allPermissions?.length > 0
                ? restrictUser(
                    selectedOrganization?.fullPermissions,
                    currentUser.attributes.email,
                    ['owner', 'admin'],
                    <MDBox display="flex" flexDirection="column" lineHeight={0}>
                      <MDTypography variant="button" fontWeight="regular" color="secondary">
                        <FormattedMessage
                          id="settings.organization_card.enrolled_user"
                          defaultMessage="Enrolled User"
                        />
                        {allPermissions?.length !== 1 && 's'}
                      </MDTypography>
                      <MDTypography textAlign="right" variant="button" fontWeight="medium">
                        {allPermissions?.length}
                      </MDTypography>
                    </MDBox>
                  )
                : null}
              {/* {dateTime ? (
            <MDBox ml="auto" display="flex" flexDirection="column" lineHeight={0}>
              <MDTypography variant="button" fontWeight="medium">
                {dateTime}
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="secondary">
                Created On
              </MDTypography>
            </MDBox>
          ) : null} */}
            </MDBox>
          </>
        ) : (
          <>
            {/* <Divider /> */}
            {/* <MDBox width="50%"> */}
            <FlashingLoader sxContainer={{ mb: 5 }} />
            {/* </MDBox> */}
          </>
        )}
      </MDBox>
    </Card>
  );
}
