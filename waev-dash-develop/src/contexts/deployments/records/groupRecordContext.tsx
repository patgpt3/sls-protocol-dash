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
  useGetFullGroupUserDetails,
  useListFullGroupRecords,
  useListSlimGroupRecords,
  useListSlimGroupUserRecords,
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

  slimGroupData: SlimRecord[] | undefined;
  fullGroupData: FullRecord[] | undefined;
  waevTableGroupData: WaevTableRecord[];
  onClickGetFullGroupRecord: (id: string) => void;
  refetchSlimGroupRecords: () => void;

  uuidSearchInput: string | '';
  setUuidSearchInput: (uuidSearchInput: string) => void;
  onClickUserSearchSubmit: (isSearch: boolean) => void;
  isDisplayUserSearch: boolean | '';
  recordsPageNumber: number | undefined;
  setRecordsPageNumber: (page: number) => void;

  defaultEntriesPerPage: number;
  setDefaultEntriesPerPage: (defaultEntriesPerPage: number) => void;

  setSelectedGroupStoreId: (selectedRecordId: string | undefined) => void;
  selectedGroupStoreId: string | undefined;
  organizationDeploymentIds: string[];

  // User Record
  dataGetGroupUserDetails: UserDetails | undefined;
  selectedGroupUserDetailsId: string | undefined;
  userIdByGroupFieldName: string | undefined;
  setSelectedGroupUserDetailsId: (selectedGroupUserDetailsId: string) => void;
  isLoadingGetGroupUserDetails: boolean;
  handleShowGroupUserDetailsClick: (isShow?: boolean) => void;
  isShowGroupUserDetails: boolean;
  setIsShowGroupUserDetails: (isShowGroupUserDetails: boolean) => void;
}

export const GroupRecordContext = createContext<RecordWithSetter>({
  isLoadingData: false,
  isRefetchingData: false,
  slimGroupData: undefined,
  fullGroupData: undefined,
  waevTableGroupData: undefined,
  onClickGetFullGroupRecord: noop,
  refetchSlimGroupRecords: noop,

  uuidSearchInput: undefined,
  setUuidSearchInput: noop,
  onClickUserSearchSubmit: noop,
  isDisplayUserSearch: false,
  recordsPageNumber: undefined,
  setRecordsPageNumber: noop,
  defaultEntriesPerPage: 5,
  setDefaultEntriesPerPage: noop,

  setSelectedGroupStoreId: noop,
  selectedGroupStoreId: undefined,
  organizationDeploymentIds: [],

  // User Record
  dataGetGroupUserDetails: undefined,
  selectedGroupUserDetailsId: undefined,
  userIdByGroupFieldName: undefined,
  setSelectedGroupUserDetailsId: noop,
  isLoadingGetGroupUserDetails: false,
  handleShowGroupUserDetailsClick: noop,
  isShowGroupUserDetails: false,
  setIsShowGroupUserDetails: noop,
});

const MAX_AUTO_FULL_RECORDS = 0;

interface Props {}

export const GroupRecordContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const { selectedGroupId, selectedDeployment, organizationDeployments } =
    useContext(SelectedEntityContext);
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
  const [selectedGroupStoreId, setSelectedGroupStoreId] = useState<string | undefined>(undefined);
  const [userIdByGroupFieldName, setUserIdByGroupFieldName] = useState<string | undefined>(
    undefined
  );
  const [selectedGroupUserDetailsId, setSelectedGroupUserDetailsId] = useState<string | undefined>(
    undefined
  );
  const [isShowGroupUserDetails, setIsShowGroupUserDetails] = useState<boolean>(false);
  const [uuidSearchValue, setUuidSearchValue] = useState<string | undefined>(undefined);
  const [loadingStatusesCount, setLoadingStatusesCount] = useState<number>(0);
  const [fullData, setFullData] = useState<Record<string, FullRecord[]>>({});
  const [slimData, setSlimData] = useState<Record<string, FullRecord[]>>({});
  const [waevTableGroupData, setWaevTableGroupData] = useState<WaevTableRecord[]>([]);

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
  const [groupsCalled, addGroupIdToCalled] = useStringsQueue([]);

  // Gets Slim Records
  const {
    data: dataListSlimGroupRecords,
    isRefetching: isRefetchingSlimGroupRecords,
    refetch: refetchSlimGroupRecords,
    isLoading: isLoadingListSlimRecords,
  } = useListSlimGroupRecords(
    selectedGroupId,
    !!(selectedEntity?.id && selectedEntity?.id === selectedGroupId)
  );

  // Turns storeIdsToGet into Full Records
  const fullRecordsResults = useListFullGroupRecords(
    selectedGroupId,
    storeIdsToGet,
    !!(selectedEntity?.id && selectedEntity?.id === selectedGroupId)
  );

  // Gets Slim Records for Searched User
  const {
    data: dataListSlimRecordsByUser,
    isRefetching: isRefetchingSimRecordsByUserData,
    isLoading: isLoadingListRecordsByUser,
    refetch: getRecordsByUser,
  } = useListSlimGroupUserRecords(
    selectedGroupId,
    uuidSearchValue,
    !!(selectedEntity?.id && selectedEntity?.id === selectedGroupId)
  );

  // When entity selected, re-fetches slim records if not already pulled.
  useEffect(() => {
    if (
      selectedEntity?.id &&
      selectedEntity?.id === selectedGroupId &&
      !groupsCalled.includes(selectedGroupId)
    ) {
      refetchSlimGroupRecords();
      addGroupIdToCalled(selectedGroupId);
    }
  }, [selectedEntity, selectedGroupId]);

  // Gets Full Record Details for Selected User
  const { data: dataGetGroupUserDetails, isLoading: isLoadingGetGroupUserDetails } =
    useGetFullGroupUserDetails(
      selectedGroupId,
      selectedGroupUserDetailsId,
      !!(selectedEntity?.id && selectedEntity?.id === selectedGroupId)
    );

  // Record Page Handler
  const setRecordsPageNumber = (page: number) => {
    const obj: any = {};
    obj[`${selectedGroupId}`] = page;
    setRecordsPageNumbers({ ...recordsPageNumbers, ...obj });
  };

  // Handles adding to the queue for processing full records.
  const onAddToQueue = (storeId: string) => {
    // When Record is being added to queue, update waevTableGroupData with a loading state for that element.
    addIdsToProcessFullQueue(storeId);
    let waevClone = [...waevTableGroupData];
    const matchedIndex = waevClone.findIndex((obj) => obj.storeId === storeId);
    waevClone[matchedIndex].isLoadingFull = true;
    waevClone[matchedIndex].errorFull = undefined;
    setWaevTableGroupData(waevClone);
  };

  // Handles adding multiple to the queue for processing full records.
  const onAddsToProcessFullQueue = (storeIds: string[]) => {
    // When Record is being added to queue, update waevTableGroupData with a loading state for that element.
    addIdsToProcessFullQueue(storeIds);
    let waevClone = [...waevTableGroupData];
    storeIds.forEach((storeId) => {
      if (!queueOfIdsMadeFull.includes(storeId)) {
        const matchedIndex = waevClone.findIndex((obj) => obj.storeId === storeId);
        waevClone[matchedIndex].isLoadingFull = true;
        waevClone[matchedIndex].errorFull = undefined;
      }
    });
    setWaevTableGroupData(waevClone);
  };

  // Gets all Deployment Ids from Organization for useListOrgGroups hook, which gets all Groups in an Organization.
  const organizationDeploymentIds =
    organizationDeployments &&
    organizationDeployments.map((organizationDeployments) => organizationDeployments.id);

  // Gets the user field out of the Deployment's config.
  useEffect(() => {
    selectedDeployment &&
      setUserIdByGroupFieldName(selectedDeployment.attributes.config?.user_field);
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

  useEffect(() => {
    // Pulls in Group/User Search Data and Sets that as the Table Data.
    if (isDisplayUserSearch) {
      let slimDataRecords = { ...slimData };
      // TODO(MFB): Should we set this as another key rather than replace?
      slimDataRecords[selectedGroupId] = dataListSlimRecordsByUser;
      setSlimData(slimDataRecords);

      setWaevTableGroupData(
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
      slimDataRecords[selectedGroupId] = dataListSlimGroupRecords;
      setSlimData(slimDataRecords);

      setWaevTableGroupData(
        dataListSlimGroupRecords && dataListSlimGroupRecords.length
          ? dataListSlimGroupRecords.map((result) => {
              return {
                slimRecordId: result.attributes.store_id,
                storeId: result.attributes.store_id,
                transactions: result.attributes.transactions,
              } as WaevTableRecord;
            })
          : []
      );
    }
  }, [isDisplayUserSearch, dataListSlimGroupRecords, dataListSlimRecordsByUser]);

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
      let waevClone = [...waevTableGroupData];
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

      setWaevTableGroupData(waevClone);
      let fullDataRecords = { ...fullData };
      fullDataRecords[selectedGroupId] = fullRecordsResults
        .map((result) => result?.data?.data?.attributes)
        .filter((e) => e);
      setFullData(fullDataRecords);
      !fullRecordsResults.some((result) => result.isLoading) && setStoreIdsToGet([]);
    }
  }, [loadingStatusesCount, selectedEntity]);

  // Sets loading status
  useEffect(() => {
    setIsLoadingData(isLoadingListSlimRecords || isLoadingListRecordsByUser);
  }, [isLoadingListSlimRecords, isLoadingListRecordsByUser]);

  const onClickGetFullGroupRecord = (id: string) => {
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
      waevTableGroupData && waevTableGroupData.length > 0 && waevTableGroupData.filter((e) => e);

    if (waevData && selectedGroupStoreId) {
      let id = '' as string;
      const selectedRecord = waevData.find((datum) => datum.storeId === selectedGroupStoreId);
      if (
        selectedRecord?.fullRecord?.attributes?.pii?.data &&
        selectedRecord?.fullRecord?.attributes?.pii?.data[userIdByGroupFieldName]
      ) {
        id = selectedRecord?.fullRecord?.attributes?.pii?.data[userIdByGroupFieldName] as string;
      } else if (
        selectedRecord?.fullRecord?.attributes?.anon?.data &&
        selectedRecord?.fullRecord?.attributes?.anon?.data[userIdByGroupFieldName]
      ) {
        id = selectedRecord?.fullRecord?.attributes?.anon?.data[userIdByGroupFieldName] as string;
      }

      setSelectedGroupUserDetailsId(id);
    }
  };

  // Handles click of show user details, calls select user id function.
  const handleShowGroupUserDetailsClick = (isShow: boolean) => {
    setIsShowGroupUserDetails(isShow);
    handleSelectUserDetailsId();
  };

  // When record is selected, handles the select of that user.
  useEffect(() => {
    selectedGroupStoreId && handleSelectUserDetailsId();
  }, [selectedGroupStoreId]);

  // Cleanup when selected entity changes.
  useEffect(() => {
    setStoreIdsToGet([]);
    setUuidSearchInput(undefined);
  }, [selectedGroupId]);

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
    selectedGroupUserDetailsId && getRecordsByUser();
  }, [selectedGroupUserDetailsId]);

  return (
    <GroupRecordContext.Provider
      value={{
        // isLoadingData: isLoadingSlimRecordsByGroup || isLoadingListRecordsByUser,
        isLoadingData,
        isRefetchingData: isRefetchingSlimGroupRecords || isRefetchingSimRecordsByUserData,
        slimGroupData: slimData[selectedGroupId],
        fullGroupData: fullData[selectedGroupId],
        waevTableGroupData,
        onClickGetFullGroupRecord,
        refetchSlimGroupRecords,

        uuidSearchInput,
        setUuidSearchInput,
        onClickUserSearchSubmit,
        isDisplayUserSearch,
        recordsPageNumber: recordsPageNumbers?.[selectedGroupId] ?? undefined,
        setRecordsPageNumber,
        defaultEntriesPerPage,
        setDefaultEntriesPerPage,
        setSelectedGroupStoreId,
        selectedGroupStoreId,
        organizationDeploymentIds,

        // User Records
        dataGetGroupUserDetails,
        selectedGroupUserDetailsId,
        userIdByGroupFieldName,
        setSelectedGroupUserDetailsId,
        isLoadingGetGroupUserDetails,
        handleShowGroupUserDetailsClick,
        isShowGroupUserDetails,
        setIsShowGroupUserDetails,
      }}
    >
      {children}
    </GroupRecordContext.Provider>
  );
};
