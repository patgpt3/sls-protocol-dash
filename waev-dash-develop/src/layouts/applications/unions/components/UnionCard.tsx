// @mui material components
import { Card, Divider, Menu, MenuItem, Icon } from '@mui/material';

// Waev Dashboard components
import {
  ConfirmationModal,
  InputWithAction,
  MDBox,
  MDTypography,
  WaevPlaceholderIcon,
} from 'components';
import { UnionDeploymentsList } from './UnionDeploymentsList';
import { UnionContext, SelectedEntityContext } from 'contexts';
import { Union } from 'types';
import { crossSiteFadeInKeyframes, FormattedMessage, defineMessages, useIntl } from 'utils';
import { useContext, useState, useUpdateUnion } from 'hooks';

const messages = defineMessages({
  confirmationTitle: {
    id: 'unions.union_card.confirmation.title',
    defaultMessage: 'Delete Data Union?',
  },
  confirmationDescription1: {
    id: 'unions.union_card.confirmation.description1',
    defaultMessage: 'Are you sure you want to delete',
  },
  confirmationDescription2: {
    id: 'unions.union_card.confirmation.description2',
    defaultMessage: 'this data union',
  },
  confirmationCancel: {
    id: 'unions.union_card.confirmation.cancel',
    defaultMessage: 'Cancel',
  },
  confirmationYes: {
    id: 'unions.union_card.confirmation.yes',
    defaultMessage: 'Yes',
  },
  tooltipSave: {
    id: 'unions.union_card.tooltip.save',
    defaultMessage: 'Save',
  },
});

interface Props {
  union: Union;
}

export function UnionCard({ union }: Props): JSX.Element {
  const intl = useIntl();

  const {
    setIsUpdatingUnion,
    isUpdatingUnion,
    setUpdatingUnion,
    setUpdateUnionId,
    updatingUnion,
    updateUnionId,
    setDeletingUnionId,
    deleteUnion,
  } = useContext(UnionContext);
  const { selectedOrganizationId } = useContext(SelectedEntityContext);

  const [isDropdownMenu, setIsDropdownMenu] = useState(null);
  const [isConfirmationDelete, setIsConfirmationDelete] = useState<boolean>(false);
  const [updateUnionInput, setUpdateUnionInput] = useState<string>('');

  const openDropdownMenu = (event: any) => setIsDropdownMenu(event.currentTarget);
  const closeDropdownMenu = () => setIsDropdownMenu(null);

  const onClickEditUnion = (union: Union) => {
    setUpdateUnionId(union.id);
    setUpdatingUnion(union);
    setIsUpdatingUnion(true);
    setIsDropdownMenu(null);
  };

  const onClickDeleteMenuItem = (union: Union) => {
    setDeletingUnionId(union.id);
    setIsConfirmationDelete(true);
  };

  const onClickDeleteUnion = (union: Union) => {
    deleteUnion();
    setIsDropdownMenu(null);
  };

  const { mutate: updateUnionCall } = useUpdateUnion(
    updateUnionId,
    selectedOrganizationId,
    updateUnionInput
  );

  const onEditSubmit = () => {
    updateUnionCall();
    setUpdateUnionInput('');
    setUpdatingUnion(undefined);
    setIsUpdatingUnion(false);
  };
  const onEditCancel = () => {
    setUpdateUnionInput('');
    setUpdatingUnion(undefined);
    setIsUpdatingUnion(false);
  };

  return (
    <Card sx={{ breakInside: 'avoid-column' }}>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center">
          <WaevPlaceholderIcon
            alt="profile-image"
            size="xl"
            bgColor={'dark'}
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
            <MDTypography variant="h6" fontWeight="medium">
              {union?.attributes?.name}
            </MDTypography>
          </MDBox>
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
            <Icon sx={{ cursor: 'pointer', fontWeight: 'bold' }}>more_vert</Icon>
          </MDTypography>
          <Menu
            anchorEl={isDropdownMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(isDropdownMenu)}
            onClose={closeDropdownMenu}
            keepMounted
          >
            <MDBox
              component="button"
              sx={{
                backgroundColor: 'transparent !important',
                border: 'none !important',
              }}
              onClick={() => onClickEditUnion(union)}
            >
              <MenuItem>
                <FormattedMessage id="unions.union_card.edit" defaultMessage="Edit" />
              </MenuItem>
            </MDBox>
            <MenuItem onClick={() => onClickDeleteMenuItem(union)}>
              <FormattedMessage id="unions.union_card.delete" defaultMessage="Delete" />
            </MenuItem>
          </Menu>
        </MDBox>
        <ConfirmationModal
          isOpen={isConfirmationDelete}
          setIsOpen={setIsConfirmationDelete}
          title={intl.formatMessage(messages.confirmationTitle)}
          description={`${intl.formatMessage(messages.confirmationDescription1)} ${
            union?.attributes.name || intl.formatMessage(messages.confirmationDescription2)
          }?`}
          primaryText={intl.formatMessage(messages.confirmationYes)}
          onPrimaryClick={() => {
            onClickDeleteUnion(union);
            setIsConfirmationDelete(false);
          }}
          secondaryText={intl.formatMessage(messages.confirmationCancel)}
          onSecondaryClick={() => {
            setIsConfirmationDelete(false);
            setIsDropdownMenu(null);
          }}
        />
        <MDBox my={2} lineHeight={1}>
          {isUpdatingUnion && updatingUnion && updatingUnion.id === union.id && (
            <InputWithAction
              value={updateUnionInput || ''}
              placeholder={updatingUnion?.attributes.name}
              onChange={setUpdateUnionInput}
              onPrimaryClick={() => {
                onEditSubmit();
              }}
              primaryTooltip={intl.formatMessage(messages.tooltipSave)}
              onSecondaryClick={onEditCancel}
              secondaryTooltip={intl.formatMessage(messages.confirmationCancel)}
              disablePrimaryWhenEmpty
            />
          )}
        </MDBox>
        <MDBox sx={{ animation: `1s ease-out ${crossSiteFadeInKeyframes()}` }}>
          <Divider />
          <UnionDeploymentsList union={union} />
        </MDBox>
      </MDBox>
    </Card>
  );
}
