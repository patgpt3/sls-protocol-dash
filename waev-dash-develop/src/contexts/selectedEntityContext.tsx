import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { Deployment, Group, Organization } from 'types';
import {
  useEffect,
  useGetDeployment,
  useGetGroup,
  useGetOrganization,
  useListDeployments,
  useListGroups,
  useListOrganizations,
  useLocalStorageByUser,
} from 'hooks';
import { noop } from 'utils';
import { CurrentUserContext } from './currentUserContext';

interface SelectedEntityWithSetter {
  // Organizations
  selectedOrganization: Organization;
  selectedOrganizationId: string;
  setSelectedOrganizationId: (id: string) => void;
  refetchSelectedOrganization: () => void;
  isLoadingOrganization: boolean;
  organizationDeployments: Deployment[];

  // Deployments
  selectedDeployment: Deployment;
  selectedDeploymentId: string;
  setSelectedDeploymentId: (id: string) => void;
  refetchDeployments: () => void;
  isLoadingDeployment: boolean;

  // Groups
  selectedGroup: Group;
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  refetchGroups: () => void;
  isLoadingGroup: boolean;
}

export const SelectedEntityContext = createContext<SelectedEntityWithSetter>({
  // Organizations
  selectedOrganization: undefined,
  selectedOrganizationId: undefined,
  setSelectedOrganizationId: noop,
  refetchSelectedOrganization: noop,
  isLoadingOrganization: false,
  organizationDeployments: [],

  // Deployments
  selectedDeployment: undefined,
  selectedDeploymentId: undefined,
  setSelectedDeploymentId: noop,
  refetchDeployments: noop,
  isLoadingDeployment: false,

  // Groups
  selectedGroup: undefined,
  selectedGroupId: undefined,
  setSelectedGroupId: noop,
  refetchGroups: noop,
  isLoadingGroup: false,
});

interface DefaultOrganizationEntities {
  [key: string]: {
    [key: string]: string;
    selectedDeploymentId?: string;
    selectedGroupId?: string;
  };
}
interface Props {
  value?: SelectedEntityWithSetter;
}

export const SelectedEntityContextProvider = ({
  children,
  value,
}: PropsWithChildren<Props>): JSX.Element => {
  const { currentUser, token } = useContext(CurrentUserContext);

  // Local Storage
  const [defaultEntities, setDefaultEntities] = useLocalStorageByUser<
    DefaultOrganizationEntities | undefined | null
  >(currentUser?.id, 'SelectedDefaults', undefined);

  // Organizations
  const [selectedOrganizationId, setSelectedOrganizationId] = useLocalStorageByUser<
    string | undefined
  >(currentUser?.id, 'SelectedOrganization', undefined);

  const { refetch: refetchSelectedOrganization, data: selectedOrganization } = useGetOrganization(
    selectedOrganizationId,
    true
  );

  const {
    data: dataGetOrganizations,
    isLoading: isLoadingOrganizations,
    isFetching: isFetchingOrgs,
  } = useListOrganizations(currentUser, token);

  // Deployments
  const [selectedDeploymentId, setSelectedDeploymentId] = useLocalStorageByUser<string | undefined>(
    currentUser?.id,
    'SelectedDeployment',
    undefined
  );

  const {
    data: organizationDeployments,
    isLoading: isLoadingDeployments,
    refetch: refetchDeployments,
    isFetching: isFetchingDeployments,
  } = useListDeployments(selectedOrganizationId);

  const { refetch: refetchSelectedDeployment, data: selectedDeployment } = useGetDeployment(
    selectedOrganization?.id,
    selectedDeploymentId
  );

  // Groups
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);

  const {
    // data: deploymentGroups,
    isLoading: isLoadingGroups,
    refetch: refetchGroups,
    // isFetching: isFetchingGroups,
  } = useListGroups(selectedDeploymentId);

  const { refetch: refetchSelectedGroup, data: selectedGroup } = useGetGroup(
    selectedGroupId,
    selectedDeploymentId
  );

  /*
   * Effects
   */
  // Organizations
  useEffect(() => {
    // Updating Selected Organizations
    selectedOrganizationId && refetchSelectedOrganization();
  }, [selectedOrganizationId, refetchSelectedOrganization]);

  useEffect(() => {
    // Organization Auto-Select
    // If no organizations are selected for user, and there are organizations, select the first.
    if (
      currentUser?.id &&
      dataGetOrganizations?.length > 0 &&
      dataGetOrganizations[0].id &&
      !isFetchingOrgs
    ) {
      const selectedOrganization = dataGetOrganizations.find(
        (org) => org.id === selectedOrganizationId
      );
      if (!selectedOrganizationId || !selectedOrganization) {
        setSelectedOrganizationId(dataGetOrganizations[0].id);
      }
    }
  }, [dataGetOrganizations, selectedOrganizationId, currentUser, isFetchingOrgs]);

  // Deployments
  useEffect(() => {
    // Updating Selected Deployments
    selectedDeploymentId && refetchSelectedDeployment();
  }, [selectedDeploymentId, refetchSelectedDeployment]);

  useEffect(() => {
    // Deployment Auto-Select
    if (selectedOrganization) {
      let deploymentId = selectedDeploymentId;

      // Skip updating the selected deployment id when fetching deployments
      if (isFetchingDeployments) return;

      // If selected deployment is invalid for organization
      if (!isLoadingDeployments) {
        if (!(organizationDeployments || []).map((dep) => dep?.id).includes(selectedDeploymentId)) {
          // See if it is in defaults
          if (
            defaultEntities &&
            defaultEntities[selectedOrganization.id] &&
            defaultEntities[selectedOrganization.id].selectedDeploymentId &&
            organizationDeployments &&
            (organizationDeployments || [])
              .filter((dep) => dep?.attributes?.status === 'complete')
              .map((dep) => dep.id)
              .includes(defaultEntities[selectedOrganization.id].selectedDeploymentId)
          ) {
            setSelectedDeploymentId(defaultEntities[selectedOrganization.id].selectedDeploymentId);
          } else {
            // Select first valid in list if available
            const validDeployments = (organizationDeployments || []).filter(
              (dep) => dep?.attributes?.status === 'complete'
            );
            deploymentId = validDeployments?.length > 0 ? validDeployments[0].id : undefined;
            setSelectedDeploymentId(deploymentId);
          }
        }

        const obj: any = {};
        obj[selectedOrganizationId] = {
          selectedDeploymentId: deploymentId,
        };
        setDefaultEntities({
          ...defaultEntities,
          ...obj,
        });
      }
    }
  }, [selectedOrganization, selectedDeploymentId, organizationDeployments, isLoadingDeployments]);

  // Groups
  useEffect(() => {
    // Updating Selected Groups
    selectedGroupId && refetchSelectedGroup();
  }, [selectedGroupId, refetchSelectedGroup]);

  return (
    <SelectedEntityContext.Provider
      value={{
        // Organizations
        selectedOrganization: selectedOrganizationId ? selectedOrganization : undefined,
        selectedOrganizationId,
        setSelectedOrganizationId,
        refetchSelectedOrganization,
        isLoadingOrganization: isLoadingOrganizations,
        organizationDeployments,
        // Deployments
        selectedDeployment: selectedDeploymentId ? selectedDeployment : undefined,
        selectedDeploymentId,
        setSelectedDeploymentId,
        refetchDeployments,
        isLoadingDeployment: isLoadingDeployments,
        // Groups
        selectedGroup: selectedGroupId ? selectedGroup : undefined,
        selectedGroupId,
        setSelectedGroupId,
        refetchGroups,
        isLoadingGroup: isLoadingGroups,
        ...value,
      }}
    >
      {children}
    </SelectedEntityContext.Provider>
  );
};
