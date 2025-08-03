import { createContext, PropsWithChildren, useContext } from 'react';

import {
  useCreateOrganizationPermission,
  useCreateDeploymentPermission,
  useEffect,
  useState,
  useUpdateDeploymentPermission,
  useUpdateOrganizationPermission,
  useDeleteDeploymentPermission,
  useDeleteOrganizationPermission,
  useCreateGroupPermission,
  useUpdateGroupPermission,
  useDeleteGroupPermission,
} from 'hooks';
import { noop } from 'utils';

import {
  OrganizationPermissions,
  DeploymentPermissions,
  EntityTypes,
  GroupPermissions,
} from 'types';
import { SelectedEntityContext } from './selectedEntityContext';
import { NotificationContext } from './notificationContext';

interface PermissionWithSetter {
  cleanup: () => void;

  // Read
  isLoadingPermissions: boolean;

  // Adding
  isLoadingAddingPermissions?: boolean;
  setOrgIdForPermissions: (id: string) => void;
  addingPermissionsType: EntityTypes | undefined;
  setAddingPermissionsType: (addingPermissionsType: EntityTypes | undefined) => void;
  createOrganizationPermission?: Function;
  createDeploymentPermission?: Function;
  createGroupPermission?: Function;

  // Updates
  updatingPermission: OrganizationPermissions | DeploymentPermissions | undefined;
  setUpdatingPermission: (
    updatingPermission: OrganizationPermissions | DeploymentPermissions | undefined
  ) => void;
  onUpdatePermission: (typeOverride?: EntityTypes) => void;

  selectedEntityType: EntityTypes | undefined;
  setSelectedEntityType: (selectedEntityType: EntityTypes | undefined) => void;

  // Delete
  deletingPermission: OrganizationPermissions | DeploymentPermissions | undefined;
  setDeletingPermission: (
    deletingPermission: OrganizationPermissions | DeploymentPermissions | undefined
  ) => void;
  onDeletePermission: (type: EntityTypes) => void;

  // Submit Payload Attributes
  emailInput: string | '';
  setEmailInput: (emailInput: string) => void;
  firstNameInput: string | '';
  setFirstNameInput: (firstNameInput: string) => void;
  lastNameInput: string | '';
  setLastNameInput: (lastNameInput: string) => void;
  inputIsAdmin: boolean;
  setInputIsAdmin: (inputIsAdmin: boolean) => void;
  inputIsRead: boolean;
  setInputIsRead: (inputIsRead: boolean) => void;
  inputIsWrite: boolean;
  setInputIsWrite: (inputIsWrite: boolean) => void;
  inputIsDelete: boolean;
  setInputIsDelete: (inputIsDelete: boolean) => void;
}

export const PermissionContext = createContext<PermissionWithSetter>({
  cleanup: noop,

  // Read
  // organizationPermissions: [],
  isLoadingPermissions: false,

  // Adding
  // orgIdForPermissions: undefined,
  setOrgIdForPermissions: noop,
  // idForPermissions: undefined,
  // setIdForPermissions: noop,
  addingPermissionsType: undefined,
  setAddingPermissionsType: noop,
  createOrganizationPermission: noop,
  createDeploymentPermission: noop,
  createGroupPermission: noop,
  isLoadingAddingPermissions: false,

  // Updates
  updatingPermission: undefined,
  setUpdatingPermission: noop,
  onUpdatePermission: noop,

  selectedEntityType: undefined,
  setSelectedEntityType: noop,

  // Delete
  // TODO(MFB): Change these do delete, so that we can pull the org delete up a bit to save renders.
  deletingPermission: undefined,
  setDeletingPermission: noop,
  onDeletePermission: noop,

  // Submit Payload Attributes
  emailInput: undefined,
  setEmailInput: noop,
  firstNameInput: undefined,
  setFirstNameInput: noop,
  lastNameInput: undefined,
  setLastNameInput: noop,
  inputIsAdmin: false,
  setInputIsAdmin: noop,
  inputIsRead: false,
  setInputIsRead: noop,
  inputIsWrite: false,
  setInputIsWrite: noop,
  inputIsDelete: false,
  setInputIsDelete: noop,
});

interface Props {}

export const PermissionContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const { selectedOrganizationId, selectedDeploymentId, selectedGroupId } =
    useContext(SelectedEntityContext);
  const { setSuccessNotification, setErrorNotification, setErrorsNotification } =
    useContext(NotificationContext);

  const [updatingPermission, setUpdatingPermission] = useState<
    OrganizationPermissions | DeploymentPermissions | undefined
  >(undefined);
  const [deletingPermission, setDeletingPermission] = useState<
    OrganizationPermissions | DeploymentPermissions | undefined
  >(undefined);
  const [orgIdForPermissions, setOrgIdForPermissions] = useState<string | undefined>(undefined);
  const [addingPermissionsType, setAddingPermissionsType] = useState<EntityTypes | undefined>(
    undefined
  );

  const [selectedEntityType, setSelectedEntityType] = useState<EntityTypes | undefined>(undefined);

  // Submit Payload Attributes
  const [emailInput, setEmailInput] = useState<string | undefined>('');
  const [firstNameInput, setFirstNameInput] = useState<string | undefined>(undefined);
  const [lastNameInput, setLastNameInput] = useState<string | undefined>(undefined);
  const [inputIsAdmin, setInputIsAdmin] = useState<boolean | undefined>(undefined);
  const [inputIsRead, setInputIsRead] = useState<boolean | undefined>(undefined);
  const [inputIsWrite, setInputIsWrite] = useState<boolean | undefined>(undefined);
  const [inputIsDelete, setInputIsDelete] = useState<boolean | undefined>(undefined);

  // Organizations
  const {
    data: dataCreateOrganizationPermission,
    error: errorCreateOrganizationPermission,
    isLoading: isLoadingCreateOrganizationPermission,
    mutate: createOrganizationPermissionCall,
  } = useCreateOrganizationPermission(
    orgIdForPermissions,
    emailInput,
    firstNameInput,
    lastNameInput,
    inputIsAdmin,
    inputIsRead,
    inputIsWrite,
    inputIsDelete
  );

  const {
    data: dataUpdateOrganizationPermission,
    error: errorUpdateOrganizationPermission,
    isLoading: isLoadingUpdateOrganizationPermission,
    mutate: updateOrganizationPermissionCall,
  } = useUpdateOrganizationPermission(
    updatingPermission as OrganizationPermissions,
    inputIsAdmin,
    inputIsRead,
    inputIsWrite,
    inputIsDelete
  );

  const {
    error: errorDeleteOrganizationPermission,
    isLoading: isLoadingDeleteOrganizationPermission,
    isSuccess: isSuccessDeleteOrganizationPermission,
    mutate: deleteOrganizationPermissionCall,
  } = useDeleteOrganizationPermission(deletingPermission as OrganizationPermissions);

  // Groups
  const {
    // data: dataCreateDeploymentPermission,
    // error: errorCreateGroupPermission,
    isLoading: isLoadingCreateGroupPermission,
    mutate: createGroupPermissionCall,
  } = useCreateGroupPermission(
    selectedDeploymentId,
    selectedGroupId,
    emailInput,
    firstNameInput,
    lastNameInput,
    inputIsAdmin,
    inputIsRead
  );

  // Deployments
  const {
    data: dataCreateDeploymentPermission,
    error: errorCreateDeploymentPermission,
    isLoading: isLoadingCreateDeploymentPermission,
    mutate: createDeploymentPermissionCall,
  } = useCreateDeploymentPermission(
    selectedOrganizationId,
    selectedDeploymentId,
    emailInput,
    firstNameInput,
    lastNameInput,
    inputIsAdmin,
    inputIsRead,
    inputIsWrite,
    inputIsDelete
  );

  const {
    data: dataUpdateDeploymentPermission,
    error: errorUpdateDeploymentPermission,
    isLoading: isLoadingUpdateDeploymentPermission,
    mutate: updateDeploymentPermissionCall,
  } = useUpdateDeploymentPermission(
    updatingPermission as DeploymentPermissions,
    selectedOrganizationId,
    inputIsAdmin,
    inputIsRead,
    inputIsWrite,
    inputIsDelete
  );

  const {
    error: errorDeleteDeploymentPermission,
    isLoading: isLoadingDeleteDeploymentPermission,
    isSuccess: isSuccessDeleteDeploymentPermission,
    mutate: deleteDeploymentPermissionCall,
  } = useDeleteDeploymentPermission(
    deletingPermission as DeploymentPermissions,
    selectedOrganizationId
  );
  const {
    data: dataUpdateGroupPermission,
    error: errorUpdateGroupPermission,
    isLoading: isLoadingUpdateGroupPermission,
    mutate: updateGroupPermissionCall,
  } = useUpdateGroupPermission(
    updatingPermission as GroupPermissions,
    selectedDeploymentId,
    inputIsAdmin,
    inputIsRead,
    inputIsWrite,
    inputIsDelete
  );

  const {
    error: errorDeleteGroupPermission,
    isLoading: isLoadingDeleteGroupPermission,
    isSuccess: isSuccessDeleteGroupPermission,
    mutate: deleteGroupPermissionCall,
  } = useDeleteGroupPermission(deletingPermission as GroupPermissions, selectedDeploymentId);

  const createOrganizationPermission = () => {
    createOrganizationPermissionCall();
    setAddingPermissionsType(undefined);
  };

  const createDeploymentPermission = () => {
    createDeploymentPermissionCall();
    setAddingPermissionsType(undefined);
  };
  const createGroupPermission = () => {
    createGroupPermissionCall();
    setAddingPermissionsType(undefined);
  };

  const onUpdatePermission = (typeOverride?: EntityTypes) => {
    // TODO(): Cleanup. WAAAY too many ifs. Maybe take out typeOverride in the one organization call we have.
    if (typeOverride) {
      if (typeOverride === 'organization') {
        updateOrganizationPermissionCall();
      }
      if (typeOverride === 'deployment') {
        updateDeploymentPermissionCall();
      }
      if (typeOverride === 'group') {
        updateGroupPermissionCall();
      }
    } else {
      if (selectedEntityType === 'organization') {
        updateOrganizationPermissionCall();
      }
      if (selectedEntityType === 'deployment') {
        updateDeploymentPermissionCall();
      }
      if (selectedEntityType === 'group') {
        updateGroupPermissionCall();
      }
    }
  };
  const onDeletePermission = (typeOverride?: EntityTypes) => {
    if (typeOverride) {
      if (typeOverride === 'organization') {
        deleteOrganizationPermissionCall();
      }
      if (typeOverride === 'deployment') {
        deleteDeploymentPermissionCall();
      }
      if (typeOverride === 'group') {
        deleteGroupPermissionCall();
      }
    } else {
      if (selectedEntityType === 'organization') {
        deleteOrganizationPermissionCall();
      }
      if (selectedEntityType === 'deployment') {
        deleteDeploymentPermissionCall();
      }
      if (selectedEntityType === 'group') {
        deleteGroupPermissionCall();
      }
    }
  };

  const cleanup = () => {
    setOrgIdForPermissions(undefined);
    setEmailInput('');
    setInputIsAdmin(undefined);
    setInputIsRead(undefined);
    setInputIsWrite(undefined);
    setInputIsDelete(undefined);
    setDeletingPermission(undefined);
    setUpdatingPermission(undefined);
  };

  useEffect(() => {
    if (updatingPermission?.attributes.permissions) {
      setInputIsAdmin(updatingPermission.attributes.permissions.admin);
      setInputIsRead(updatingPermission.attributes.permissions.read);
      setInputIsWrite(updatingPermission.attributes.permissions.write);
      setInputIsDelete(updatingPermission.attributes.permissions.delete);
    }
    // When entity is selected for update, updates the selected permission flags.
  }, [updatingPermission]);

  // Notifications

  useEffect(() => {
    // Sends Success Notification for Create
    if (dataCreateOrganizationPermission || dataCreateDeploymentPermission) {
      dataCreateOrganizationPermission &&
        setSuccessNotification({
          title: 'Success',
          message: 'Organization Permission Created Successfully',
        });
      dataCreateDeploymentPermission &&
        setSuccessNotification({
          title: 'Success',
          message: 'Deployment Permission Created Successfully',
        });
      cleanup();
    }
  }, [dataCreateOrganizationPermission, dataCreateDeploymentPermission]);

  useEffect(() => {
    errorCreateDeploymentPermission && setErrorsNotification(errorCreateDeploymentPermission);
  }, [errorCreateDeploymentPermission]);
  useEffect(() => {
    errorCreateOrganizationPermission && setErrorsNotification(errorCreateOrganizationPermission);
  }, [errorCreateOrganizationPermission]);

  useEffect(() => {
    // Sends Success Notification for Update
    if (
      dataUpdateOrganizationPermission ||
      dataUpdateDeploymentPermission ||
      dataUpdateGroupPermission
    ) {
      // TODO(): Update these to selected entities rather than ifs:
      dataUpdateOrganizationPermission &&
        setSuccessNotification({
          title: 'Success',
          message: 'Organization Permission Updated Successfully',
        });
      dataUpdateDeploymentPermission &&
        setSuccessNotification({
          title: 'Success',
          message: 'Deployment Permission Updated Successfully',
        });
      dataUpdateGroupPermission &&
        setSuccessNotification({
          title: 'Success',
          message: 'Group Permission Updated Successfully',
        });

      cleanup();
    }
  }, [dataUpdateOrganizationPermission, dataUpdateDeploymentPermission]);

  useEffect(() => {
    errorUpdateDeploymentPermission && setErrorsNotification(errorUpdateDeploymentPermission);
  }, [errorUpdateDeploymentPermission]);
  useEffect(() => {
    errorUpdateOrganizationPermission && setErrorsNotification(errorUpdateOrganizationPermission);
  }, [errorUpdateOrganizationPermission]);
  useEffect(() => {
    errorUpdateGroupPermission && setErrorsNotification(errorUpdateGroupPermission);
  }, [errorUpdateGroupPermission]);

  useEffect(() => {
    // If any starts to load, dismiss modals.
    (isLoadingCreateOrganizationPermission ||
      isLoadingCreateDeploymentPermission ||
      isLoadingDeleteOrganizationPermission ||
      isLoadingDeleteDeploymentPermission ||
      isLoadingUpdateOrganizationPermission ||
      isLoadingUpdateDeploymentPermission ||
      isLoadingUpdateGroupPermission ||
      isLoadingDeleteGroupPermission) &&
      cleanup();
  }, [
    isLoadingCreateOrganizationPermission,
    isLoadingCreateDeploymentPermission,
    isLoadingDeleteOrganizationPermission,
    isLoadingDeleteDeploymentPermission,
    isLoadingUpdateOrganizationPermission,
    isLoadingUpdateDeploymentPermission,
    isLoadingUpdateGroupPermission,
    isLoadingDeleteGroupPermission,
  ]);

  useEffect(() => {
    // If Delete Error
    if (
      errorDeleteOrganizationPermission ||
      errorDeleteDeploymentPermission ||
      errorDeleteGroupPermission
    ) {
      setErrorNotification({ title: 'Error', message: 'Permission was not removed...' });
      cleanup();
    }
  }, [
    errorDeleteOrganizationPermission,
    errorDeleteDeploymentPermission,
    errorDeleteGroupPermission,
  ]);

  useEffect(() => {
    // If Delete Success
    if (
      isSuccessDeleteOrganizationPermission ||
      isSuccessDeleteDeploymentPermission ||
      isSuccessDeleteGroupPermission
    ) {
      setSuccessNotification({
        title: 'Success',
        message: 'Permission Deleted',
      });
      cleanup();
    }
  }, [
    isSuccessDeleteOrganizationPermission,
    isSuccessDeleteDeploymentPermission,
    isSuccessDeleteGroupPermission,
  ]);

  return (
    <PermissionContext.Provider
      value={{
        // General
        isLoadingPermissions:
          isLoadingCreateOrganizationPermission ||
          isLoadingCreateDeploymentPermission ||
          isLoadingCreateGroupPermission ||
          isLoadingDeleteOrganizationPermission ||
          isLoadingDeleteDeploymentPermission ||
          isLoadingUpdateOrganizationPermission ||
          isLoadingUpdateDeploymentPermission ||
          isLoadingUpdateGroupPermission ||
          isLoadingDeleteGroupPermission,
        setOrgIdForPermissions,
        cleanup,

        // Adding
        addingPermissionsType,
        setAddingPermissionsType,
        createOrganizationPermission,
        createDeploymentPermission,
        createGroupPermission,
        isLoadingAddingPermissions:
          isLoadingCreateOrganizationPermission ||
          isLoadingCreateDeploymentPermission ||
          isLoadingCreateGroupPermission,

        // Updates
        updatingPermission,
        setUpdatingPermission,
        onUpdatePermission,

        selectedEntityType,
        setSelectedEntityType,

        // Delete
        deletingPermission,
        setDeletingPermission,
        onDeletePermission,

        // Submit Payload Attributes
        emailInput,
        setEmailInput,
        firstNameInput,
        setFirstNameInput,
        lastNameInput,
        setLastNameInput,
        inputIsAdmin,
        setInputIsAdmin,
        inputIsRead,
        setInputIsRead,
        inputIsWrite,
        setInputIsWrite,
        inputIsDelete,
        setInputIsDelete,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
