import { createContext, useContext, PropsWithChildren, useEffect } from 'react';

import {
  useCreateOptInFlag,
  useDeleteOptInFlag,
  useListOptInFlags,
  useUpdateOptInFlags,
  useState,
} from 'hooks';
import { noop } from 'utils';

import { OptInFlag, ComparatorValues } from 'types';
import { SelectedEntityContext } from 'contexts/selectedEntityContext';
import { DeploymentContext } from './deploymentContext';

interface OptInFlagWithSetter {
  // Read
  optInFlags: OptInFlag[];
  isLoadingOptInFlags: boolean;
  isMutatingOptInFlags: boolean;
  isActive: boolean;
  flagsQueue: OptInFlag[];
  isFetchingOptInFlags: boolean;
  isLoadingUpdateFlags: boolean;

  // Adding
  isAddingOptInFlag: boolean;
  setIsAddingOptInFlag: (isAddingOptInFlag: boolean) => void;
  createOptInFlag?: Function;
  isLoadingCreateOptInFlags?: boolean;

  // Updates
  updatingOptInFlag?: OptInFlag;
  setUpdatingOptInFlag?: (updatingOptInFlag?: OptInFlag) => void;
  setIsActive: (isActive: boolean) => void;
  updateFlagsQueue: (flagObject: OptInFlag) => void;
  setFlagsQueue: (optInFlags: OptInFlag[]) => void;
  // isUpdatingOptInFlag: boolean | '';
  // setIsUpdatingOptInFlag: (isUpdatingOptInFlag: boolean) => void;

  // Delete
  deleteOptInFlag: () => void;

  // Submit Payload Attributes
  flagValueInput?: string;
  setFlagValueInput: (flagValueInput?: string) => void;
  flagDescriptionInput: string;
  setFlagDescriptionInput: (flagDescriptionInput: string) => void;
  comparisonInput: string;
  setComparisonInput: (comparisonInput: string) => void;
  cleanup: () => void;
  submitUpdatedFlags: () => void;
}

export const OptInFlagContext = createContext<OptInFlagWithSetter>({
  // Read
  optInFlags: [],
  isLoadingOptInFlags: false,
  isMutatingOptInFlags: false,
  isActive: true,
  flagsQueue: [],
  isFetchingOptInFlags: false,
  isLoadingUpdateFlags: false,

  // Adding
  isAddingOptInFlag: false,
  setIsAddingOptInFlag: noop,
  createOptInFlag: noop,

  // Updates
  updatingOptInFlag: undefined,
  setUpdatingOptInFlag: noop,
  setIsActive: noop,
  updateFlagsQueue: noop,
  setFlagsQueue: noop,

  // Deleted
  deleteOptInFlag: noop,

  // Submit Payload Attributes
  flagValueInput: '',
  setFlagValueInput: noop,
  flagDescriptionInput: '',
  setFlagDescriptionInput: noop,
  comparisonInput: ComparatorValues.yes_no.label,
  setComparisonInput: noop,
  cleanup: noop,
  submitUpdatedFlags: noop,
});

interface Props {}

export const OptInFlagContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const { selectedDeploymentId } = useContext(SelectedEntityContext);
  const { setUpdatingSection } = useContext(DeploymentContext);

  const [updatingOptInFlag, setUpdatingOptInFlag] = useState<OptInFlag | undefined>(undefined);
  const [isAddingOptInFlag, setIsAddingOptInFlag] = useState<boolean | undefined>(false);

  // Submit Payload Attributes
  const [flagValueInput, setFlagValueInput] = useState<string>('');
  const [flagDescriptionInput, setFlagDescriptionInput] = useState<string>('');
  const [comparisonInput, setComparisonInput] = useState<string>(ComparatorValues.yes_no.label);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [flagsQueue, setFlagsQueue] = useState<OptInFlag[]>([]);

  // List Opt-In Flag
  const {
    data: optInFlags,
    isLoading: isLoadingOptInFlags,
    isFetching: isFetchingOptInFlags,
  } = useListOptInFlags(selectedDeploymentId);

  const comparisonValue =
    Object.keys(ComparatorValues).find(
      // @ts-ignore
      (key) => ComparatorValues[key].label === comparisonInput
    ) ?? '';

  // Create Opt-In Flag
  const {
    mutate: createOptInFlagCall,
    isLoading: isCreatingFlag,
    data: dataCreate,
  } = useCreateOptInFlag(
    selectedDeploymentId,
    flagDescriptionInput,
    flagValueInput,
    comparisonValue,
    isActive
  );

  useEffect(() => {
    dataCreate && cleanup();
  }, [dataCreate]);

  useEffect(() => {
    optInFlags && setFlagsQueue([]);
  }, [optInFlags]);

  // Update Opt-In Flags
  const {
    mutate: updateOptInFlagsCall,
    isLoading: isLoadingUpdateFlags,
    data: updateOptInData,
  } = useUpdateOptInFlags(flagsQueue, selectedDeploymentId);

  // Delete Opt-In Flag
  const { mutate: deleteOptInFlag, isLoading: isDeletingFlag } = useDeleteOptInFlag(
    updatingOptInFlag?.id,
    selectedDeploymentId
  );

  const createOptInFlag = () => {
    createOptInFlagCall();
    setIsAddingOptInFlag(false);
    setFlagDescriptionInput('');
    setFlagValueInput('');
    setComparisonInput(ComparatorValues.yes_no.label);
  };

  const cleanup = () => {
    setFlagValueInput('');
    setFlagDescriptionInput('');
    setComparisonInput(ComparatorValues.yes_no.label);
    setUpdatingOptInFlag(undefined);
    setIsActive(true);
    setFlagsQueue([]);
  };

  useEffect(() => {
    if (updateOptInData) {
      setUpdatingSection(undefined);
    }
  }, [updateOptInData]);

  const updateFlagsQueue = (flagObject: OptInFlag) => {
    let updatedFlag = flagsQueue.find((item) => item.id === flagObject.id);
    let flagsList;
    if (updatedFlag) {
      flagsList = flagsQueue.filter((flag) => flag.id !== updatedFlag.id);
    } else {
      let newFlagObj = {
        ...flagObject,
        attributes: {
          ...flagObject.attributes,
          active: !flagObject.attributes.active,
        },
      };
      flagsList = [...flagsQueue, newFlagObj];
    }
    setFlagsQueue(flagsList);
  };

  const submitUpdatedFlags = () => {
    updateOptInFlagsCall();
  };

  return (
    <OptInFlagContext.Provider
      value={{
        // Read
        optInFlags,
        isLoadingOptInFlags,
        isMutatingOptInFlags: isCreatingFlag || isDeletingFlag,
        isActive,
        flagsQueue,
        isFetchingOptInFlags,
        isLoadingUpdateFlags,

        // Adding
        isAddingOptInFlag,
        setIsAddingOptInFlag,
        createOptInFlag,

        // Updates
        updatingOptInFlag,
        setUpdatingOptInFlag,
        setIsActive,
        updateFlagsQueue,
        setFlagsQueue,

        // Delete
        deleteOptInFlag,

        // Submit Payload Attributes
        flagValueInput,
        setFlagValueInput,
        flagDescriptionInput,
        setFlagDescriptionInput,
        comparisonInput,
        setComparisonInput,
        cleanup,
        submitUpdatedFlags,
      }}
    >
      {children}
    </OptInFlagContext.Provider>
  );
};
