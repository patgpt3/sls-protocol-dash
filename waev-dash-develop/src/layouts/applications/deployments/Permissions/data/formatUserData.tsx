import { MDButton, MDTypography, waevHoverClass, WaevUserIcon } from 'components';

import {
  EntityTypes,
  PermissionKeys,
  PERMISSION_KEY_OPTIONS,
  TableData,
  WaevMetaRecord,
} from 'types';
import { WaevPermissions } from 'types';
import { Icon } from '@mui/material';
import { emptyCell } from 'utils';

export const formatUsersToTableData = (
  users: WaevPermissions[],
  openDropDown: (event: any, user: WaevPermissions) => void | undefined,
  currentUserId: string,
  isHideAdd: boolean,
  onClick: () => void,
  entityType?: EntityTypes
): TableData => {
  const columns =
    entityType === 'deployment'
      ? [
          {
            Header: !isHideAdd && (
              <MDButton
                // disabled={disablePrimaryWhenEmpty && !value}
                id="addDepUserButton"
                color="info"
                size="small"
                iconOnly
                onClick={onClick}
                sx={{ mr: 1, my: 'auto' }}
              >
                <Icon
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  add
                </Icon>
              </MDButton>
            ),

            disableSort: true,
            isFullOpacity: true,
            accessor: 'waev-actions',
            width: '5%',
          },
          {
            Header: '-',
            canSort: false, //  Doesn't work...
            accessor: 'waev-id',
            width: '5%',
          },
          // {
          //   Header: 'First Name',
          //   accessor: 'waev-first',
          // },
          // {
          //   Header: 'last Name',
          //   accessor: 'waev-last',
          // },
          {
            Header: 'Email',
            accessor: 'waev-email',
          },
          {
            Header: 'Permissions',
            accessor: 'waev-permissions',
          },
          {
            Header: 'ETH Address',
            accessor: 'waev-ETHAddress',
          },
        ]
      : [
          {
            Header: !isHideAdd && (
              <MDButton
                // disabled={disablePrimaryWhenEmpty && !value}
                color="info"
                size="small"
                iconOnly
                onClick={onClick}
                sx={{ mr: 1, my: 'auto' }}
              >
                <Icon
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  add
                </Icon>
              </MDButton>
            ),

            disableSort: true,
            isFullOpacity: true,
            accessor: 'waev-actions',
            width: '5%',
          },
          {
            Header: '-',
            canSort: false, //  Doesn't work...
            accessor: 'waev-id',
            width: '5%',
          },
          // {
          //   Header: 'First Name',
          //   accessor: 'waev-first',
          // },
          // {
          //   Header: 'last Name',
          //   accessor: 'waev-last',
          // },
          {
            Header: 'Email',
            accessor: 'waev-email',
          },
          {
            Header: 'Permissions',
            accessor: 'waev-permissions',
          },
        ];

  let rows: any[] = [];

  if (users && users.filter((user) => user.attributes?.users?.email).length > 0) {
    rows = users
      .filter((user) => user.attributes?.users?.email)
      .map((user) => {
        const idCell3 = (
          <WaevUserIcon
            permissions={user.attributes.permissions}
            id={user.attributes?.users?.email}
            isToHex={true}
            sx={waevHoverClass(user.attributes?.users?.email)}
          />
        );
        const permissions = (PERMISSION_KEY_OPTIONS || []).filter(
          (key: PermissionKeys) => user.attributes.permissions[key]
        );
        const buttonDropDown =
          currentUserId !== user.attributes?.users?.email && openDropDown ? (
            <MDButton
              sx={{
                backgroundColor: 'transparent !important',
                border: 'none !important',
                padding: '0 !important',
                minWidth: 0,
                mt: '-10px',
                mb: '-5px',

                boxShadow: 'none !important',
              }}
              onClick={(event: any) => {
                openDropDown(event, user);
              }}
            >
              <MDTypography color="secondary" sx={waevHoverClass(user.attributes?.users?.email)}>
                <Icon sx={{ cursor: 'pointer', fontWeight: 'bold', verticalAlign: 'middle' }}>
                  more_vert
                </Icon>
              </MDTypography>
            </MDButton>
          ) : (
            ''
          );

        const dataMap: WaevMetaRecord = {
          'waev-actions': buttonDropDown,
          'waev-id': user.attributes?.users?.email ? idCell3 : emptyCell,
          // 'waev-first': user.attributes.firstName || emptyCell,
          // 'waev-last': user.attributes.lastName || emptyCell,
          'waev-email': user.attributes?.users?.email || emptyCell,
          'waev-permissions': user.attributes.permissions ? permissions.join(', ') : emptyCell,
          'waev-ETHAddress': user.attributes.address,
        };
        return dataMap;
      });
  }

  return { columns, rows };
};
