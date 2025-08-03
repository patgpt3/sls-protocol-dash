import { createContext, useContext, PropsWithChildren } from 'react';

import { Group, OptInFlag, PartsType, ResponseGroup } from 'types';
import {
  useCreateGroup,
  useDeleteGroup,
  useEffect,
  useListGroups,
  useQueue,
  useState,
  useStringsQueue,
} from 'hooks';
import { noop } from 'utils';
import { SelectedEntityContext } from '../../selectedEntityContext';
import { DeploymentContext } from '../deploymentContext';

interface GroupWithSetter {
  isLoadingGroup?: boolean;
  isLoadingCreateGroup?: boolean;
  isLoadingDeleteGroup?: boolean;

  cleanup: () => void;
  createGroup?: Function;
  dataCreateGroup?: ResponseGroup;
  deleteGroup: () => void;

  isDeletingGroup: boolean;
  setIsDeletingGroup: (isDeletingGroup: boolean) => void;

  isLoadingUpdate?: boolean;
  isSuccessCreateGroup?: boolean;

  updatingGroup: Group;
  setUpdatingGroup: (updatingGroup: Group) => void;

  // Inputs
  groupName?: string;
  setGroupName: (groupName?: string) => void;
  groupNameInput?: string;
  setGroupNameInput: (groupNameInput?: string) => void;

  consentFlagsInput: OptInFlag[];
  addConsentFlagInput: (consentFlagsInput: OptInFlag) => void;
  removeConsentFlagInput: (consentFlagsInput: OptInFlag) => void;
  isAnonFieldAccessInput: boolean;
  setIsAnonFieldAccessInput: (isAnonFieldAccessInput: boolean) => void;
  isMetaAccessInput: boolean;
  setIsMetaAccessInput: (isMetaAccessInput: boolean) => void;
  isPIIFieldAccessInput: boolean;
  setIsPIIFieldAccessInput: (isPIIFieldAccessInput: boolean) => void;
}

export const GroupContext = createContext<GroupWithSetter>({
  isLoadingGroup: false,
  isLoadingCreateGroup: false,
  isLoadingDeleteGroup: false,

  cleanup: noop,
  createGroup: noop,
  dataCreateGroup: undefined,
  deleteGroup: noop,
  isDeletingGroup: false,
  setIsDeletingGroup: noop,

  isLoadingUpdate: false,
  isSuccessCreateGroup: false,

  updatingGroup: undefined,
  setUpdatingGroup: noop,

  // Inputs
  groupName: '',
  setGroupName: noop,
  groupNameInput: '',
  setGroupNameInput: noop,

  consentFlagsInput: [],
  addConsentFlagInput: noop,
  removeConsentFlagInput: noop,
  isPIIFieldAccessInput: false,
  setIsPIIFieldAccessInput: noop,
  isAnonFieldAccessInput: false,
  setIsAnonFieldAccessInput: noop,
  isMetaAccessInput: false,
  setIsMetaAccessInput: noop,
});

interface Props {
  value?: GroupWithSetter;
}

const REFETCH_PENDING_INTERVAL_MS = 15000;

export const GroupContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const {
    selectedGroup,
    setSelectedGroupId,
    selectedDeploymentId,
    selectedOrganizationId,
    } = useContext(SelectedEntityContext);

  const { isAddingGroup } = useContext(DeploymentContext);

  const [updatingGroup, setUpdatingGroup] = useState<Group | undefined>(undefined);
  const [isDeletingGroup, setIsDeletingGroup] = useState<boolean | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addedGroupId, setAddedGroupId] = useState<string>(undefined);

  const [groupName, setGroupName] = useState<string | undefined>('');
  const [groupNameInput, setGroupNameInput] = useState<string | undefined>('');

  const [isPIIFieldAccessInput, setIsPIIFieldAccessInput] = useState<boolean | undefined>(
    undefined
  );
  const [isAnonFieldAccessInput, setIsAnonFieldAccessInput] = useState<boolean | undefined>(
    undefined
  );
  const [isMetaAccessInput, setIsMetaAccessInput] = useState<boolean | undefined>(undefined);

  const [partsList, addToPartsList, removeFromPartsList] = useStringsQueue([]);
  const [consentFlagsInput, addConsentFlagInput, removeConsentFlagInput, setFlagInputQueue] =
    useQueue<OptInFlag>([]);

  /*
   * External Hooks
   */
  // Create Group
  const {
    data: dataCreateGroup,
    isLoading: isLoadingCreateGroup,
    isSuccess: isSuccessCreateGroup,
    mutate: createGroup,
  } = useCreateGroup(
    selectedDeploymentId,
    selectedOrganizationId,
    groupNameInput,
    partsList as PartsType[],
    consentFlagsInput?.map((flag) => flag?.id)
  );



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: deploymentGroups, refetch: refetchGroups } = useListGroups(selectedDeploymentId);

  const cleanup = () => {
    setGroupNameInput(undefined);
    setFlagInputQueue([]);
    setIsPIIFieldAccessInput(undefined);
    setIsAnonFieldAccessInput(undefined);
    setIsMetaAccessInput(undefined);
    loadDefaultSelectedFields();
    // setUpdatingGroup(undefined);
  };

  // Delete Group
  const { mutate: deleteGroup, isLoading: isLoadingDeleteGroup } = useDeleteGroup(
    updatingGroup?.id,
    selectedDeploymentId,
    cleanup
  );

  useEffect(() => {
    if (isLoadingDeleteGroup) {
      const groupId = deploymentGroups?.length > 0 ? deploymentGroups[0].id : undefined;
      setSelectedGroupId(groupId);
    }
  }, [isLoadingDeleteGroup]);

  /*
   * Effects
   */

  // Data Ingest
  const loadDefaultSelectedFields = () => {
    if (selectedGroup?.attributes?.config) {
      setGroupName(selectedGroup?.attributes.name);
      addConsentFlagInput(selectedGroup?.fullOptInFlags);
      setIsPIIFieldAccessInput(selectedGroup?.attributes.config.parts.includes('pii'));
      setIsAnonFieldAccessInput(selectedGroup?.attributes.config.parts.includes('anon'));
      setIsMetaAccessInput(selectedGroup?.attributes.config.parts.includes('meta'));
    }
  };

  useEffect(() => {
    // Loads Ingestion when group selected
    loadDefaultSelectedFields();
  }, [selectedGroup]);

  useEffect(() => {
    if (isAddingGroup) {
      // Cancels Ingestion on Add/Remove Group
      setGroupNameInput(undefined);
      setFlagInputQueue([]);
      setIsPIIFieldAccessInput(undefined);
      setIsAnonFieldAccessInput(undefined);
      setIsMetaAccessInput(undefined);
    } else {
      loadDefaultSelectedFields();
    }
  }, [isAddingGroup]);

  useEffect(() => {
    // Removes user field when swapped to ingest all
    isPIIFieldAccessInput && setGroupName(undefined);
  }, [isPIIFieldAccessInput]);

  useEffect(() => {
    // Select Created Group Id to track
    if (dataCreateGroup && dataCreateGroup?.data?.id) {
      setAddedGroupId(dataCreateGroup?.data?.id);
      setFlagInputQueue([]);
    }
  }, [dataCreateGroup]);

    // TODO(): Custom hook for these.
    useEffect(() => {
      isPIIFieldAccessInput ? addToPartsList('pii') : removeFromPartsList('pii');
    }, [isPIIFieldAccessInput]);

    useEffect(() => {
      isAnonFieldAccessInput ? addToPartsList('anon') : removeFromPartsList('anon');
    }, [isAnonFieldAccessInput]);

    useEffect(() => {
      isMetaAccessInput ? addToPartsList('meta') : removeFromPartsList('meta');
    }, [isMetaAccessInput]);

    // Pending Groups
    useEffect(() => {
      if (
        deploymentGroups?.some((group) =>
          ['processing', 'pending'].includes(group?.attributes.status)
        )
      ) {
        let myInterval = setInterval(() => {
          refetchGroups();
        }, REFETCH_PENDING_INTERVAL_MS);

        return () => {
          clearTimeout(myInterval);
        };
      }
    }, [deploymentGroups]);

  return (
    <GroupContext.Provider
      value={{
        isLoadingGroup: isLoadingCreateGroup || isLoadingDeleteGroup,
        isLoadingCreateGroup,
        isLoadingDeleteGroup,

        updatingGroup,
        setUpdatingGroup,
        isDeletingGroup,
        setIsDeletingGroup,

        cleanup,
        groupName,
        setGroupName,
        createGroup,
        isSuccessCreateGroup,
        dataCreateGroup,
        isLoadingUpdate: isLoadingDeleteGroup,
        deleteGroup,

        // Inputs
        groupNameInput,
        setGroupNameInput,
        consentFlagsInput,
        addConsentFlagInput,
        removeConsentFlagInput,

        isAnonFieldAccessInput,
        setIsAnonFieldAccessInput,
        isMetaAccessInput,
        setIsMetaAccessInput,
        isPIIFieldAccessInput,
        setIsPIIFieldAccessInput,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
