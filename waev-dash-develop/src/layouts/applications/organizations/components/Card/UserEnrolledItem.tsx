// @mui material components
import { Icon, Menu, MenuItem } from '@mui/material';

// Waev Dashboard components
import { MDBox, MDSnackbar, QuickInfoActionCard, WaevUserIcon, waevHoverClass } from 'components';
import { CurrentUserContext, PermissionContext } from 'contexts';
import { useContext, useEffect, useForgotPassword, useGetCurrentUser, useState } from 'hooks';
import { PermissionKeys, PERMISSION_KEY_OPTIONS, WaevPermissions } from 'types';

interface Props {
  organizationPermissions: WaevPermissions;
}

// Custom styles for UserEnrolledItem
export function UserEnrolledItem({ organizationPermissions }: Props): JSX.Element {
  const { currentUser, setUpdateUser } = useContext(CurrentUserContext);
  const { setUpdatingPermission, setDeletingPermission } = useContext(PermissionContext);

  const [isUserEnrollDropdownMenu, setIsUserEnrollDropdownMenu] = useState(null); // Anchor Element
  const [clickedUserEnroll, setClickedUserEnroll] = useState<WaevPermissions>(undefined);

  const {
    error: errorForgotPassword,
    // mutate: sendForgotPassword,
    isSuccess: isForgotPasswordRequestSuccess,
  } = useForgotPassword(clickedUserEnroll?.relationships?.user?.data?.id);
  const { data: getMe } = useGetCurrentUser(currentUser?.id);

  // const {
  //   // data: dataDeleteOrganizationPermission,
  //   // error: errorDeleteOrganizationPermission,
  //   // isLoading: isLoadingDeleteOrganizationPermission,
  //   // isSuccess: isSuccessDeleteOrganizationPermission,
  //   mutate: deleteOrganizationPermission,
  // } = useDeleteOrganizationPermission(clickedUserEnroll?.organizationId, clickedUserEnroll?.id);

  const onUserEnrollDropDownOpenClick = (event: any) => {
    setClickedUserEnroll(organizationPermissions);
    // setUpdatingOrganization(organization);
    setIsUserEnrollDropdownMenu(event?.currentTarget);
  };

  const closeUserEnrollDropdownMenu = () => setIsUserEnrollDropdownMenu(null);

  // const onClickResendInvite = () => {
  //   closeUserEnrollDropdownMenu();
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

  // const onClickDeleteUserEnroll = () => {
  //   setIsUserEnrollDropdownMenu(null);
  //   // setIsConfirmationDelete(false);
  //   deleteOrganizationPermission();
  // };

  // const onClickEditUserEnroll = () => {
  //   setIsUserEnrollDropdownMenu(null);
  // };

  const isCurrentUser = currentUser?.id === organizationPermissions?.id;

  const renderUserEnrollMenu = (state: any, close: any) => {
    return (
      <Menu
        anchorEl={state}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(!!state && organizationPermissions.id === clickedUserEnroll.id)}
        onClose={close}
        keepMounted
      >
        {/* <MenuItem onClick={() => onClickEditUserEnroll()}>Edit</MenuItem> */}
        {/* <MenuItem
          onClick={() => {
            onClickResendInvite();
            closeUserEnrollDropdownMenu();
          }}
        >
          Re-send Invite
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            setUpdatingPermission(clickedUserEnroll);
            closeUserEnrollDropdownMenu();
          }}
        >
          Update Permissions
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeletingPermission(clickedUserEnroll);
            closeUserEnrollDropdownMenu();
          }}
        >
          Unenroll User
        </MenuItem>
        {currentUser.attributes.email === organizationPermissions.attributes?.users?.email && (
          <MenuItem
            onClick={() => {
              setUpdateUser(true);
            }}
          >
            Update Name
          </MenuItem>
        )}
      </Menu>
    );
  };

  // const avatar = (
  //   <MDAvatar bgColor="info" alt="Person" shadow="md">
  //     <Icon fontSize="medium">person</Icon>
  //   </MDAvatar>
  // );
  const avatar = (
    <WaevUserIcon
      permissions={organizationPermissions.attributes.permissions}
      id={organizationPermissions.attributes?.users?.email}
      size="md"
      isToHex={true}
    />
  );

  const permissions = (PERMISSION_KEY_OPTIONS || []).filter(
    (key: PermissionKeys) => organizationPermissions.attributes.permissions[key]
  );
  const name =
    (organizationPermissions?.attributes?.users.first_name ||
      organizationPermissions?.attributes?.users.last_name) &&
    (currentUser?.attributes.email === organizationPermissions?.attributes.users.email
      ? getMe?.attributes.first_name &&
        getMe?.attributes.last_name &&
        `${getMe?.attributes.first_name} ${getMe?.attributes.last_name}`
      : `${organizationPermissions?.attributes.users.first_name} ${organizationPermissions?.attributes.users.last_name} `);

  return (
    <MDBox my={1} lineHeight={1}>
      <QuickInfoActionCard
        name={name || organizationPermissions.attributes?.users?.email}
        description={name ? organizationPermissions.attributes?.users?.email : permissions}
        subDescription={name && permissions}
        // image={placeholderImage}
        image={avatar}
        color={'info'}
        onClick={isCurrentUser ? undefined : (e: any) => onUserEnrollDropDownOpenClick(e)}
        label={
          <Icon sx={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 'large' }}>more_vert</Icon>
        }
        sx={waevHoverClass(organizationPermissions.relationships?.user?.data?.id)}
        isHideButton={isCurrentUser}
      />
      {renderUserEnrollMenu(isUserEnrollDropdownMenu, closeUserEnrollDropdownMenu)}
      {renderSuccessNotification}
      {renderErrorNotification}
    </MDBox>
  );
}
