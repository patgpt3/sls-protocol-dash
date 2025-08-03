import { createContext, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { Organization, OrganizationPermissions, RootStateType } from 'types';
import {
  useContext,
  useCreateOrganization,
  useEffect,
  useState,
  useUpdateOrganization,
} from 'hooks';
import { isAllowed, noop } from 'utils';
import { SelectedEntityContext } from '../selectedEntityContext';

// import { Organization } from 'types';

interface OrganizationWithSetter {
  // selectedOrganization: Organization;
  // selectedOrganizationId: string;
  // setSelectedOrganizationId: (id: string) => void;
  // refetchSelectedOrganization: () => void;
  setOrgNameInput: (orgNameInput?: string) => void;
  updatingOrganization?: Organization;
  setUpdatingOrganization?: (updatingOrganization?: Organization) => void;
  createOrganization?: Function;
  isLoadingOrganization?: boolean;
  isAddingOrg?: boolean;
  setIsAddingOrg?: (isAddingOrg: boolean) => void;
  isUpdatingOrganization: boolean | '';
  setIsUpdatingOrganization: (isUpdatingOrganization: boolean) => void;
  isHasOwnerOrAdminAccess: boolean;
  isHasReadAccess: boolean;
  isHasWriteAccess: boolean;
}

export const OrganizationContext = createContext<OrganizationWithSetter>({
  // selectedOrganization: undefined,
  // selectedOrganizationId: undefined,
  // setSelectedOrganizationId: noop,
  // refetchSelectedOrganization: noop,
  setOrgNameInput: noop,
  updatingOrganization: undefined,
  setUpdatingOrganization: noop,
  createOrganization: noop,
  isLoadingOrganization: false,
  isAddingOrg: false,
  setIsAddingOrg: noop,
  isUpdatingOrganization: false,
  setIsUpdatingOrganization: noop,
  // organizationPermissions: undefined,
  isHasOwnerOrAdminAccess: false,
  isHasReadAccess: false,
  isHasWriteAccess: false,
});

interface Props {}

export const OrganizationContextProvider = ({
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { refetchSelectedOrganization, selectedOrganization } = useContext(SelectedEntityContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);

  const [updatingOrganization, setUpdatingOrganization] = useState<Organization | undefined>(
    undefined
  );
  const [isUpdatingOrganization, setIsUpdatingOrganization] = useState<boolean | undefined>(false);
  const [orgNameInput, setOrgNameInput] = useState<string | undefined>('');
  const [isAddingOrg, setIsAddingOrg] = useState<boolean | undefined>(false);

  const [currentUserOrganizationPermissions, setCurrentUserOrganizationPermissions] = useState<
    OrganizationPermissions | undefined
  >(undefined);
  const [isHasOwnerOrAdminAccess, setIsHasOwnerOrAdminAccess] = useState<boolean | undefined>(
    undefined
  );
  const [isHasReadAccess, setIsHasReadAccess] = useState<boolean | undefined>(undefined);
  const [isHasWriteAccess, setIsHasWriteAccess] = useState<boolean | undefined>(undefined);

  /*
   * External Hooks
   */
  // const { refetch: refetchSelectedOrganization, data: selectedOrganization } = useGetOrganization(
  //   selectedOrganizationId,
  // );
  const { isLoading: isLoadingCreateOrganization, mutate: createOrganization } =
    useCreateOrganization(orgNameInput);

  const {
    isLoading: isLoadingUpdateOrganization,
    data: updateOrganizationData,
    mutate: updateOrganization,
    // @ts-ignore
  } = useUpdateOrganization(updatingOrganization as Organization);

  /*
   * Effects
   */

  useEffect(() => {
    orgNameInput && updatingOrganization && onNameEditSubmit();
  }, [orgNameInput]);

  useEffect(() => {
    // When Organization is updated, refetch from server to make sure it is reconciled.
    // TODO(MFB): Move to Hook success
    refetchSelectedOrganization();
  }, [updateOrganizationData, refetchSelectedOrganization]);

  useEffect(() => {
    isLoadingCreateOrganization && setIsAddingOrg(false);
  }, [isLoadingCreateOrganization]);

  useEffect(() => {
    (isLoadingCreateOrganization || isLoadingUpdateOrganization) && setOrgNameInput(undefined);
  }, [isLoadingCreateOrganization, isLoadingUpdateOrganization]);

  useEffect(() => {
    if (selectedOrganization?.fullPermissions?.length) {
      setCurrentUserOrganizationPermissions(
        selectedOrganization?.fullPermissions.find(
          (perm) => perm.attributes?.users?.email === currentUser?.attributes?.email
        )
      );
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (currentUserOrganizationPermissions) {
      setIsHasOwnerOrAdminAccess(isAllowed(currentUserOrganizationPermissions, ['owner', 'admin']));
      setIsHasReadAccess(isAllowed(currentUserOrganizationPermissions, ['owner', 'admin', 'read']));
      setIsHasWriteAccess(
        isAllowed(currentUserOrganizationPermissions, ['owner', 'admin', 'write'])
      );
    }
  }, [currentUserOrganizationPermissions]);

  /*
   * Helpers
   */
  const onNameEditSubmit = () => {
    if (orgNameInput) {
      updatingOrganization.attributes.name = orgNameInput;
      updateOrganization();
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        isLoadingOrganization: isLoadingCreateOrganization || isLoadingUpdateOrganization,
        // selectedOrganization,
        // selectedOrganizationId,
        // setSelectedOrganizationId,
        // refetchSelectedOrganization,
        setOrgNameInput,
        updatingOrganization,
        setUpdatingOrganization,
        createOrganization,
        isAddingOrg,
        setIsAddingOrg,
        isUpdatingOrganization,
        setIsUpdatingOrganization,
        isHasOwnerOrAdminAccess,
        isHasReadAccess,
        isHasWriteAccess,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
