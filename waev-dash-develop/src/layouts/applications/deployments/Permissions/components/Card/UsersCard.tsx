// @mui material components
import { Card, Divider, Menu, MenuItem, Icon } from '@mui/material';

// Waev Dashboard components
import { MDBox, MDAvatar, MDTypography } from 'components';
import { useState } from 'hooks';
import { User } from 'types';

// Declaring prop types for the UserCard
interface UserCardProps {
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'light';
  image: string;
  user: User;
  dateTime?: string;
  members?: string[];
}

// Custom styles for UserCard
export function UserCard({
  color = 'info',
  dateTime = '',
  image,
  members = [],
  user,
}: UserCardProps): JSX.Element {

  const [isDropdownMenu, setIsDropdownMenu] = useState(null); // Anchor Element

  // TeamProfileCard dropdown menu handlers
  const openDropdownMenu = (event: any) => setIsDropdownMenu(event.currentTarget);
  const closeDropdownMenu = () => setIsDropdownMenu(null);

  const onClickEditUser = (user: User) => {
    // setSelectedUserId(user.attributes.id);
    // setUpdatingUser(user);
    // setIsUpdatingUser(true);
    setIsDropdownMenu(null);
  };

  // const onEditSubmit = () => {
  //   // submitName();
  //   setIsUpdatingUser(false);
  // };
  // const onEditCancel = () => {
  //   // setUserNameInput(undefined);
  //   setUpdatingUser(undefined);
  //   setIsUpdatingUser(false);
  // };

  // Dropdown menu template for the UserCard
  const renderMenu = (state: any, close: any, user: User) => {
    return (
      <Menu
        anchorEl={state}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(state)}
        onClose={close}
        keepMounted
      >
        <MenuItem onClick={() => onClickEditUser(user)}>Edit</MenuItem>
        {/* <MenuItem onClick={() => onClickDeleteUser(user)}>Delete</MenuItem> */}
      </Menu>
    );
  };

  return (
    <Card>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center">
          <MDAvatar
            src={image}
            alt={user.attributes.name}
            size="xl"
            variant="rounded"
            bgColor={color}
            sx={{ p: 1, mt: -6, borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl }}
          />
          <MDBox ml={2} mt={-2} lineHeight={0}>
            <MDTypography variant="h6" textTransform="capitalize" fontWeight="medium">
              {user.attributes.name}
            </MDTypography>
          </MDBox>
          {/* {!isDropdownMenu && ( */}
          <MDTypography
            color="secondary"
            onClick={openDropdownMenu}
            sx={{
              ml: 'auto',
              mt: -1,
              alignSelf: 'flex-start',
              py: 1.25,
            }}
          >
            {/* <Tooltip title="Update User" placement="top"> */}
            <Icon sx={{ cursor: 'pointer', fontWeight: 'bold' }}>more_vert</Icon>
            {/* </Tooltip> */}
          </MDTypography>
          {/* )} */}
          {renderMenu(isDropdownMenu, closeDropdownMenu, user)}
        </MDBox>
        <MDBox my={2} lineHeight={1}>
          {/* {isUpdatingUser && updatingUser && updatingUser.attributes.id === user.attributes.id ? (
            <InputWithAction
              value={userNameInput}
              placeholder={selectedUser?.name}
              onChange={setUserNameInput}
              onPrimaryClick={onEditSubmit}
              primaryTooltip="Save"
              onSecondaryClick={onEditCancel}
              secondaryTooltip="Cancel"
              disablePrimaryWhenEmpty
            />
          ) : ( */}
          <MDTypography variant="button" fontWeight="light" color="text">
            {user.attributes.email}
          </MDTypography>
          {/* )} */}
        </MDBox>

        <Divider />

        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox display="flex" flexDirection="column" lineHeight={0}></MDBox>

          {dateTime ? (
            <MDBox display="flex" flexDirection="column" lineHeight={0}>
              <MDTypography variant="button" fontWeight="medium">
                {dateTime}
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="secondary">
                Created On
              </MDTypography>
            </MDBox>
          ) : null}
        </MDBox>
      </MDBox>
    </Card>
  );
}
