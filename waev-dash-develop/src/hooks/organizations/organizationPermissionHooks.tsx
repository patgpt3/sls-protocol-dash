import {
  useMutation,
  useQueryClient,
  useStrictQuery,
  useContext,
  useListOrganizations,
} from 'hooks';
import {
  ApiResponse,
  OrganizationPermissions,
  WaevPermissionsSubmitPayload,
  ResponseWaevPermission,
  ResponseWaevPermissions,
  WaevErrors,
  WaevPermissions,
  RootStateType,
} from 'types';
import {
  apiCreateOrganizationPermission,
  apiDeleteOrganizationPermission,
  apiListOrganizationPermissions,
  apiGetOrganizations,
  // apiListOrganizationPermissions,
  apiUpdateOrganizationPermission,
} from 'network';
import { SelectedEntityContext } from 'contexts';
import { useSelector } from 'react-redux';

export const useListOrganizationsPermissions = (options?: {}) => {
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);
  const { refetchSelectedOrganization } = useContext(SelectedEntityContext);

  return useStrictQuery<
    ResponseWaevPermissions,
    WaevErrors,
    OrganizationPermissions[] | [] | undefined
  >(
    ['Organizations'],
    // @ts-ignore
    async () => {
      if (!currentUser || !currentUser?.id || !currentUser?.attributes?.token) {
        return Promise.resolve({
          errors: [
            { details: 'No Valid Organization ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseWaevPermissions);
      }
      if (typeof token === 'string') {
        return apiGetOrganizations();
      } else {
        return Promise.reject({
          errors: [{ details: 'No JWT', title: 'Bad Request', status: 400 }],
        } as ResponseWaevPermissions);
      }
    },
    {
      select: (result) => {
        //@ts-ignore
        if (result?.included) {
          //@ts-ignore
          return (result?.included || []).filter(
            //@ts-ignore
            (include) => include?.type === 'organization_permissions'
          );
        }
        return;
      },
      onError: (error) => {
        console.error('getOrganizations Error', error);
      },
      onSuccess: () => {
        refetchSelectedOrganization();
      },
      refetchOnWindowFocus: false,
      enabled: !!currentUser,
      ...options,
    }
  );
};

export const useListOrganizationPermissions = (organizationId?: string, options?: {}) => {
  return useStrictQuery<ResponseWaevPermissions, WaevErrors, WaevPermissions[]>(
    ['OrganizationPermissions', organizationId],
    () => {
      if (!organizationId) {
        return Promise.reject({
          errors: [
            {
              details: 'No Valid OrganizationPermissions ID Defined',
              title: 'Bad Request',
              status: 400,
            },
          ],
        } as ResponseWaevPermissions);
      }
      return apiListOrganizationPermissions(organizationId);
    },
    {
      retry: false,
      select: (result) => result.data,
      refetchOnWindowFocus: false,
      enabled: !!organizationId,
      // onSuccess: (result) => {
      //   console.info('useGetOrganizationPermission Hook:', result);
      // },
      onError: (error) => {
        console.error('useGetOrganizationPermission Error', error);
      },
      ...options,
    }
  );
};

export const useCreateOrganizationPermission = (
  organizationId?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  isAdmin?: boolean,
  isRead?: boolean,
  isWrite?: boolean,
  isDelete?: boolean,
  options?: {}
) => {
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);
  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const { selectedOrganizationId } = useContext(SelectedEntityContext);
  const { refetch: getPermissions } = useListOrganizationPermissions(selectedOrganizationId);
  return useMutation<ResponseWaevPermission, WaevErrors>(
    async () => {
      if (!organizationId) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID', title: 'Bad Request', status: 400 }],
        } as ResponseWaevPermission);
      }
      const payload: WaevPermissionsSubmitPayload = {
        data: {
          type: 'organization_permissions',
          attributes: {
            user_id: email,
            // first_name: firstName,
            // last_name: lastName,
            // organization_id: organizationId,
            permissions: {
              admin: isAdmin,
              read: isRead,
              write: isWrite,
              delete: isDelete,
            },
          },
        },
      };
      return apiCreateOrganizationPermission(organizationId, payload);
    },
    {
      // onMutate: () => {
      //   // Optimistically adds organizationPermission
      //   queryClient.setQueryData(['OrganizationPermissions'], (old: ResponseWaevPermissions) => {
      //     if (old) {
      //       const org = {
      //         id: 'TEMP',
      //         attributes: {
      //           email,
      //           first_name,
      //           last_name,
      //         },
      //       };
      //       old?.data
      //         ? //@ts-ignore
      //           old.data.push(org)
      //         : //@ts-ignore
      //           (old.data = [org]);
      //     }
      //     return old;
      //   });
      //   // getSubscribers();
      // },
      onSuccess: () => {
        getOrganizations();
        getPermissions();
        // setSelectedOrganizationPermissionId && setSelectedOrganizationPermissionId(result.data.id);
        // setLocalStoreObject(
        //   `@selectedOrganizationPermission`,
        //   result.organizationPermission
        // );
      },
      ...options,
    }
  );
};

export const useUpdateOrganizationPermission = (
  organizationPermission: OrganizationPermissions,
  isAdmin?: boolean,
  isRead?: boolean,
  isWrite?: boolean,
  isDelete?: boolean
) => {
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);

  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const { selectedOrganizationId } = useContext(SelectedEntityContext);
  const { refetch: getPermissions } = useListOrganizationPermissions(selectedOrganizationId);

  return useMutation<ResponseWaevPermission, WaevErrors>(
    async () => {
      if (!organizationPermission) {
        return Promise.reject({
          errors: [{ details: 'No ID', title: 'Bad Request', status: 400 }],
        } as ResponseWaevPermission);
      }
      const payload: WaevPermissionsSubmitPayload = {
        data: {
          type: 'organization_permissions',
          id: organizationPermission?.id,
          attributes: {
            permissions: {
              admin: isAdmin,
              read: isRead,
              write: isWrite,
              delete: isDelete,
            },
          },
        },
      };
      return apiUpdateOrganizationPermission(
        organizationPermission?.attributes.organization_id,
        organizationPermission?.id,
        payload
      ).then((result) => {
        return result;
      });
    },
    {
      onSuccess: () => {
        getOrganizations();
        getPermissions();
      },
    }
  );
};

export const useDeleteOrganizationPermission = (
  organizationPermission: OrganizationPermissions,
  options?: {}
) => {
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);

  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const { selectedOrganizationId } = useContext(SelectedEntityContext);
  const { refetch: getPermissions } = useListOrganizationPermissions(selectedOrganizationId);
  const queryClient = useQueryClient();
  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!organizationPermission) {
        return Promise.reject();
      }
      return apiDeleteOrganizationPermission(
        organizationPermission.attributes.organization_id,
        organizationPermission.id
      ).then((result) => {
        return result;
      });
    },
    {
      // onMutate: () => {
      //   // Optimistically deletes the OrganizationPermissions
      //   queryClient.setQueryData(
      //     ['OrganizationPermissions'],
      //     (old: ResponseWaevPermissions) => {
      //       const updated = old.data.filter((org) => org.id !== organizationPermissionId);
      //       return { ...old, ...{ data: updated } };
      //     }
      //   );
      // },
      onSuccess: (result) => {
        if (result) {
          getOrganizations();
          getPermissions();
          // Remove React Query Cache
          queryClient.removeQueries(['OrganizationPermissions', organizationPermission.id]);
        }
      },
      ...options,
    }
  );
};
