import { createContext, PropsWithChildren, useContext } from 'react';
import {
  useEffect,
  useState,
  useStringsQueue,
  useListDeploymentUserRecordsHistory,
  useListFullDeploymentRecords,
  useListFullGroupRecords,
} from 'hooks';
import { noop } from 'utils';
import { SelectedEntityContext, DeploymentRecordContext, RecordContext } from 'contexts';
import { FullRecord, WaevTableRecord } from 'types';

interface RecordWithSetter {
  isLoadingData: boolean;
  isRefetchingData: boolean;
  userRecordsData: WaevTableRecord[];
  onClickGetFullRecord: (id: string) => void;
  recordsPageNumber: number;
  setRecordsPageNumber: (page: number) => void;
  defaultEntriesPerPage: number;
  setDefaultEntriesPerPage: (defaultEntriesPerPage: number) => void;
  selectedUuid: string;
  clearRecordModalState: () => void;
}

export const DeploymentUserRecordsContext = createContext<RecordWithSetter>({
  isLoadingData: false,
  isRefetchingData: false,
  userRecordsData: undefined,
  onClickGetFullRecord: noop,
  recordsPageNumber: 0,
  setRecordsPageNumber: noop,
  defaultEntriesPerPage: 5,
  setDefaultEntriesPerPage: noop,
  selectedUuid: '',
  clearRecordModalState: noop,
});

const MAX_AUTO_FULL_USER_RECORDS = 10;

interface Props {}

export const DeploymentUserRecordsContextProvider = ({
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { selectedDeploymentId, selectedDeployment, selectedGroupId } =
    useContext(SelectedEntityContext);
  const { selectedUserDetailsId } = useContext(DeploymentRecordContext);
  const { selectedEntity } = useContext(RecordContext);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [storeIdsToGet, setStoreIdsToGet] = useState<string[]>([]);
  const [recordsPageNumber, setRecordsPageNumber] = useState<number>(0);
  const [defaultEntriesPerPage, setDefaultEntriesPerPage] = useState<number>(5);
  const [loadingStatusesCount, setLoadingStatusesCount] = useState<number>(0);
  const [fullData, setFullData] = useState<Record<string, FullRecord[]>>({});
  const [slimData, setSlimData] = useState<Record<string, FullRecord[]>>({});
  const [userRecordsData, setUserRecordsData] = useState<WaevTableRecord[]>([]);

  const [queueOfIdsToMakeFull, addIdsToProcessFullQueue, removeIdFromProcessFullQueue] =
    useStringsQueue([]);
  const [queueOfIdsMadeFull, addIdsToProcessedFullQueue] = useStringsQueue([]);

  // Get user records for a deployment
  const {
    data: dataListUserRecords,
    isRefetching: isRefetchingData,
    isLoading: isLoadingListUserRecords,
    refetch: refetchUserRecords,
  } = useListDeploymentUserRecordsHistory(selectedDeploymentId, selectedUserDetailsId);

  // Turns storeIdsToGet into Full Records
  const fullDeploymentResults = useListFullDeploymentRecords(
    selectedDeployment?.id,
    storeIdsToGet,
    !!selectedEntity?.id
  );

  const fullGroupResults = useListFullGroupRecords(
    selectedEntity?.id === selectedGroupId ? selectedGroupId : undefined,
    storeIdsToGet,
    !!selectedEntity
  );

  const fullRecordsResults = selectedGroupId ? [...fullGroupResults] : [...fullDeploymentResults];

  // When entity selected, re-fetches slim records if not already pulled.
  useEffect(() => {
    if (selectedEntity?.id) {
      refetchUserRecords();
    }
  }, [selectedEntity, selectedDeployment]);

  useEffect(() => {
    if (selectedUserDetailsId) {
      refetchUserRecords();
    }
  }, [selectedUserDetailsId]);

  // Handles adding to the queue for processing full records.
  const onAddToQueue = (storeId: string) => {
    // When Record is being added to queue, update userRecordsData with a loading state for that element.
    addIdsToProcessFullQueue(storeId);
    let waevClone = [...userRecordsData];
    const matchedIndex = waevClone.findIndex((obj) => obj?.storeId === storeId);
    if (waevClone[matchedIndex]) {
      waevClone[matchedIndex].isLoadingFull = true;
      waevClone[matchedIndex].errorFull = undefined;
    }
    setUserRecordsData(waevClone);
  };

  // Handles adding multiple to the queue for processing full records.
  const onAddsToProcessFullQueue = (storeIds: string[]) => {
    // When Record is being added to queue, update userRecordsData with a loading state for that element.
    addIdsToProcessFullQueue(storeIds);
    let waevClone = [...userRecordsData];
    storeIds.forEach((storeId) => {
      if (!queueOfIdsMadeFull.includes(storeId)) {
        const matchedIndex = waevClone.findIndex((obj) => obj.storeId === storeId);
        if (waevClone[matchedIndex]) {
          waevClone[matchedIndex].isLoadingFull = true;
          waevClone[matchedIndex].errorFull = undefined;
        }
      }
    });
    setUserRecordsData(waevClone);
  };

  // Resets loading count when entity changes.
  useEffect(() => {
    setLoadingStatusesCount(0);
  }, [selectedEntity?.id]);

  useEffect(() => {
    // When slim data comes in, pulls out specified number of ids to full query.
    if (slimData && slimData[selectedEntity?.id] && slimData[selectedEntity?.id].length) {
      setStoreIdsToGet(
        slimData[selectedEntity?.id]
          .map((data: any) => data?.attributes?.store_id)
          // Only grabs the specified number of records to query
          ?.slice(0, MAX_AUTO_FULL_USER_RECORDS)
      );

      // Adds id strings to queue.
      const records = slimData[selectedEntity?.id]
        // Removes 'ceramic://' from the address
        .map((data: any) => data?.attributes?.store_id)
        // Only grabs the specified number of records to query
        ?.slice(0, MAX_AUTO_FULL_USER_RECORDS);

      onAddsToProcessFullQueue(records);
    }
    setRecordsPageNumber(0);
  }, [slimData, selectedEntity?.id]);

  const userRecordsIds: string[] = [];
  if (dataListUserRecords && dataListUserRecords.length) {
    dataListUserRecords.forEach((item) => item?.id && userRecordsIds.push(item.id));
  }

  const fullDeploymentRecords = useListFullDeploymentRecords(
    selectedDeployment?.id,
    userRecordsIds,
    !!selectedEntity
  );

  const fullGroupRecords = useListFullGroupRecords(
    selectedEntity?.id === selectedGroupId ? selectedGroupId : undefined,
    userRecordsIds,
    !!selectedEntity
  );

  const fullUserRecordsResults = selectedGroupId
    ? [...fullGroupRecords]
    : [...fullDeploymentRecords];

  //  Sets user slim records data as the table data.
  useEffect(() => {
    let slimDataRecords = { ...slimData };
    slimDataRecords[selectedDeployment?.id] = dataListUserRecords;
    setSlimData(slimDataRecords);
    setUserRecordsData(
      dataListUserRecords && dataListUserRecords.length
        ? dataListUserRecords.map((result) => {
            let fullRecordData = fullUserRecordsResults.find((fullRecord) => {
              return fullRecord?.data?.data?.attributes?.store_id === result?.id;
            });
            const record: WaevTableRecord = {
              slimRecordId: result?.attributes.store_id,
              storeId: result?.attributes.store_id,
              transactions: result?.attributes.transactions,
            };

            if (fullRecordData) record.fullRecord = fullRecordData?.data?.data;

            return record;
          })
        : []
    );
  }, [dataListUserRecords]);

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
      let waevClone = [...userRecordsData];
      // When Full Records come in, take the queue of ids and look to see which ones have successes.
      // Add those successes to the Table Data; Remove the ID from the queue.
      queueOfIdsToMakeFull.forEach((queueId) => {
        const match = fullRecordsResults.find(
          (fullRecord) =>
            fullRecord?.data?.data?.attributes?.store_id === queueId ||
            (fullRecord?.error && fullRecord?.error?.data?.storeId === queueId)
        );
        if (match && match.isLoading === false) {
          if (match.status === 'success') {
            const matchedIndex = waevClone.findIndex((obj) => obj.storeId === queueId);
            if (waevClone[matchedIndex]) {
              waevClone[matchedIndex].errorFull = undefined;
              waevClone[matchedIndex].fullRecord = match?.data?.data;
              waevClone[matchedIndex].isLoadingFull = false;
            }
            addIdsToProcessedFullQueue(queueId);
            removeIdFromProcessFullQueue(queueId);
          }
          if (match.status === 'error' && match.error) {
            const matchedIndex = waevClone.findIndex((obj) => obj.storeId === queueId);
            if (waevClone[matchedIndex]) {
              waevClone[matchedIndex].errorFull = match.error;
              waevClone[matchedIndex].isLoadingFull = false;
            }
            addIdsToProcessedFullQueue(queueId);
            removeIdFromProcessFullQueue(queueId);
          }
        }
      });

      setUserRecordsData(waevClone);
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
    setIsLoadingData(isLoadingListUserRecords);
  }, [isLoadingListUserRecords]);

  const onClickGetFullRecord = (id: string) => {
    // Currently adds the old id back to the list and finds those, with the old ones being cached.
    setStoreIdsToGet([...storeIdsToGet, id]);
    onAddToQueue(id);
  };

  const clearRecordModalState = () => {
    setUserRecordsData([]);
    setFullData({});
    setSlimData({});
    setStoreIdsToGet([]);
  };

  // When number of entries per page is changed, go back to first page. (defensively)
  useEffect(() => {
    setRecordsPageNumber(0);
  }, [defaultEntriesPerPage]);

  return (
    <DeploymentUserRecordsContext.Provider
      value={{
        isLoadingData,
        isRefetchingData,
        userRecordsData,
        onClickGetFullRecord,
        recordsPageNumber: recordsPageNumber,
        setRecordsPageNumber,
        defaultEntriesPerPage,
        setDefaultEntriesPerPage,
        selectedUuid: selectedUserDetailsId,
        clearRecordModalState,
      }}
    >
      {children}
    </DeploymentUserRecordsContext.Provider>
  );
};
