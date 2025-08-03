import { Icon, Grid, Tooltip, Menu, MenuItem } from '@mui/material';
import {
  DataInfoActionCard,
  MDAvatar,
  MDBox,
  MDTypography,
  FlashingLoader,
  ConfirmationModal,
} from 'components';
import { DeploymentUnion } from 'types';
import { defineMessages, useIntl } from 'utils';
import { useContext, useState, useNavigate } from 'hooks';
import { useDispatch } from 'react-redux';
import { setSelectedUnion } from 'store';
import { UnionContext } from 'contexts';

const messages = defineMessages({
  tooltip: {
    id: 'deployments.deployment_union_item.tooltip',
    defaultMessage: 'View Data Union Records',
  },
  delete: {
    id: 'deployments.deployment_union_item.delete',
    defaultMessage: 'Delete',
  },
  confirmationTitle: {
    id: 'deployments.deployment_union_item.confirmation_title',
    defaultMessage: 'Delete data union association?',
  },
  confirmationDescription1: {
    id: 'deployments.deployment_union_item.confirmation_description1',
    defaultMessage: 'Are you sure you want to remove the association with',
  },
  confirmationDescription2: {
    id: 'deployments.deployment_union_item.confirmation_description2',
    defaultMessage: 'this data union',
  },
  confirmationCancel: {
    id: 'deployments.deployment_union_item.confirmation_cancel',
    defaultMessage: 'Cancel',
  },
  confirmationYes: {
    id: 'deployments.deployment_union_item.confirmation_yes',
    defaultMessage: 'Yes',
  },
});

interface DeploymentUnionItemProps {
  union: DeploymentUnion;
  isLoadingPermissions: boolean;
  isHasOwnerOrAdminAccess: boolean;
}

export function DeploymentUnionItem({
  union,
  isLoadingPermissions,
  isHasOwnerOrAdminAccess,
}: DeploymentUnionItemProps): JSX.Element {
  const intl = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setSelectedDeploymentUnion, deleteUnionDeployment } = useContext(UnionContext);

  const [isDropdownMenu, setIsDropdownMenu] = useState(null);
  const [isConfirmationDelete, setIsConfirmationDelete] = useState<boolean>(false);

  const openDropdownMenu = (event: any) => setIsDropdownMenu(event.currentTarget);
  const closeDropdownMenu = () => {
    setIsDropdownMenu(null);
    setSelectedDeploymentUnion(undefined);
  };

  const onClickDeleteMenuItem = (deploymentUnion: DeploymentUnion) => {
    setSelectedDeploymentUnion(deploymentUnion);
    setIsConfirmationDelete(true);
  };

  const onClickDeleteUnion = () => {
    deleteUnionDeployment();
    setIsDropdownMenu(null);
    setSelectedDeploymentUnion(undefined);
  };

  const onSelectUnion = (deploymentUnion: DeploymentUnion) => {
    const selectedUnion = {
      unionId: deploymentUnion?.attributes?.union_id ?? null,
      unionName: deploymentUnion?.attributes?.unions?.name ?? '-',
      selectionPage: 'deployments',
    };
    dispatch(setSelectedUnion(selectedUnion));
    navigate('/union-data');
  };

  const avatar = (
    <MDAvatar bgColor="info" alt="data union">
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontSize="2rem"
      >
        <Icon>group_work</Icon>
      </MDBox>
    </MDAvatar>
  );

  const name = (
    <MDBox display="flex">
      <MDTypography variant="button" fontWeight="medium" data-testid="quick-info-name">
        {union?.attributes?.unions?.name ?? '-'}
      </MDTypography>
    </MDBox>
  );

  const editMenu = isLoadingPermissions ? (
    <MDBox display="flex" justifyContent="flex-end" alignItems="center" width="6%">
      <FlashingLoader />
    </MDBox>
  ) : (
    isHasOwnerOrAdminAccess && (
      <MDBox display="flex" justifyContent="flex-end" alignItems="center" width="6%">
        <MDTypography
          color="info"
          component="button"
          onClick={openDropdownMenu}
          sx={{
            backgroundColor: 'transparent !important',
            border: 'none !important',
          }}
        >
          <Icon fontSize="medium" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
            more_vert
          </Icon>
        </MDTypography>
        <Menu
          anchorEl={isDropdownMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(isDropdownMenu)}
          onClose={closeDropdownMenu}
          keepMounted
        >
          <MenuItem onClick={() => onClickDeleteMenuItem(union)}>
            {intl.formatMessage(messages.delete)}
          </MenuItem>
        </Menu>
      </MDBox>
    )
  );

  return (
    <Grid item sm={12} md={6} display="flex">
      <MDBox alignItems="center" width="94%">
        <MDBox ml={3} mt={1}>
          <DataInfoActionCard
            name={name}
            image={avatar}
            color={'info'}
            onClick={() => onSelectUnion(union)}
            label={
              <MDBox display="flex">
                <Tooltip title={intl.formatMessage(messages.tooltip)} placement="top">
                  <Icon fontSize="medium" color="info">
                    chevron_right_rounded
                  </Icon>
                </Tooltip>
              </MDBox>
            }
            index={`UnionData-${union.id}`}
            key={`UnionData-${union.id}`}
          />
        </MDBox>
      </MDBox>
      {editMenu}
      <ConfirmationModal
        isOpen={isConfirmationDelete}
        setIsOpen={setIsConfirmationDelete}
        title={intl.formatMessage(messages.confirmationTitle)}
        description={`${intl.formatMessage(messages.confirmationDescription1)} ${
          union?.attributes?.unions?.name || intl.formatMessage(messages.confirmationDescription2)
        }?`}
        primaryText={intl.formatMessage(messages.confirmationYes)}
        onPrimaryClick={() => {
          onClickDeleteUnion();
          setIsConfirmationDelete(false);
        }}
        secondaryText={intl.formatMessage(messages.confirmationCancel)}
        onSecondaryClick={() => {
          setIsConfirmationDelete(false);
          setIsDropdownMenu(null);
        }}
      />
    </Grid>
  );
}
