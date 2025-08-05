/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useEffect, useState } from 'react';

// react-table components
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table';

// @mui material components
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Icon,
  Autocomplete,
} from '@mui/material';

// Waev Dashboard components
import { MDBox, MDTypography, MDInput, MDPagination, FlashingLoader } from 'components';
import { DataTableHeadCell } from './DataTableHeadCell';
import { DataTableBodyCell } from './DataTableBodyCell';
import { crossSiteFadeInKeyframes } from 'utils';
import colors from 'assets/theme-dark/base/colors';

// Declaring props types for DataTable
interface Props {
  table: {
    columns: { [key: string]: any }[];
    rows: { [key: string]: any }[];
  };
  pageNumber: number;
  setPageNumber: (page: number) => void;
  entriesPerPage?:
    | false
    | {
        defaultValue: number;
        entries: number[] | string[];
      };
  canSearch?: boolean;
  showTotalEntries?: boolean;
  pagination?: {
    variant: 'contained' | 'gradient';
    color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark' | 'light';
  };
  isSorted?: boolean;
  noEndBorder?: boolean;
  leftHeader?: JSX.Element;
  rightHeader?: JSX.Element;
  defaultEntriesPerPage?: number;
  setDefaultEntriesPerPage?: (defaultEntriesPerPage: number) => void;
  sx?: any;
  noDataText?: string | JSX.Element;
  isLoading?: boolean;
  renderLoader?: boolean;
  onRowClick?: (event: any, row: any) => void;
  isHidePages?: boolean;
}

export function DataTable({
  entriesPerPage = { defaultValue: 5, entries: ['5', '10', '25', '50', '100'] },
  canSearch = false,
  showTotalEntries = true,
  table,
  pagination = { variant: 'gradient', color: 'info' },
  isSorted = true,
  noEndBorder = false,
  leftHeader,
  rightHeader,
  pageNumber,
  setPageNumber,
  defaultEntriesPerPage,
  setDefaultEntriesPerPage,
  sx = {},
  noDataText,
  isLoading,
  renderLoader,
  onRowClick,
  isHidePages = false,
}: Props): JSX.Element {
  let defaultValue: any;
  let entries: any[];
  if (entriesPerPage) {
    defaultValue = defaultEntriesPerPage;
    entries = entriesPerPage.entries ? entriesPerPage.entries : ['5', '10', '25', '50', '100'];
  }

  const columns = useMemo<any>(() => table.columns, [table]);
  const data = useMemo<any>(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: pageNumber } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { background } = colors;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    // nextPage,
    // previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  }: any = tableInstance;
  // Set the default value for the entries per page when component mounts
  useEffect(() => {
    return setPageSize(defaultEntriesPerPage || 5);
  }, [defaultValue, setPageSize]);

  const goToPageHandler = (page: number) => {
    setPageNumber(page);
    return gotoPage(page);
  };

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value: any) => {
    setDefaultEntriesPerPage(value);
    goToPageHandler(0);

    return setPageSize(value);
  };

  // Render the paginations
  const renderPagination = Array.from({ length: pageOptions.length }).map((_, index) => (
    <MDPagination
      item
      key={index}
      onClick={() => goToPageHandler(index)}
      active={index === pageIndex}
    >
      {index + 1}
    </MDPagination>
  ));

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }: any) =>
    value > pageOptions.length || value < 0 ? goToPageHandler(0) : goToPageHandler(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = Array.from({ length: pageOptions.length }).map((_, index) => index + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }: any) => {
    return goToPageHandler(Number(value.value - 1));
  };

  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Search input state handle
  const onSearchChange = (value: string) => {
    setGlobalFilter(value || undefined);
  };

  // A function that sets the sorted value for the table
  const setSortedValue = (column: any) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? 'desc' : 'asce';
    } else if (isSorted) {
      sortedValue = column.disableSort ? false : 'none';
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Setting the entries starting point
  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  const onHandleClickNextPage = () => {
    return gotoPage(pageIndex + 1);
  };
  const onHandleClickPreviousPage = () => {
    return gotoPage(pageIndex - 1);
  };

  return (
    <MDBox sx={{ boxShadow: 'none', ...sx }}>
      {canSearch || leftHeader || rightHeader ? (
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          {leftHeader && (
            <MDBox display="flex" width="100%" alignItems="center">
              {leftHeader}
            </MDBox>
          )}
          {canSearch && (
            <MDBox width="12rem" ml="auto">
              <MDInput
                placeholder="Search..."
                value={search}
                size="small"
                fullWidth
                onChange={({ currentTarget }: any) => {
                  setSearch(search);
                  onSearchChange(currentTarget.value);
                }}
              />
            </MDBox>
          )}
          {rightHeader && (
            <MDBox width="18rem" ml="auto">
              {rightHeader}
            </MDBox>
          )}
        </MDBox>
      ) : null}
      {renderLoader ? (
        <MDBox width="100%" mb={3}>
          <FlashingLoader />
        </MDBox>
      ) : (
        <MDBox
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              width: '0.4em',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
              webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
              backgroundColor: 'rgba(0,0,0,.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(26, 115, 232,.5)',
              // outline: '1px solid slategrey'
            },
          }}
          mx={2}
        >
          <TableContainer sx={{ boxShadow: 'none', ...sx, maxHeight: '55vh' }}>
            <Table
              sx={{ marginBottom: 2, animation: `0.5s ease-out ${crossSiteFadeInKeyframes()}` }}
              {...getTableProps()}
              stickyHeader
            >
              <thead>
                {headerGroups.map((headerGroup: any) => (
                  <TableRow
                    {...headerGroup.getHeaderGroupProps()}
                    sx={{
                      position: 'sticky',
                      top: '0px',
                      left: '0px',
                      zIndex: 1000,
                      backgroundColor: background.card,
                    }}
                  >
                    {headerGroup.headers.map((column: any) => (
                      <DataTableHeadCell
                        {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                        width={column.width ? column.width : 'auto'}
                        align={column.align ? column.align : 'left'}
                        toolTipTitle={column.toolTipElement}
                        tooltipPlacement={column.tooltipPlacement}
                        headerColor={column.color ? column.color : 'white'}
                        sorted={setSortedValue(column)}
                        isFullOpacity={column.isFullOpacity}
                      >
                        {column.render('Header')}
                      </DataTableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </thead>
              <TableBody {...getTableBodyProps()}>
                {page.map((row: any, key: any) => {
                  prepareRow(row);
                  return onRowClick ? (
                    <TableRow
                      hover
                      onClick={(event: any) => onRowClick(event, row.original)}
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell: any) => (
                        <DataTableBodyCell
                          noBorder={noEndBorder && rows.length - 1 === key}
                          align={cell.column.align ? cell.column.align : 'left'}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </DataTableBodyCell>
                      ))}
                    </TableRow>
                  ) : (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell: any) => (
                        <DataTableBodyCell
                          noBorder={noEndBorder && rows.length - 1 === key}
                          align={cell.column.align ? cell.column.align : 'left'}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </DataTableBodyCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {table.rows.length !== 0 ? (
            <></>
          ) : isLoading ? (
            <MDBox
              alignSelf="center"
              // mr={1}
              sx={{ width: '25%' }}
              data-testid="table-loader"
            >
              <FlashingLoader />
            </MDBox>
          ) : (
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              {noDataText || ''}
            </MDTypography>
          )}
        </MDBox>
      )}
      {!isHidePages && (
        <MDBox
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
        >
          {showTotalEntries && (
            <MDBox mb={{ xs: 3, sm: 0 }}>
              <MDTypography variant="button" color="secondary" fontWeight="regular">
                Showing {entriesStart} to {entriesEnd} of {rows.length} entries
              </MDTypography>
            </MDBox>
          )}
          <MDBox>
            {pageOptions.length > 1 && (
              <MDPagination
                variant={pagination.variant ? pagination.variant : 'gradient'}
                color={pagination.color ? pagination.color : 'info'}
              >
                {canPreviousPage && (
                  <MDPagination item onClick={onHandleClickPreviousPage}>
                    <Icon sx={{ fontWeight: 'bold' }}>chevron_left</Icon>
                  </MDPagination>
                )}
                {pageOptions.length > 6 ? (
                  <MDBox width="5rem" mx={1}>
                    <MDInput
                      inputProps={{ type: 'number', min: 1, max: customizedPageOptions.length }}
                      value={customizedPageOptions[pageIndex]}
                      onChange={(event: any) => {
                        handleInputPagination(event);
                        handleInputPaginationValue(event);
                      }}
                    />
                  </MDBox>
                ) : (
                  renderPagination
                )}
                {canNextPage && (
                  <MDPagination item onClick={onHandleClickNextPage}>
                    <Icon sx={{ fontWeight: 'bold' }}>chevron_right</Icon>
                  </MDPagination>
                )}
              </MDPagination>
            )}
          </MDBox>

          {entriesPerPage && (
            <MDBox
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              pl={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
              pb={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
            >
              <MDBox display="flex" alignItems="center">
                <Autocomplete
                  disableClearable
                  value={pageSize.toString()}
                  options={entries}
                  onChange={(event, newValue) => {
                    // @ts-ignore
                    setEntriesPerPage(parseInt(newValue, 10));
                  }}
                  size="small"
                  sx={{ width: '5rem' }}
                  renderInput={(params) => <MDInput {...params} />}
                />
                <MDTypography variant="caption" color="secondary" mr={1}>
                  &nbsp;&nbsp;entries per page
                </MDTypography>
              </MDBox>
            </MDBox>
          )}
        </MDBox>
      )}
    </MDBox>
  );
}
