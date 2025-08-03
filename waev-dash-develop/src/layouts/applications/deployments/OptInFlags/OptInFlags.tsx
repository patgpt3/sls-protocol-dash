import { Autocomplete, Icon, IconButton, Tooltip } from '@mui/material';
import {
  ConfirmationModal,
  DataTable,
  FlashingLoader,
  MDBox,
  MDInput,
  MDTypography,
  FancyCheckbox,
} from 'components';
import { CurrentUserContext, DeploymentContext, OptInFlagContext, OptInFlagContextProvider } from 'contexts';
import { useContext, useLocalStorageByUser, useState } from 'hooks';
import { InputEvent, OptInFlag, ComparatorValues } from 'types';

interface OptInFlagsProps {
  isUpdating?: boolean;
  isLoading?: boolean;
}

type OptInRow = Record<string, string | JSX.Element>;

export function OptInFlags({ isUpdating, isLoading }: OptInFlagsProps): JSX.Element {
  const { ingestUserField, ingestFieldsInput, ingestPrivateFieldsInput } =
    useContext(DeploymentContext);
  const { currentUser } = useContext(CurrentUserContext);
  const {
    comparisonInput,
    createOptInFlag,
    deleteOptInFlag,
    flagDescriptionInput,
    flagValueInput,
    isLoadingOptInFlags,
    optInFlags,
    flagsQueue,
    setComparisonInput,
    setFlagDescriptionInput,
    setFlagValueInput,
    setUpdatingOptInFlag,
    isActive,
    setIsActive,
    updateFlagsQueue,
  } = useContext(OptInFlagContext);

  const [pageNumber, setPageNumber] = useState<number>(0);
  const [defaultEntriesPerPage, setDefaultEntriesPerPage] = useLocalStorageByUser<number>(
    currentUser.id,
    'OptInFlagDefaultEntriesPerPage',
    25
  );
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);

  // @ts-ignore
  const comparatorOptions = Object.keys(ComparatorValues).map((key) => ComparatorValues[key].label);

  const columns = [
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
    {
      Header: 'Active',
      accessor: 'flag-active',
      width: '15%',
    },
    {
      Header: '',
      accessor: 'flag-buttons',
    },
  ];

  const renderActiveCheckbox = (flag: OptInFlag, flagsQueue: OptInFlag[]) => {
    let updatedFlag = flagsQueue.find((item) => item.id === flag.id);
    let displayedFlag = updatedFlag ?? flag;
    return (
      <FancyCheckbox
        isSelected={displayedFlag.attributes.active}
        onSelect={() => updateFlagsQueue(displayedFlag)}
        icon={displayedFlag.attributes.active ? 'check' : ''}
        tooltip="This setting will toggle displaying the opt-in field in Records view. Once set up, Opt-In flags will always be present and ingesting data, regardless of the value of this setting."
        tooltipPlacement="top"
        isDisabled={isLoading}
      />
    );
  };

  let rows: OptInRow[] = [];

  if (optInFlags?.length) {
    rows = optInFlags?.map((flag: OptInFlag) => {
      if (isUpdating) {
        const buttonRemove = flag.attributes.can_delete ? (
          <IconButton
            size="small"
            aria-label="delete-flag"
            color="error"
            onClick={() => {
              setUpdatingOptInFlag(flag);
              setIsConfirmDelete(true);
            }}
          >
            <Icon fontSize="small">delete</Icon>
          </IconButton>
        ) : (
          <Tooltip
            title="Cannot Delete - a record already exists using this field value."
            placement="top"
          >
            <MDBox>
              <IconButton
                size="small"
                aria-label="delete-flag-disabled"
                color="error"
                disabled={true}
              >
                <Icon fontSize="small" color="error" sx={{ opacity: 0.5 }}>
                  delete
                </Icon>
              </IconButton>
            </MDBox>
          </Tooltip>
        );

        return {
          'flag-name': flag.attributes.name,
          'flag-selector': flag.attributes.field_selector,
          'flag-comparison':
            ComparatorValues[flag.attributes.comparator]?.label ?? flag.attributes.comparator,
          'flag-active': renderActiveCheckbox(flag, flagsQueue),
          'flag-buttons': buttonRemove,
        };
      }
      return {
        'flag-name': flag.attributes.name,
        'flag-selector': flag.attributes.field_selector,
        'flag-comparison':
          ComparatorValues[flag.attributes.comparator]?.label ?? flag.attributes.comparator,
        'flag-active': flag.attributes.active ? 'Active' : 'Inactive',
      };
    });
  }

  if (isUpdating) {
    const nameInput = (
      <MDInput
        // fullWidth
        label="Description"
        value={flagDescriptionInput}
        onChange={(e: InputEvent) => setFlagDescriptionInput(e.target.value)}
      // placeholder=""
      // inputProps={{ type: 'password', autoComplete: '' }}
      />
    );
    const fieldOptions = [
      ...new Set(
        (ingestFieldsInput?.length ? ingestFieldsInput : [])
          .concat(ingestPrivateFieldsInput?.length ? ingestPrivateFieldsInput : [])
          .concat([ingestUserField])
      ),
    ];
    const fieldSelector = (
      <MDInput
        fullWidth
        label="Value"
        value={flagValueInput}
        onChange={(e: InputEvent) => setFlagValueInput(e.target.value)}
      />
    );

    const comparatorSelector = (
      <Autocomplete
        fullWidth
        // @ts-ignore
        defaultValue={comparatorOptions[0]}
        disableClearable
        // @ts-ignore
        value={comparisonInput}
        options={comparatorOptions}
        renderOption={(props, option) => {
          let comparatorObj = Object.keys(ComparatorValues)
            .map((key) => ComparatorValues[key])
            .find((item) => item.label === option);
          let tooltipNode = comparatorObj ? (
            <MDBox
              dangerouslySetInnerHTML={{ __html: comparatorObj.tooltip }}
              color="white"
            ></MDBox>
          ) : (
            ''
          );
          return (
            // @ts-ignore
            <MDBox key={option} {...props}>
              <Tooltip
                key={option}
                title={tooltipNode}
                placement="left"
                componentsProps={{
                  tooltip: {
                    sx: {
                      textAlign: 'left !important',
                    },
                  },
                }}
              >
                <MDTypography variant="button" fontWeight="regular" color="text">
                  {option}
                </MDTypography>
              </Tooltip>
            </MDBox>
          );
        }}
        inputValue={comparisonInput}
        onInputChange={(_, i) => setComparisonInput(i)}
        getOptionLabel={(option) => option}
        isOptionEqualToValue={(option, value) => option === value}
        size="medium"
        renderInput={(params) => <MDInput {...params} label={'Comparison'} />}
      />
    );

    const headerActiveCheckbox = (
      <FancyCheckbox
        isSelected={isActive}
        onSelect={() => setIsActive(!isActive)}
        icon={isActive ? 'check' : ''}
        tooltip="If a record is active, it will display on the records page. This has no effect on the actual data"
        tooltipPlacement="top"
      />
    );

    const addButton =
      flagDescriptionInput &&
        !fieldOptions?.includes(flagDescriptionInput) &&
        flagValueInput &&
        comparatorOptions.includes(comparisonInput) ? (
        <IconButton
          size="small"
          aria-label="create-flag"
          color="success"
          onClick={() => createOptInFlag()}
        >
          <Icon fontSize="small">add_circle</Icon>
        </IconButton>
      ) : (
        <IconButton size="small" aria-label="create-flag-disabled" color="success" disabled={true}>
          <Icon fontSize="small" color="success" sx={{ opacity: 0.5 }}>
            add_circle
          </Icon>
        </IconButton>
      );

    rows?.unshift({
      'flag-name': nameInput,
      'flag-selector': fieldSelector,
      'flag-comparison': comparatorSelector,
      'flag-active': headerActiveCheckbox,
      'flag-buttons': addButton,
    });
  }

  return isLoadingOptInFlags ? (
    <MDBox width="100%">
      <FlashingLoader />
    </MDBox>
  ) : (
    <>
      <OptInFlagContextProvider>
        {optInFlags?.length || isUpdating ? (
          <>
            <ConfirmationModal
              isOpen={isConfirmDelete}
              setIsOpen={setIsConfirmDelete}
              title="Delete Opt-In?"
              description="Are you sure you want to remove this opt-in field?"
              primaryText="Yes"
              onPrimaryClick={() => {
                deleteOptInFlag();
                setIsConfirmDelete(false);
              }}
              secondaryText="Cancel"
              onSecondaryClick={() => {
                setIsConfirmDelete(false);
                setUpdatingOptInFlag(undefined);
              }}
            />
            <DataTable
              isLoading={false}
              renderLoader={false}
              table={{ columns, rows }}
              canSearch={false}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              showTotalEntries={!isLoadingOptInFlags && optInFlags?.length > 4}
              defaultEntriesPerPage={defaultEntriesPerPage}
              setDefaultEntriesPerPage={setDefaultEntriesPerPage}
              isHidePages={!optInFlags?.length || optInFlags?.length < 6}
              sx={{
                'tbody>tr>td>div': { width: '100%' }, // Cell width 100%
                'thead>tr>th:last-of-type>div': { display: 'none' }, // This forces the hide of the column sort.
              }}
            />
          </>
        ) : (
          <MDBox display="flex" alignItems="center" justifyContent="center">
            <MDTypography variant="button" fontWeight="light" color="text" justifyContent="center">
              No Opt-Ins Configured
            </MDTypography>
          </MDBox>
        )}
      </OptInFlagContextProvider>
    </>
  );
}
