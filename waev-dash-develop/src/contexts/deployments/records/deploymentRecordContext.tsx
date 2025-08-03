import { createContext, PropsWithChildren, useContext } from 'react';
import {
  FullRecord,
  RecordsPage,
  RootStateType,
  SlimRecord,
  UserDetails,
  WaevTableRecord,
} from 'types';
import {
  useEffect,
  useGetFullDeploymentUserDetails,
  useListFullDeploymentRecords,
  useListSlimDeploymentRecords,
  useListSlimDeploymentUserRecords,
  useLocalStorage,
  useLocalStorageByUser,
  useSelector,
  useState,
  useStringsQueue,
} from 'hooks';
import { noop } from 'utils';
import { RecordContext, SelectedEntityContext } from 'contexts';

interface RecordWithSetter {
  isLoadingData: boolean;
  isRefetchingData: boolean;

  slimData: SlimRecord[] | undefined;
  fullData: FullRecord[] | undefined;
  waevDeploymentRecordTableData: WaevTableRecord[];
  onClickGetFullRecord: (id: string) => void;
  refetchSlimDeploymentRecords: () => void;

  uuidSearchInput: string | '';
  setUuidSearchInput: (uuidSearchInput: string) => void;
  onClickUserSearchSubmit: (isSearch: boolean) => void;
  isDisplayUserSearch: boolean | '';
  recordsPageNumber: number | undefined;
  setRecordsPageNumber: (page: number) => void;

  defaultEntriesPerPage: number;
  setDefaultEntriesPerPage: (defaultEntriesPerPage: number) => void;
  setSelectedStoreId: (selectedRecordId: string | undefined) => void;
  selectedStoreId: string | undefined;
  selectedRecord: WaevTableRecord | undefined;
  setSelectedRecord: (selectedRecord: WaevTableRecord | undefined) => void;

  // User Record
  dataGetUserDetails: UserDetails | undefined;
  selectedUserDetailsId: string | undefined;
  userIdFieldName: string | undefined;
  setSelectedUserDetailsId: (selectedUserDetailsId: string) => void;
  isLoadingGetUserDetails: boolean;
  handleShowUserDetailsClick: (isShow?: boolean) => void;
  isShowUserDetails: boolean;
  setIsShowUserDetails: (isShowUserDetails: boolean) => void;
}

export const DeploymentRecordContext = createContext<RecordWithSetter>({
  isLoadingData: false,
  isRefetchingData: false,
  slimData: undefined,
  fullData: undefined,
  waevDeploymentRecordTableData: undefined,
  onClickGetFullRecord: noop,
  refetchSlimDeploymentRecords: noop,

  uuidSearchInput: undefined,
  setUuidSearchInput: noop,
  onClickUserSearchSubmit: noop,
  isDisplayUserSearch: false,
  recordsPageNumber: undefined,
  setRecordsPageNumber: noop,
  defaultEntriesPerPage: 5,
  setDefaultEntriesPerPage: noop,
  setSelectedStoreId: noop,
  selectedStoreId: undefined,
  selectedRecord: undefined,
  setSelectedRecord: noop,

  // User Record
  dataGetUserDetails: undefined,
  selectedUserDetailsId: undefined,
  userIdFieldName: undefined,
  setSelectedUserDetailsId: noop,
  isLoadingGetUserDetails: false,
  handleShowUserDetailsClick: noop,
  isShowUserDetails: false,
  setIsShowUserDetails: noop,
});

const MAX_AUTO_FULL_RECORDS = 0;

interface Props {}

export const DeploymentRecordContextProvider = ({
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { selectedDeploymentId, selectedDeployment } = useContext(SelectedEntityContext);
  const {
    uuidSearchInput,
    setUuidSearchInput,
    isDisplayUserSearch,
    setIsDisplayUserSearch,
    selectedEntity,
  } = useContext(RecordContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [storeIdsToGet, setStoreIdsToGet] = useState<string[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<WaevTableRecord | undefined>(undefined);
  const [userIdFieldName, setUserIdFieldName] = useState<string | undefined>(undefined);
  const [selectedUserDetailsId, setSelectedUserDetailsId] = useState<string | undefined>(undefined);
  const [isShowUserDetails, setIsShowUserDetails] = useState<boolean>(false);
  const [uuidSearchValue, setUuidSearchValue] = useState<string | undefined>(undefined);
  const [loadingStatusesCount, setLoadingStatusesCount] = useState<number>(0);
  const [fullData, setFullData] = useState<Record<string, FullRecord[]>>({});
  const [slimData, setSlimData] = useState<Record<string, FullRecord[]>>({});
  const [waevDeploymentRecordTableData, setWaevDeploymentRecordTableData] = useState<
    WaevTableRecord[]
  >([]);

  const [recordsPageNumbers, setRecordsPageNumbers] = useLocalStorageByUser<
    RecordsPage | undefined | null
  >(currentUser?.id, 'RecordsPage', undefined);
  const [defaultEntriesPerPage, setDefaultEntriesPerPage] = useLocalStorage<number>(
    `DefaultEntriesPerPage`,
    5
  );

  const [queueOfIdsToMakeFull, addIdsToProcessFullQueue, removeIdFromProcessFullQueue] =
    useStringsQueue([]);
  const [queueOfIdsMadeFull, addIdsToProcessedFullQueue] = useStringsQueue([]);
  const [deploymentsCalled, addDeploymentIdToCalled] = useStringsQueue([]);

  // Gets Slim Records
  const {
    data: dataListSlimDeploymentRecords,
    isRefetching: isRefetchingSlimDeploymentRecordsData,
    refetch: refetchSlimDeploymentRecords,
    isLoading: isLoadingListDeploymentRecords,
  } = useListSlimDeploymentRecords(selectedDeployment?.id, !!selectedEntity?.id);

  // Turns storeIdsToGet into Full Records
  const fullRecordsResults = useListFullDeploymentRecords(
    selectedDeployment?.id,
    storeIdsToGet,
    !!selectedEntity?.id
  );

  // Gets Slim Records for Searched User
  const {
    data: dataListSlimRecordsByUser,
    isRefetching: isRefetchingSimRecordsByUserData,
    isLoading: isLoadingListRecordsByUser,
    refetch: getRecordsByUser,
  } = useListSlimDeploymentUserRecords(selectedDeploymentId, uuidSearchValue, !!selectedEntity?.id);

  // When entity selected, re-fetches slim records if not already pulled.
  useEffect(() => {
    if (selectedEntity?.id && !deploymentsCalled.includes(selectedDeployment?.id)) {
      refetchSlimDeploymentRecords();
      addDeploymentIdToCalled(selectedDeployment.id);
    }
  }, [selectedEntity, selectedDeployment]);

  // Gets Full Record Details for Selected User
  const { data: dataGetUserDetails, isLoading: isLoadingGetUserDetails } =
    useGetFullDeploymentUserDetails(
      selectedDeploymentId,
      selectedUserDetailsId,
      !!selectedEntity?.id
    );

  // Record Page Handler
  const setRecordsPageNumber = (page: number) => {
    const obj: any = {};
    obj[`${selectedDeploymentId}`] = page;
    setRecordsPageNumbers({ ...recordsPageNumbers, ...obj });
  };

  // Handles adding to the queue for processing full records.
  const onAddToQueue = (storeId: string) => {
    // When Record is being added to queue, update waevDeploymentRecordTableData with a loading state for that element.
    addIdsToProcessFullQueue(storeId);
    let waevClone = [...waevDeploymentRecordTableData];
    const matchedIndex = waevClone.findIndex((obj) => obj.storeId === storeId);
    waevClone[matchedIndex].isLoadingFull = true;
    waevClone[matchedIndex].errorFull = undefined;
    setWaevDeploymentRecordTableData(waevClone);
  };

  // Handles adding multiple to the queue for processing full records.
  const onAddsToProcessFullQueue = (storeIds: string[]) => {
    // When Record is being added to queue, update waevDeploymentRecordTableData with a loading state for that element.
    addIdsToProcessFullQueue(storeIds);
    let waevClone = [...waevDeploymentRecordTableData];
    storeIds.forEach((storeId) => {
      if (!queueOfIdsMadeFull.includes(storeId)) {
        const matchedIndex = waevClone.findIndex((obj) => obj.storeId === storeId);
        waevClone[matchedIndex].isLoadingFull = true;
        waevClone[matchedIndex].errorFull = undefined;
      }
    });
    setWaevDeploymentRecordTableData(waevClone);
  };

  // Gets the user field out of the Deployment's config.
  useEffect(() => {
    selectedDeployment && setUserIdFieldName(selectedDeployment.attributes.config?.user_field);
  }, [selectedDeployment]);

  // Resets loading count when entity changes.
  useEffect(() => {
    setLoadingStatusesCount(0);
  }, [selectedEntity?.id]);

  useEffect(() => {
    // When slim data comes in, pulls out specified number of ids to full query.
    if (slimData && slimData[selectedEntity?.id] && slimData[selectedEntity?.id].length) {
      setStoreIdsToGet(
        slimData[selectedEntity?.id]
          .map((data: any) => data.attributes?.store_id)
          // Only grabs the specified number of records to query
          ?.slice(0, MAX_AUTO_FULL_RECORDS)
      );

      // Adds id strings to queue.
      const records = slimData[selectedEntity?.id]
        // Removes 'ceramic://' from the address
        .map((data: any) => data.attributes?.store_id)
        // Only grabs the specified number of records to query
        ?.slice(0, MAX_AUTO_FULL_RECORDS);

      onAddsToProcessFullQueue(records);
    }
    setRecordsPageNumber(0);
  }, [slimData, selectedEntity?.id]);

  // Takes Deployment/User Search Data and Sets that as the Table Data.
  useEffect(() => {
    if (isDisplayUserSearch) {
      let slimDataRecords = { ...slimData };
      // TODO(MFB): Should we set this as another key rather than replace?
      slimDataRecords[selectedDeployment?.id] = dataListSlimRecordsByUser;
      setSlimData(slimDataRecords);

      setWaevDeploymentRecordTableData(
        dataListSlimRecordsByUser && dataListSlimRecordsByUser.length
          ? dataListSlimRecordsByUser.map((result) => {
              return {
                slimRecordId: result.attributes.store_id,
                storeId: result.attributes.store_id,
                transactions: result.attributes.transactions,
              } as WaevTableRecord;
            })
          : []
      );
    } else {
      let slimDataRecords = { ...slimData };
      slimDataRecords[selectedDeployment?.id] = dataListSlimDeploymentRecords;
      setSlimData(slimDataRecords);

      setWaevDeploymentRecordTableData(
        dataListSlimDeploymentRecords && dataListSlimDeploymentRecords.length
          ? dataListSlimDeploymentRecords.map((result) => {
              return {
                slimRecordId: result.attributes.store_id,
                storeId: result.attributes.store_id,
                transactions: result.attributes.transactions,
              } as WaevTableRecord;
            })
          : []
      );
    }
  }, [isDisplayUserSearch, dataListSlimDeploymentRecords, dataListSlimRecordsByUser]);

  // Watches the results so that we don't do large number operations repeatedly.
  useEffect(() => {
    const count = fullRecordsResults?.reduce(
      (acc, result) => (result.isLoading ? acc : acc + 1),
      0
    );

    count && setLoadingStatusesCount(count);
  }, [fullRecordsResults]);

  useEffect(() => {
    // Checks to see if any results are loading and sets.
    fullRecordsResults &&
      fullRecordsResults.length &&
      setIsLoadingData(fullRecordsResults.some((result) => result.isLoading));

    if (fullRecordsResults && fullRecordsResults.length) {
      let waevClone = [...waevDeploymentRecordTableData];
      // When Full Records come in, take the queue of ids and look to see which ones have successes.
      // Add those successes to the Waev Table Data; Remove the ID from the queue.
      queueOfIdsToMakeFull.forEach((queueId) => {
        const match = fullRecordsResults.find(
          (fullRecord) =>
            fullRecord?.data?.data?.attributes?.store_id === queueId ||
            (fullRecord?.error && fullRecord?.error?.data?.storeId === queueId)
        );
        if (match && match.isLoading === false) {
          if (match.status === 'success') {
            const matchedIndex = waevClone.findIndex((obj) => obj.storeId === queueId);
            waevClone[matchedIndex].errorFull = undefined;
            waevClone[matchedIndex].fullRecord = match?.data?.data;
            waevClone[matchedIndex].isLoadingFull = false;
            addIdsToProcessedFullQueue(queueId);
            removeIdFromProcessFullQueue(queueId);
          }
          if (match.status === 'error' && match.error) {
            const matchedIndex = waevClone.findIndex((obj) => obj.storeId === queueId);
            waevClone[matchedIndex].errorFull = match.error;
            waevClone[matchedIndex].isLoadingFull = false;
            addIdsToProcessedFullQueue(queueId);
            removeIdFromProcessFullQueue(queueId);
          }
        }
      });

      setWaevDeploymentRecordTableData(waevClone);
      let fullDataRecords = { ...fullData };
      fullDataRecords[selectedDeployment?.id] = fullRecordsResults
        .map((result) => result?.data?.data?.attributes)
        .filter((e) => e);
      setFullData(fullDataRecords);
      !fullRecordsResults.some((result) => result.isLoading) && setStoreIdsToGet([]);
    }
  }, [loadingStatusesCount, selectedEntity]);

  // Sets loading status
  useEffect(() => {
    setIsLoadingData(isLoadingListDeploymentRecords || isLoadingListRecordsByUser);
  }, [isLoadingListDeploymentRecords, isLoadingListRecordsByUser]);

  const onClickGetFullRecord = (id: string) => {
    // Currently adds the old id back to the list and finds those, with the old ones being cached.
    setStoreIdsToGet([...storeIdsToGet, id]);
    onAddToQueue(id);
  };

  // Handles click of user search submit
  const onClickUserSearchSubmit = (isUserSearch: boolean) => {
    if (isUserSearch) {
      setStoreIdsToGet([]);
      setUuidSearchValue(uuidSearchInput);
      setIsDisplayUserSearch(true);
    } else {
      setIsDisplayUserSearch(false);
    }
  };

  // Handles select of user id
  const handleSelectUserDetailsId = () => {
    const waevData =
      waevDeploymentRecordTableData &&
      waevDeploymentRecordTableData.length > 0 &&
      waevDeploymentRecordTableData.filter((e) => e);

    if (waevData && selectedStoreId) {
      let id = '' as string;
      const selectedRecord = waevData.find((datum) => datum.storeId === selectedStoreId);
      if (
        selectedRecord?.fullRecord?.attributes?.pii?.data &&
        selectedRecord?.fullRecord?.attributes?.pii?.data[userIdFieldName]
      ) {
        id = selectedRecord?.fullRecord?.attributes?.pii?.data[userIdFieldName] as string;
      } else if (
        selectedRecord?.fullRecord?.attributes?.anon?.data &&
        selectedRecord?.fullRecord?.attributes?.anon?.data[userIdFieldName]
      ) {
        id = selectedRecord?.fullRecord?.attributes?.anon?.data[userIdFieldName] as string;
      }

      setSelectedUserDetailsId(id);
    }
  };

  // Handles click of show user details, calls select user id function.
  const handleShowUserDetailsClick = (isShow: boolean) => {
    setIsShowUserDetails(isShow);
    handleSelectUserDetailsId();
  };

  // When record is selected, handles the select of that user.
  useEffect(() => {
    selectedStoreId && handleSelectUserDetailsId();
  }, [selectedStoreId]);

  // Cleanup when selected entity changes.
  useEffect(() => {
    setStoreIdsToGet([]);
    setUuidSearchInput(undefined);
  }, [selectedEntity?.id]);

  // When User search is updated, it validates and sets.
  useEffect(() => {
    if (!uuidSearchInput || uuidSearchInput === '') {
      setIsDisplayUserSearch(false);
    }
  }, [uuidSearchInput]);

  // When user search is validated, force get records by user.
  useEffect(() => {
    getRecordsByUser();
  }, [uuidSearchValue]);

  // When number of entries per page is changed, go back to first page. (defensively)
  useEffect(() => {
    setRecordsPageNumber(0);
  }, [defaultEntriesPerPage]);

  // When user id is selected, force get records by user.
  useEffect(() => {
    selectedUserDetailsId && getRecordsByUser();
  }, [selectedUserDetailsId]);

  return (
    <DeploymentRecordContext.Provider
      value={{
        isLoadingData,
        isRefetchingData: isRefetchingSlimDeploymentRecordsData || isRefetchingSimRecordsByUserData,
        slimData: slimData[selectedDeploymentId],
        fullData: fullData[selectedDeploymentId],
        waevDeploymentRecordTableData,
        onClickGetFullRecord,
        refetchSlimDeploymentRecords,

        uuidSearchInput,
        setUuidSearchInput,
        onClickUserSearchSubmit,
        isDisplayUserSearch,
        recordsPageNumber: recordsPageNumbers?.[selectedDeploymentId] ?? undefined,
        setRecordsPageNumber,
        defaultEntriesPerPage,
        setDefaultEntriesPerPage,
        setSelectedStoreId,
        selectedStoreId,
        selectedRecord,
        setSelectedRecord,

        // User Records
        dataGetUserDetails,
        selectedUserDetailsId,
        userIdFieldName,
        setSelectedUserDetailsId,
        isLoadingGetUserDetails,
        handleShowUserDetailsClick,
        isShowUserDetails,
        setIsShowUserDetails,
      }}
    >
      {children}
    </DeploymentRecordContext.Provider>
  );
};
