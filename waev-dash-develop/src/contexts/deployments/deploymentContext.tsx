import { createContext, useContext, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import {
  Deployment,
  DeploymentPermissions,
  DeploymentSectionTypes,
  Organization,
  ResponseDeployment,
  RootStateType,
} from 'types';
import {
  useCreateDeployment,
  useDeleteDeployment,
  useDidMountEffect,
  useEffect,
  useListDeployments,
  useState,
  useUpdateDeployment,
} from 'hooks';
import { isAllowed, noop } from 'utils';
import { SelectedEntityContext } from '../selectedEntityContext';

interface DeploymentWithSetter {
  isLoadingDeployment?: boolean;
  isLoadingCreateDeployment?: boolean;
  isLoadingDeleteDeployment?: boolean;
  deploymentNameInput?: string;
  setDeploymentNameInput: (deploymentNameInput?: string) => void;
  updatingDeployment?: Deployment;
  setUpdatingDeployment?: (updatingDeployment?: Deployment) => void;
  updatingOrganization?: Organization;
  setUpdatingOrganization?: (updatingOrganization: Organization) => void;
  updatingSection: DeploymentSectionTypes;
  setUpdatingSection: (updatingSection: DeploymentSectionTypes) => void;
  currentUserDeploymentPermissions?: DeploymentPermissions;
  isHasOwnerOrAdminAccess: boolean;
  isHasOwnerAccess: boolean;
  isHasReadAccess: boolean;
  isHasWriteAccess: boolean;

  createDeployment?: Function;
  isSuccessCreateDeployment?: boolean;
  dataCreateDeployment?: ResponseDeployment;
  isAddingDeployment?: boolean;
  setIsAddingDeployment?: (isAddingDeployment: boolean) => void;
  isAddingGroup?: boolean;
  setIsAddingGroup?: (isAddingGroup: boolean) => void;
  isAssociatingUnion?: boolean;
  setIsAssociatingUnion?: (isAssociatingUnion: boolean) => void;
  onUpdateSubmit: () => void;
  onUpdateFieldsSubmit: () => void;
  onUpdateNameSubmit: () => void;
  isLoadingUpdate?: boolean;
  deleteDeployment: () => void;
  toggleUpdatingDeployment: (on?: boolean) => void;
  cleanup: () => void;

  // Data Ingest
  ingestUserField: string | '';
  setIngestUserField: (ingestUserField: string | undefined) => void;
  ingestFieldsInput: string[];
  setIngestFieldsInput: (ingestFieldsInput: string[]) => void;
  ingestPrivateFieldsInput: string[];
  setIngestPrivateFieldsInput: (ingestPrivateFieldsInput: string[]) => void;
  isUserRequiredAlert: boolean;
  setIsUserRequiredAlert: (isUserRequiredAlert: boolean) => void;
  isEmptyConfigAlert: boolean;
  setIsEmptyConfigAlert: (isEmptyConfigAlert: boolean) => void;
  isDuplicateFieldAlert: boolean;
  setIsDuplicateFieldAlert: (isDuplicateFieldAlert: boolean) => void;
  isIngestAllFields: boolean | '';
  setIsIngestAllFields: (isIngestAllFields: boolean) => void;
  // Opt-In Fields
  optInEmailField: string | '';
  setOptInEmailField: (optInEmailField: string) => void;
  // optInSmsField: string | '';
  // setOptInSmsField: (optInSmsField: string) => void;
  optInPhoneField: string | '';
  setOptInPhoneField: (optInPhoneField: string) => void;
}

export const DeploymentContext = createContext<DeploymentWithSetter>({
  isLoadingDeployment: false,
  isLoadingCreateDeployment: false,
  isLoadingDeleteDeployment: false,
  deploymentNameInput: '',
  setDeploymentNameInput: noop,
  updatingDeployment: undefined,
  setUpdatingDeployment: noop,
  updatingOrganization: undefined,
  setUpdatingOrganization: noop,
  updatingSection: undefined,
  setUpdatingSection: noop,
  currentUserDeploymentPermissions: undefined,
  isHasOwnerOrAdminAccess: false,
  isHasOwnerAccess: false,
  isHasReadAccess: false,
  isHasWriteAccess: false,
  isLoadingUpdate: false,
  toggleUpdatingDeployment: noop,
  cleanup: noop,

  createDeployment: noop,
  isSuccessCreateDeployment: false,
  dataCreateDeployment: undefined,
  isAddingDeployment: false,
  setIsAddingDeployment: noop,
  isAddingGroup: false,
  setIsAddingGroup: noop,
  isAssociatingUnion: false,
  setIsAssociatingUnion: noop,
  deleteDeployment: noop,

  onUpdateSubmit: noop,
  onUpdateFieldsSubmit: noop,
  onUpdateNameSubmit: noop,
  isUserRequiredAlert: false,
  setIsUserRequiredAlert: noop,
  isEmptyConfigAlert: false,
  setIsEmptyConfigAlert: noop,
  isDuplicateFieldAlert: false,
  setIsDuplicateFieldAlert: noop,
  // Data Ingest
  ingestUserField: undefined,
  setIngestUserField: noop,
  ingestFieldsInput: [],
  setIngestFieldsInput: noop,
  ingestPrivateFieldsInput: [],
  setIngestPrivateFieldsInput: noop,
  isIngestAllFields: false,
  setIsIngestAllFields: noop,
  // Opt-In Fields
  optInEmailField: undefined,
  setOptInEmailField: noop,
  // optInSmsField: undefined,
  // setOptInSmsField: noop,
  optInPhoneField: undefined,
  setOptInPhoneField: noop,
});

interface Props {
  value?: DeploymentWithSetter;
}

const REFETCH_PENDING_INTERVAL_MS = 15000;

export const DeploymentContextProvider = ({ children }: PropsWithChildren<Props>): JSX.Element => {
  const currentUser = useSelector((state: RootStateType) => state.user.userData);

  const {
    refetchDeployments,
    selectedOrganization,
    selectedDeployment,
    setSelectedDeploymentId,
    selectedOrganizationId,
  } = useContext(SelectedEntityContext);

  const [currentUserDeploymentPermissions, setCurrentUserDeploymentPermissions] = useState<
    DeploymentPermissions | undefined
  >(undefined);
  const [isHasOwnerAccess, setIsHasOwnerAccess] = useState<boolean | undefined>(undefined);
  const [isHasOwnerOrAdminAccess, setIsHasOwnerOrAdminAccess] = useState<boolean | undefined>(
    undefined
  );
  const [isHasReadAccess, setIsHasReadAccess] = useState<boolean | undefined>(undefined);
  const [isHasWriteAccess, setIsHasWriteAccess] = useState<boolean | undefined>(undefined);

  const [deploymentNameInput, setDeploymentNameInput] = useState<string | undefined>('');
  const [isAddingDeployment, setIsAddingDeployment] = useState<boolean | undefined>(false);
  const [isAddingGroup, setIsAddingGroup] = useState<boolean | undefined>(false);
  const [isAssociatingUnion, setIsAssociatingUnion] = useState<boolean | undefined>(false);
  const [updatingDeployment, setUpdatingDeployment] = useState<Deployment | undefined>(undefined);
  const [updatingOrganization, setUpdatingOrganization] = useState<Organization | undefined>(
    undefined
  );
  const [updatingSection, setUpdatingSection] = useState<DeploymentSectionTypes>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addedDeploymentId, setAddedDeploymentId] = useState<string>(undefined);
  // Data Ingest
  const [ingestUserField, setIngestUserField] = useState<string | undefined>(undefined);
  const [ingestFieldsInput, setIngestFieldsInput] = useState<string[] | undefined>(undefined);
  const [ingestPrivateFieldsInput, setIngestPrivateFieldsInput] = useState<string[] | undefined>(
    undefined
  );
  const [isIngestAllFields, setIsIngestAllFields] = useState<boolean | undefined>(undefined);
  const [isUserRequiredAlert, setIsUserRequiredAlert] = useState<boolean | undefined>(undefined);
  const [isEmptyConfigAlert, setIsEmptyConfigAlert] = useState<boolean | undefined>(undefined);
  const [isDuplicateFieldAlert, setIsDuplicateFieldAlert] = useState<boolean | undefined>(
    undefined
  );
  // Opt-In Fields
  const [optInEmailField, setOptInEmailField] = useState<string | undefined>(undefined);
  // const [optInSmsField, setOptInSmsField] = useState<string | undefined>(undefined);
  const [optInPhoneField, setOptInPhoneField] = useState<string | undefined>(undefined);

  /*
   * External Hooks
   */
  // Update Deployment
  const {
    mutate: updateDeployment,
    data: updateDeploymentData,
    isLoading: isLoadingUpdate,
  } = useUpdateDeployment(
    updatingDeployment,
    deploymentNameInput || updatingDeployment?.attributes.name || '',
    {
      user_field: ingestUserField,
      fields: isIngestAllFields
        ? undefined
        : ingestFieldsInput?.map((field) => {
            return { name: field };
          }),
      private_fields: isIngestAllFields
        ? undefined
        : ingestPrivateFieldsInput?.map((field) => {
            return { name: field };
          }),
    },
    selectedOrganizationId
  );

  // Create Deployment
  const {
    data: dataCreateDeployment,
    isLoading: isLoadingCreateDeployment,
    isSuccess: isSuccessCreateDeployment,
    mutate: createDeployment,
  } = useCreateDeployment(deploymentNameInput, selectedOrganization?.id, {
    user_field: ingestUserField,
    fields: ingestFieldsInput?.map((field) => {
      return { name: field };
    }),
    private_fields: ingestPrivateFieldsInput?.map((field) => {
      return { name: field };
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: organizationDeployments } = useListDeployments(selectedOrganizationId);

  const cleanup = () => {
    setUpdatingSection(undefined);
    setDeploymentNameInput(undefined);
    setIsIngestAllFields(undefined);
    setIsUserRequiredAlert(undefined);
    setIsEmptyConfigAlert(undefined);
    setIsDuplicateFieldAlert(undefined);
    loadDefaultSelectedFields();
    setUpdatingDeployment(undefined);
  };

  // Delete Deployment
  const { mutate: deleteDeployment, isLoading: isLoadingDeleteDeployment } = useDeleteDeployment(
    updatingDeployment?.id,
    selectedOrganizationId,
    cleanup
  );

  /*
   * Effects
   */

  // useEffect(() => {
  //   // refetchSelectedDeployment();
  //   refetchSelectedOrganization();
  // }, [refetchSelectedDeployment, refetchSelectedOrganization]);

  // Data Ingest
  useEffect(() => {
    // Loads Ingestion when deployment set to update
    if (updatingDeployment?.attributes?.config) {
      setIngestUserField(updatingDeployment?.attributes.config.user_field);
      setIngestFieldsInput(
        updatingDeployment?.attributes.config?.fields?.map((field: any) => {
          return field.name;
        })
      );
      setIngestPrivateFieldsInput(
        updatingDeployment?.attributes.config?.private_fields?.map((field: any) => {
          return field.name;
        })
      );
      if (
        updatingDeployment?.attributes.config.user_field &&
        !updatingDeployment?.attributes.config.private_fields &&
        !updatingDeployment?.attributes.config.fields
      ) {
        setIsIngestAllFields(true);
      }
    }
  }, [updatingDeployment]);

  const loadDefaultSelectedFields = () => {
    if (selectedDeployment?.attributes?.config) {
      setIngestUserField(selectedDeployment?.attributes.config.user_field);
      setIngestFieldsInput(
        selectedDeployment?.attributes.config?.fields?.map((field) => {
          return field.name;
        })
      );
      setIngestPrivateFieldsInput(
        selectedDeployment?.attributes.config?.private_fields?.map((field) => {
          return field.name;
        })
      );
    }
  };

  useEffect(() => {
    // Loads Ingestion when deployment selected
    loadDefaultSelectedFields();
  }, [selectedDeployment]);

  useEffect(() => {
    if (isAddingDeployment) {
      // Cancels Ingestion on Add/Remove Deployment
      setIngestUserField(undefined);
      setIngestFieldsInput(undefined);
      setIngestPrivateFieldsInput(undefined);
    } else {
      loadDefaultSelectedFields();
    }
  }, [isAddingDeployment]);

  useEffect(() => {
    // Removes user field when swapped to ingest all
    isIngestAllFields && setIngestUserField(undefined);
  }, [isIngestAllFields]);

  useEffect(() => {
    // Validation
    setIsUserRequiredAlert(
      (ingestFieldsInput?.length > 0 || ingestPrivateFieldsInput?.length > 0) &&
        !(ingestFieldsInput || []).includes(ingestUserField) &&
        !(ingestPrivateFieldsInput || []).includes(ingestUserField)
    );

    setIsEmptyConfigAlert(!ingestFieldsInput?.length && !ingestPrivateFieldsInput?.length);
    setIsDuplicateFieldAlert(
      (ingestFieldsInput || []).some((fieldInput) =>
        (ingestPrivateFieldsInput || []).includes(fieldInput)
      )
    );
  }, [ingestUserField, ingestFieldsInput, ingestPrivateFieldsInput]);

  useEffect(() => {
    // When the Deployment is updated, we update the selected Deployment and reset states.
    if (updateDeploymentData) {
      cleanup();
      refetchDeployments();
    }
  }, [updateDeploymentData, refetchDeployments]);

  useEffect(() => {
    // Select Created Deployment Id to track
    if (dataCreateDeployment && dataCreateDeployment?.data?.id) {
      setAddedDeploymentId(dataCreateDeployment?.data?.id);
    }
  }, [dataCreateDeployment]);

  useEffect(() => {
    // Select the next deployment when deleting a deployment
    // TODO(MFB): Remove deleting id from list as well
    if (isLoadingDeleteDeployment) {
      const validDeployments = (organizationDeployments || []).filter(
        (dep) => dep?.attributes?.status === 'complete'
      );
      const deploymentId = validDeployments?.length > 0 ? validDeployments[0].id : undefined;
      setSelectedDeploymentId(deploymentId);
    }
  }, [isLoadingDeleteDeployment]);

  // Pending Deployments
  useEffect(() => {
    if (
      organizationDeployments?.some((dep) =>
        ['processing', 'pending'].includes(dep?.attributes.status)
      )
    ) {
      let myInterval = setInterval(() => {
        refetchDeployments();
      }, REFETCH_PENDING_INTERVAL_MS);

      return () => {
        clearTimeout(myInterval);
      };
    }
  }, [organizationDeployments]);

  // Permissions
  useEffect(() => {
    // Gets Permission for Selected Deployment
    if (selectedDeployment?.fullPermissions?.length) {
      setCurrentUserDeploymentPermissions(
        selectedDeployment.fullPermissions.find(
          (perm) => perm.attributes?.users?.email === currentUser?.attributes?.email
        )
      );
    }
  }, [selectedDeployment]);

  useEffect(() => {
    if (currentUserDeploymentPermissions) {
      setIsHasOwnerOrAdminAccess(isAllowed(currentUserDeploymentPermissions, ['owner', 'admin']));
      setIsHasReadAccess(isAllowed(currentUserDeploymentPermissions, ['owner', 'admin', 'read']));
      setIsHasWriteAccess(isAllowed(currentUserDeploymentPermissions, ['owner', 'admin', 'write']));
      setIsHasOwnerAccess(isAllowed(currentUserDeploymentPermissions, ['owner']));
    }
  }, [currentUserDeploymentPermissions]);

  /*
   * Helpers
   */

  const toggleUpdatingDeployment = async (on?: boolean) => {
    if (on === true) {
      // const dep = (await Deployment.find(selectedDeployment.id)).data;
      return setUpdatingDeployment(selectedDeployment);
    } else if (on === false) {
      return cleanup();
    } else if (!updatingDeployment) {
      // const dep = (await Deployment.find(selectedDeployment.id)).data;
      return setUpdatingDeployment(selectedDeployment);
    } else {
      return cleanup();
    }
  };

  useDidMountEffect(() => {
    toggleUpdatingDeployment(!!updatingSection);
  }, [updatingSection]);

  const onUpdateSubmit = async () => {
    updateDeployment();
  };

  const onUpdateNameSubmit = async () => {
    updateDeployment();
  };

  const onUpdateFieldsSubmit = async () => {
    updateDeployment();
  };

  return (
    <DeploymentContext.Provider
      value={{
        isLoadingDeployment:
          isLoadingCreateDeployment || isLoadingDeleteDeployment || isLoadingUpdate,
        isLoadingCreateDeployment,
        isLoadingDeleteDeployment,
        deploymentNameInput,
        setDeploymentNameInput,
        updatingDeployment,
        setUpdatingDeployment,
        updatingOrganization,
        setUpdatingOrganization,
        updatingSection,
        setUpdatingSection,
        currentUserDeploymentPermissions,
        isHasOwnerOrAdminAccess,
        isHasOwnerAccess,
        isHasReadAccess,
        isHasWriteAccess,
        toggleUpdatingDeployment,
        cleanup,

        createDeployment,
        isSuccessCreateDeployment,
        dataCreateDeployment,
        isAddingDeployment,
        setIsAddingDeployment,
        isAddingGroup,
        setIsAddingGroup,
        isAssociatingUnion,
        setIsAssociatingUnion,
        onUpdateSubmit,
        onUpdateFieldsSubmit,
        onUpdateNameSubmit,
        isLoadingUpdate: isLoadingUpdate || isLoadingDeleteDeployment,
        deleteDeployment,

        // Data Ingest
        ingestUserField,
        setIngestUserField,
        ingestFieldsInput,
        setIngestFieldsInput,
        ingestPrivateFieldsInput,
        setIngestPrivateFieldsInput,
        isUserRequiredAlert,
        setIsUserRequiredAlert,
        isEmptyConfigAlert,
        setIsEmptyConfigAlert,
        isDuplicateFieldAlert,
        setIsDuplicateFieldAlert,
        isIngestAllFields,
        setIsIngestAllFields,
        // Opt-In Fields
        optInEmailField,
        setOptInEmailField,
        // optInSmsField,
        // setOptInSmsField,
        optInPhoneField,
        setOptInPhoneField,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
};
