import { useContext, useEffect, useMemo, useState } from 'react';

import { ConfirmationModal, ContentModal, DataTable, MDSnackbar, waevHoverClass } from 'components';

// @mui material components
import { capitalize, Menu, MenuItem } from '@mui/material/';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';
import MDTypography from 'components/Elements/MDTypography';

import { formatUsersToTableData } from './data';
import { PermissionContext, CurrentUserContext, SelectedEntityContext } from 'contexts';
import { Deployment, EntityTypes, Group, Organization, WaevPermissions } from 'types';
import { PermissionsSelector } from 'layouts/applications/permissions';
import { useForgotPassword } from 'hooks';

interface PermissionsViewProps {
  entity: Organization | Deployment | Group;
  entityType: EntityTypes;
}

export function PermissionsView({ entity, entityType }: PermissionsViewProps): JSX.Element {
  const { currentUser } = useContext(CurrentUserContext);
  const { setSelectedGroupId } = useContext(SelectedEntityContext);
  const {
    setAddingPermissionsType,
    updatingPermission,
    setUpdatingPermission,
    deletingPermission,
    setDeletingPermission,
    onDeletePermission,
    onUpdatePermission,
    isLoadingPermissions,
    selectedEntityType,
    setSelectedEntityType,
  } = useContext(PermissionContext);

  const [isDropdownMenu, setIsDropdownMenu] = useState(null); // Anchor Element
  const [clickedUserEnroll, setClickedUserEnroll] = useState<WaevPermissions>(undefined);

  const {
    error: errorForgotPassword,
    // mutate: sendForgotPassword,
    isSuccess: isForgotPasswordRequestSuccess,
  } = useForgotPassword(clickedUserEnroll?.attributes?.users?.email);

  const openDropdownMenu = (event: any, user: WaevPermissions) => {
    setClickedUserEnroll(user);
    setIsDropdownMenu(event.currentTarget);
    setSelectedEntityType(entityType);
  };
  const closeDropdownMenu = () => setIsDropdownMenu(null);

  const onClick = () => {
    setAddingPermissionsType(entityType);
    entityType === 'group' && setSelectedGroupId(entity.id);
  };

  const [tablePageNumber, setTablePageNumber] = useState<number>(0);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);

  const leftHeader = (
    <MDBox width="100%" display="inline-flex">
      <MDTypography variant="h6" alignSelf="center">
        {`${capitalize(entityType)} Permissions`}
      </MDTypography>
    </MDBox>
  );

  const data = useMemo<any>(
    () =>
      formatUsersToTableData(
        entity.fullPermissions,
        openDropdownMenu,
        currentUser?.attributes?.email,
        false,
        onClick,
        entityType
      ),
    [entity]
  );

  // const onClickResendInvite = () => {
  //   closeDropdownMenu();
  //   sendForgotPassword();
  // };

  // Notifications
  const [successSB, setSuccessSB] = useState<boolean>(false);
  const [errorSB, setErrorSB] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string>();

  const closeSuccessSB = () => setSuccessSB(false);
  const closeErrorSB = () => setErrorSB(false);

  useEffect(() => {
    if (errorForgotPassword) {
      // @ts-ignore
      if (errorForgotPassword?.errors?.length) {
        // @ts-ignore
        setErrorStatus(errorForgotPassword?.errors[0].source);
      } else {
        setErrorStatus('Something went wrong with the resend invite request. Try again later.');
      }
    }
  }, [errorForgotPassword]);

  useEffect(() => {
    setSuccessSB(isForgotPasswordRequestSuccess);
  }, [isForgotPasswordRequestSuccess]);

  const renderSuccessNotification = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Success!"
      content={'Another invite has been sent.'}
      dateTime="Now"
      open={successSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorNotification = (
    <MDSnackbar
      color="error"
      icon="x"
      title="Whoops!"
      content={errorStatus}
      dateTime="Now"
      open={!!errorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const renderMenu = (state: any, close: any) => {
    return (
      <Menu
        anchorEl={state}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(state)}
        onClose={close}
        keepMounted
      >
        {/* <MenuItem
          onClick={() => {
            onClickResendInvite();
            closeDropdownMenu();
          }}
        >
          Re-send Invite
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            setUpdatingPermission(clickedUserEnroll);
            closeDropdownMenu();
          }}
        >
          Update Permissions
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeletingPermission(clickedUserEnroll);
            closeDropdownMenu();
          }}
        >
          {`Remove User From ${capitalize(entityType)}`}
        </MenuItem>
      </Menu>
    );
  };

  const sxAnimateRows = {};
  entity.fullPermissions?.length &&
    (entity.fullPermissions || [])
      .filter((u) => u.attributes?.users?.email)
      .forEach((permission, i) => {
        // @ts-ignore
        sxAnimateRows[`tbody>tr:nth-of-type(${i + 1})`] = waevHoverClass(
          permission.attributes?.users?.email
        );
      });

  const tableCount = (entity.fullPermissions || []).filter(
    (u) => u.attributes?.users?.email
  ).length;

  return (
    <MDBox mt={4} sx={{ mx: 'auto' }}>
      {tableCount > 0 ? (
        <>
          <DataTable
            isLoading={isLoadingPermissions}
            renderLoader={isLoadingPermissions}
            table={data}
            canSearch
            leftHeader={leftHeader}
            pageNumber={tablePageNumber}
            setPageNumber={setTablePageNumber}
            defaultEntriesPerPage={entriesPerPage}
            setDefaultEntriesPerPage={setEntriesPerPage}
            isHidePages={tableCount < 6}
            sx={{
              'thead>tr>th:nth-of-type(2)>div': { display: 'none' },
              // 'tbody>tr:nth-of-type(1)': { backgroundColor: 'green' },
              ...sxAnimateRows,
            }} // This forces the hide of the column sort.
          />
          {renderMenu(isDropdownMenu, closeDropdownMenu)}
          <ConfirmationModal
            isOpen={!!deletingPermission}
            setIsOpen={setDeletingPermission}
            title={`Remove User from ${capitalize(selectedEntityType || entityType)}?`}
            description={`Are you sure you want to remove ${
              deletingPermission?.attributes?.users?.email || 'this user'
            } from ${entity.attributes?.name || `this ${selectedEntityType || entityType}`}?`}
            primaryText="Yes"
            onPrimaryClick={() => {
              setIsDropdownMenu(null);
              onDeletePermission(selectedEntityType);
            }}
            secondaryText="Cancel"
            onSecondaryClick={() => {
              setDeletingPermission(undefined);
              setIsDropdownMenu(null);
            }}
          />
          <ContentModal
            isOpen={!!updatingPermission}
            setIsOpen={setUpdatingPermission}
            isSetUndefined={true}
            title={`Updating ${capitalize(selectedEntityType || entityType)} Permissions`}
            // TODO(): This isn't updated for groups.
            description={`Updating ${updatingPermission?.attributes?.users?.email} on ${entity.attributes?.name}`}
            primaryText="Confirm"
            onPrimaryClick={() => {
              onUpdatePermission();
              setIsDropdownMenu(null);
            }}
            secondaryText="Cancel"
            onSecondaryClick={() => {
              setUpdatingPermission(undefined);
              setIsDropdownMenu(null);
            }}
          >
            <MDBox ml="39%">
              <PermissionsSelector permissionType={capitalize(selectedEntityType || entityType)} />
            </MDBox>
          </ContentModal>
        </>
      ) : (
        <></>
      )}
      {renderSuccessNotification}
      {renderErrorNotification}
    </MDBox>
  );
}
