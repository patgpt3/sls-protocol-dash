import { WaevUserIcon } from 'components';

import { TableData, User, WaevMetaRecord } from 'types';
import { emptyCell } from 'utils';

export const formatUsersToOrgPermTableData = (users: User[]): TableData => {
  const columns = [
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

  if (users && users.length > 0) {
    rows = users.map((user) => {
      const idCell3 = <WaevUserIcon id={user.attributes.email} isToHex={true} />;

      const dataMap: WaevMetaRecord = {
        'waev-id': user.attributes.email ? idCell3 : emptyCell,
        // 'waev-first': user.attributes.firstName || emptyCell,
        // 'waev-last': user.attributes.lastName || emptyCell,
        'waev-email': user.attributes.email || emptyCell,
        'waev-permissions': emptyCell,
      };

      return dataMap;
    });
  }

  return { columns, rows };
};
