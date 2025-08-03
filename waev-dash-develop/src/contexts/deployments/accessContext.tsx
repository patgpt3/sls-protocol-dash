/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, PropsWithChildren, useContext } from 'react';

import {
  useCreateAccess,
  useEffect,
  useListAccesses,
  useDeleteAccess,
  useUpdateAccess,
  useState,
} from 'hooks';
import { noop } from 'utils';

import { Access } from 'types';
import { SelectedEntityContext } from '../selectedEntityContext';

interface AccessWithSetter {
  // Read
  accesses: Access[];
  isLoadingAccesses: boolean;

  // Adding
  createAccess?: () => void;
  isSuccessCreateAccess?: boolean;
  isLoadingCreateAccess?: boolean;

  // Updates
  updateAccess?: () => void;
  updatingAccess?: Access;
  setUpdatingAccess?: (updatingAccess?: Access) => void;
  isUpdatingAccess: boolean | '';
  setIsUpdatingAccess: (isUpdatingAccess: boolean) => void;
  updateAccessId: string | undefined;
  setUpdateAccessId: (updateAccessId: string | undefined) => void;

  // Deletes
  isSuccessDeleteAccess?: boolean;
  isLoadingDeleteAccess?: boolean;
  setDeletingAccessId?: (deletingAccessId: string) => void;

  // Submit Payload Attributes
  accessDescriptionInput: string;
  setAccessDescriptionInput: (accessDescriptionInput: string) => void;
  updateAccessDescriptionInput: string;
  setUpdateAccessDescriptionInput: (updateAccessDescriptionInput: string) => void;
}

export const AccessContext = createContext<AccessWithSetter>({
  // Read
  accesses: [],
  isLoadingAccesses: false,

  // Adding
  createAccess: noop,
  isSuccessCreateAccess: false,
  isLoadingCreateAccess: false,

  // Updates
  updateAccess: noop,
  updatingAccess: undefined,
  setUpdatingAccess: noop,
  isUpdatingAccess: false,
  setIsUpdatingAccess: noop,
  updateAccessId: undefined,
  setUpdateAccessId: noop,

  // Deletes
  isSuccessDeleteAccess: false,
  isLoadingDeleteAccess: false,
  setDeletingAccessId: noop,

  // Submit Payload Attributes
  accessDescriptionInput: '',
  setAccessDescriptionInput: noop,
  updateAccessDescriptionInput: '',
  setUpdateAccessDescriptionInput: noop,
});

interface Props { }

export const AccessContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const { selectedDeploymentId } = useContext(SelectedEntityContext);

  const [updatingAccess, setUpdatingAccess] = useState<Access | undefined>(undefined);
  const [isUpdatingAccess, setIsUpdatingAccess] = useState<boolean | undefined>(false);
  const [deletingAccessId, setDeletingAccessId] = useState<string | undefined>(undefined);
  const [accessDescriptionInput, setAccessDescriptionInput] = useState<string>('');
  const [updateAccessDescriptionInput, setUpdateAccessDescriptionInput] = useState<string>('');
  const [updateAccessId, setUpdateAccessId] = useState<string>(undefined);

  // List Accesses
  const {
    data: accesses,
    isLoading: isLoadingAccesses,
    refetch: getAccesses,
  } = useListAccesses(selectedDeploymentId);

  useEffect(() => {
    getAccesses();
  }, [selectedDeploymentId]);

  // Create Accesses
  const {
    isLoading: isLoadingCreateAccess,
    isSuccess: isSuccessCreateAccess,
    data: dataCreate,
    mutate: createAccessCall,
  } = useCreateAccess(selectedDeploymentId, accessDescriptionInput);

  // Update Accesses
  const {
    mutate: updateAccessCall,
  } = useUpdateAccess(updateAccessId, selectedDeploymentId, updateAccessDescriptionInput);

  const {
    isLoading: isLoadingDeleteAccess,
    isSuccess: isSuccessDeleteAccess,
    mutate: deleteAccess,
  } = useDeleteAccess(deletingAccessId, selectedDeploymentId);

  useEffect(() => {
    dataCreate && setAccessDescriptionInput('');
    dataCreate && setUpdateAccessDescriptionInput(undefined);
  }, [dataCreate]);


  const createAccess = () => {
    createAccessCall();
    setAccessDescriptionInput('');
  };
  const updateAccess = () => {
    setUpdateAccessDescriptionInput(undefined);
    updateAccessCall();
    setUpdateAccessId(undefined);
  };

  useEffect(() => {
    // If Deletion ID is found, call delete
    deletingAccessId && deleteAccess();
  }, [deletingAccessId]);

  return (
    <AccessContext.Provider
      value={{
        // Read
        accesses,
        isLoadingAccesses: isLoadingAccesses || isLoadingDeleteAccess || isLoadingCreateAccess,

        // Adding
        createAccess,
        isSuccessCreateAccess,
        isLoadingCreateAccess,

        // Updates
        updateAccess,
        updatingAccess,
        setUpdatingAccess,
        isUpdatingAccess,
        setIsUpdatingAccess,
        updateAccessId,
        setUpdateAccessId,

        // Delete
        isLoadingDeleteAccess,
        isSuccessDeleteAccess,
        setDeletingAccessId,

        // Submit Payload Attributes
        accessDescriptionInput,
        setAccessDescriptionInput,
        updateAccessDescriptionInput,
        setUpdateAccessDescriptionInput,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};
