/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, PropsWithChildren, useContext } from 'react';

import {
  useCreateUnion,
  useEffect,
  useState,
  useListUnions,
  useDeleteUnion,
  useListPublicUnions,
  useListDeploymentUnions,
  useQueue,
  useStringsQueue,
  useCreateUnionDeployment,
  useDeleteUnionDeployment,
} from 'hooks';
import { noop } from 'utils';

import { Union, Deployment, UnionGroup, UnionDeployment, DeploymentUnion, OptInFlag } from 'types';
import { SelectedEntityContext } from '../selectedEntityContext';

interface UnionWithSetter {
  // Read
  unions: Union[];
  getUnions: () => void;
  userDeployments: Deployment[];
  isLoadingUnions: boolean;
  isLoadingUnion: boolean;
  unionGroups: UnionGroup[];
  unionDeployments: UnionDeployment[];
  deploymentUnions: DeploymentUnion[];
  getDeploymentUnions: () => void;
  isLoadingDeploymentUnions: boolean;
  publicUnions: Union[];
  associatedUnion: Union | undefined;
  partsList: string[];
  selectedDeploymentUnion: DeploymentUnion;

  // Adding
  createUnion?: () => void;
  isSuccessCreateUnion?: boolean;
  isLoadingCreateUnion?: boolean;
  isAddingUnion: boolean;
  setIsAddingUnion?: (isAddingUnion: boolean) => void;
  setSelectedDeploymentUnion: (deploymentUnion: DeploymentUnion | undefined) => void;

  // Updates
  updatingUnion?: Union;
  setUpdatingUnion?: (updatingUnion?: Union) => void;
  isUpdatingUnion: boolean | '';
  setIsUpdatingUnion: (isUpdatingUnion: boolean) => void;
  updateUnionId: string | undefined;
  setUpdateUnionId: (updateUnionId: string | undefined) => void;
  isLoadingUpdateUnion?: boolean;
  setAssociatedUnion: (associatedUnion: Union | undefined) => void;
  createUnionDeployment: () => void;

  // Deletes
  isSuccessDeleteUnion?: boolean;
  isLoadingDeleteUnion?: boolean;
  setDeletingUnionId?: (deletingUnionId: string) => void;
  deleteUnion?: () => void;
  deleteUnionDeployment: () => void;

  // Submit Payload Attributes
  unionNameInput: string;
  setUnionNameInput: (unionNameInput: string) => void;

  // Inputs
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

export const UnionContext = createContext<UnionWithSetter>({
  // Read
  unions: [],
  getUnions: noop,
  userDeployments: [],
  isLoadingUnions: false,
  isLoadingUnion: false,
  unionGroups: [],
  unionDeployments: [],
  deploymentUnions: [],
  getDeploymentUnions: noop,
  isLoadingDeploymentUnions: false,
  publicUnions: [],
  associatedUnion: undefined,
  partsList: [],
  selectedDeploymentUnion: undefined,

  // Adding
  createUnion: noop,
  isSuccessCreateUnion: false,
  isLoadingCreateUnion: false,
  isAddingUnion: false,
  setIsAddingUnion: noop,
  setSelectedDeploymentUnion: noop,

  // Updates
  updatingUnion: undefined,
  setUpdatingUnion: noop,
  isUpdatingUnion: false,
  setIsUpdatingUnion: noop,
  updateUnionId: undefined,
  setUpdateUnionId: noop,
  isLoadingUpdateUnion: false,
  setAssociatedUnion: noop,
  createUnionDeployment: noop,

  // Deletes
  isSuccessDeleteUnion: false,
  isLoadingDeleteUnion: false,
  setDeletingUnionId: noop,
  deleteUnion: noop,
  deleteUnionDeployment: noop,

  // Submit Payload Attributes
  unionNameInput: '',
  setUnionNameInput: noop,

  //Inputs
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

interface Props {}

export const UnionContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const { selectedOrganizationId, organizationDeployments, selectedDeploymentId } =
    useContext(SelectedEntityContext);

  const [updatingUnion, setUpdatingUnion] = useState<Union | undefined>(undefined);
  const [isUpdatingUnion, setIsUpdatingUnion] = useState<boolean | undefined>(false);
  const [deletingUnionId, setDeletingUnionId] = useState<string | undefined>(undefined);
  const [unionNameInput, setUnionNameInput] = useState<string>('');
  const [updateUnionId, setUpdateUnionId] = useState<string>(undefined);
  const [isAddingUnion, setIsAddingUnion] = useState<boolean | undefined>(false);
  const [associatedUnion, setAssociatedUnion] = useState<Union>(undefined);
  const [selectedDeploymentUnion, setSelectedDeploymentUnion] =
    useState<DeploymentUnion>(undefined);

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

  // List Public Unions
  const { data: publicUnionsResponse, refetch: getPublicUnions } =
    useListPublicUnions(selectedOrganizationId);
  const publicUnions = publicUnionsResponse?.data;

  // List Unions
  const {
    data: unionsResponse,
    isLoading,
    isRefetching,
    refetch: getUnions,
  } = useListUnions(selectedOrganizationId);

  const unions = unionsResponse?.data;
  const unionGroups =
    unionsResponse?.included?.length > 0
      ? unionsResponse?.included.filter((item: any) => item.type && item.type === 'union_groups')
      : [];

  const unionDeployments =
    unionsResponse?.included?.length > 0
      ? unionsResponse?.included.filter(
          (item: any) => item.type && item.type === 'union_deployments'
        )
      : [];

  useEffect(() => {
    getUnions();
    getPublicUnions();
  }, [selectedOrganizationId]);

  // List Deployment Unions
  const {
    data: deploymentUnions,
    isLoading: isLoadingDeploymentUnions,
    isRefetching: isRefetchingDeploymentUnions,
    refetch: getDeploymentUnions,
  } = useListDeploymentUnions(selectedDeploymentId);

  useEffect(() => {
    getDeploymentUnions();
  }, [selectedDeploymentId]);

  // Create Unions
  const {
    isLoading: isLoadingCreateUnion,
    isSuccess: isSuccessCreateUnion,
    data: dataCreate,
    mutate: createUnionCall,
  } = useCreateUnion(selectedOrganizationId, unionNameInput);

  const {
    isLoading: isLoadingDeleteUnion,
    isSuccess: isSuccessDeleteUnion,
    mutate: deleteUnion,
  } = useDeleteUnion(deletingUnionId, selectedOrganizationId);

  const selectedAssociatedUnionId =
    associatedUnion && associatedUnion.id ? associatedUnion.id : undefined;

  // Create Union Deployment
  const { mutate: createUnionDeployment } = useCreateUnionDeployment(
    selectedAssociatedUnionId,
    selectedDeploymentId,
    partsList,
    consentFlagsInput?.map((flag) => flag?.id)
  );

  const { mutate: deleteUnionDeployment } = useDeleteUnionDeployment(
    selectedDeploymentUnion?.attributes?.union_id,
    selectedDeploymentUnion?.id,
    selectedDeploymentId
  );

  useEffect(() => {
    isPIIFieldAccessInput ? addToPartsList('pii') : removeFromPartsList('pii');
  }, [isPIIFieldAccessInput]);

  useEffect(() => {
    isAnonFieldAccessInput ? addToPartsList('anon') : removeFromPartsList('anon');
  }, [isAnonFieldAccessInput]);

  useEffect(() => {
    isMetaAccessInput ? addToPartsList('meta') : removeFromPartsList('meta');
  }, [isMetaAccessInput]);

  useEffect(() => {
    dataCreate && setUnionNameInput('');
  }, [dataCreate]);

  const createUnion = () => {
    createUnionCall();
    setUnionNameInput('');
  };

  return (
    <UnionContext.Provider
      value={{
        // Read
        unions,
        getUnions,
        userDeployments: organizationDeployments,
        isLoadingUnions: isLoading || isRefetching,
        isLoadingUnion: isLoadingCreateUnion || isLoadingDeleteUnion,
        isLoadingDeploymentUnions: isRefetchingDeploymentUnions || isLoadingDeploymentUnions,
        unionGroups,
        unionDeployments,
        deploymentUnions,
        getDeploymentUnions,
        publicUnions,
        associatedUnion,
        partsList,
        selectedDeploymentUnion,

        // Adding
        createUnion,
        isSuccessCreateUnion,
        isLoadingCreateUnion,
        isAddingUnion,
        setIsAddingUnion,
        createUnionDeployment,
        setSelectedDeploymentUnion,

        // Updates
        updatingUnion,
        setUpdatingUnion,
        isUpdatingUnion,
        setIsUpdatingUnion,
        updateUnionId,
        setUpdateUnionId,
        setAssociatedUnion,

        // Delete
        isLoadingDeleteUnion,
        isSuccessDeleteUnion,
        setDeletingUnionId,
        deleteUnion,
        deleteUnionDeployment,

        // Submit Payload Attributes
        unionNameInput,
        setUnionNameInput,

        // Inputs
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
    </UnionContext.Provider>
  );
};
