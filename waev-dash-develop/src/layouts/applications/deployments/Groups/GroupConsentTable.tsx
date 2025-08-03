import { useContext, useEffect, useState } from 'react';

import { DataTable } from 'components';

// Waev Dashboard components
import MDBox from 'components/Elements/MDBox';

import { CurrentUserContext, SelectedEntityContext } from 'contexts';
import { ComparatorValues, Group, OptInFlag } from 'types';
import { useListOptInFlags, useLocalStorageByUser } from 'hooks';
import { Icon } from '@mui/material';

type OptInRow = Record<string, string | JSX.Element>;

interface GroupConsentTableProps {
  group: Group;
}

export function GroupConsentTable({ group }: GroupConsentTableProps): JSX.Element {
  const [pageNumber, setPageNumber] = useState<number>(0);

  const { selectedDeploymentId } = useContext(SelectedEntityContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [groupOptIns, setGroupOptIns] = useState<OptInFlag[]>([]);

  const { data: optInFlags, isLoading: isLoadingOptInFlags } =
    useListOptInFlags(selectedDeploymentId);

  const [defaultEntriesPerPage, setDefaultEntriesPerPage] = useLocalStorageByUser<number>(
    currentUser.id,
    'AccessDefaultEntriesPerPage',
    25
  );

  useEffect(() => {
    if (group && optInFlags?.length) {
      setGroupOptIns(
        optInFlags.filter((flag) =>
          group.attributes.config.flags
            // @ts-ignore
            .map((f) => f)
            .includes(flag?.id)
        )
      );
    }
  }, [optInFlags, group]);

  const columns = [
    {
      Header: '',
      accessor: 'flag-checkbox',
      // tooltip:
      //   'An opt-in field is eligible for deletion until a record is saved using that field.',
    },
    {
      Header: 'Consent Description',
      accessor: 'flag-name',
      width: '30%',
    },
    {
      Header: 'Source Field',
      accessor: 'flag-selector',
      width: '30%',
    },
    {
      Header: 'Comparison',
      accessor: 'flag-comparison',
      width: '30%',
    },
  ];

  let rows: OptInRow[] = [];

  if (groupOptIns?.length) {
    rows = groupOptIns?.map((flag: OptInFlag) => {
      return {
        'flag-checkbox': (
          <Icon fontSize="medium" color="success">
            gpp_good
          </Icon>
        ),
        'flag-name': flag.attributes.name,
        'flag-selector': flag.attributes.field_selector,
        'flag-comparison':
          ComparatorValues[flag.attributes.comparator].label ?? flag.attributes.comparator,
      };
    });
  }

  return (
    <MDBox mt={4} sx={{ mx: 'auto' }}>
      {(groupOptIns || []).length > 0 ? (
        <DataTable
          isLoading={isLoadingOptInFlags}
          renderLoader={isLoadingOptInFlags}
          table={{ columns, rows }}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          defaultEntriesPerPage={defaultEntriesPerPage}
          setDefaultEntriesPerPage={setDefaultEntriesPerPage}
          isHidePages={!groupOptIns?.length || groupOptIns?.length < 6}
          sx={
            {
              'thead>tr>th:nth-of-type(1)>div': { display: 'none' },
            }
          } // This forces the hide of the column sort.
        />
      ) : (
        <></>
      )}
    </MDBox>
  );
}
