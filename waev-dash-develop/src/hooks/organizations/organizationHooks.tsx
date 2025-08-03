import { NotificationContext, OrganizationContext, SelectedEntityContext } from 'contexts';
import { useCallback, useContext, useMutation, useQueryClient, useStrictQuery } from 'hooks';
import {
  apiCreateOrganization,
  apiDeleteOrganization,
  apiGetOrganizationById,
  apiGetOrganizations,
  apiUpdateOrganization,
} from 'network';
import {
  ApiResponse,
  Organization,
  OrganizationPermissions,
  OrganizationSubmitPayload,
  ResponseOrganization,
  ResponseOrganizations,
  WaevErrors,
  RootStateType,
  WaevError,
} from 'types';
import { useSelector } from 'react-redux';

export const useListOrganizations = (currentUser: any, token: any, options?: {}) => {
  // const queryClient = useQueryClient();

  return useStrictQuery<ResponseOrganizations, WaevErrors, Organization[] | [] | undefined>(
    ['Organizations', typeof token === 'string' ? currentUser?.id : null],
    async () => {
      if (!currentUser || !currentUser.id || !currentUser?.attributes?.token) {
        return Promise.reject({
          errors: [{ details: 'No Current User', title: 'Bad Request', status: 400 }],
        } as ResponseOrganizations);
      }
      if (typeof token !== 'string') {
        return Promise.reject({
          errors: [{ details: 'No JWT', title: 'Bad Request', status: 400 }],
        } as ResponseOrganization);
      }
      return apiGetOrganizations();
    },
    {
      select: useCallback((result) => {
        (result?.included || []).forEach((include: any) => {
          if (include.type === 'organization_permissions') {
            const index = result.data.findIndex(
              (dep: Organization) => dep.id === include.attributes.organization_id
            );
            if (index > -1) {
              if (result.data[index].fullPermissions) {
                result.data[index].fullPermissions.findIndex(
                  (perm: OrganizationPermissions) => perm.id === include.id
                ) === -1 && result.data[index].fullPermissions.push(include);
              } else {
                result.data[index].fullPermissions = [include];
              }
            }
          }
        });
        return result.data;
      }, []),
      onError: (error) => {
        console.error('getOrganizations Error', error);
      },
      // onSuccess: (results) => {
        // results?.forEach((result) => {
        //   queryClient.setQueryData(['SelectedOrganization', result.id], {
        //     data: result,
        //     included: [],
        //   });
        // });
      // },
      refetchOnWindowFocus: false,
      enabled: !!currentUser,
      ...options,
    }
  );
};

export const useGetOrganization = (
  organizationIdOverride?: string,
  // isRefetch?: boolean,
  options?: {}
) => {
  const organizationId = organizationIdOverride;
  // const currentUser = useSelector((state: RootStateType) => state.user.userData);
  // const queryClient = useQueryClient();

  return useStrictQuery<ResponseOrganization, WaevErrors, Organization | undefined>(
    ['SelectedOrganization', organizationId],
    () => {
      // if (!organizationId || !currentUser) {
      if (!organizationId) {
        return Promise.resolve({
          errors: [
            { details: 'No Valid Organization ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseOrganization);
      }
      // if (isRefetch) {
      return apiGetOrganizationById(organizationId);
      // }
      // const query = queryClient.getQueryData<ResponseOrganization>([
      //   'SelectedOrganization',
      //   organizationId,
      // ]);
      // if (query?.data?.id) {
      //   return Promise.resolve({ data: query.data });
      // }
      // return Promise.resolve({});
    },
    {
      retry: false,
      select: (result) => {
        return {
              ...result?.data,
              fullPermissions: result?.included || [],
            };
      },
      refetchOnWindowFocus: false,
      enabled: !!organizationId,
      onError: (error) => {
        console.error('useGetOrganization Error', error);
      },
      ...options,
    }
  );
};

export const useCreateOrganization = (nameInput?: string, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);
  const { setSelectedOrganizationId } = useContext(SelectedEntityContext);
  const { setOrgNameInput } = useContext(OrganizationContext);

  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const queryClient = useQueryClient();

  return useMutation<ResponseOrganization, WaevError>(
    async () => {
      if (!nameInput) {
        return Promise.reject({
          error: { message: 'No Name Defined', title: 'Bad Request', status: 400 },
        } as ResponseOrganization);
      }
      const data: OrganizationSubmitPayload = {
        data: {
          type: 'organizations',
          attributes: {
            name: nameInput,
          },
        },
      };
      return apiCreateOrganization(data);
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['Organizations', currentUser.id]);

        // Optimistically deletes the Organization
        queryClient.setQueryData(
          ['Organizations', currentUser.id],
          (old: ResponseOrganizations) => {
            const org = {
              id: undefined,
              type: 'organizations',
              attributes: {
                name: nameInput,
                deployment_count: 0,
                fingerprint: '',
              },
            } as Organization;
            old.data.push(org);
            return old;
          }
        );
      },
      onSuccess: (result) => {
        setSuccessNotification({
          title: 'Success',
          message: 'Organization Created',
        });
        getOrganizations();
        if (result?.data?.id) {
          setSelectedOrganizationId(result.data.id);
        }
      },
      onSettled: () => {
        setOrgNameInput(undefined);
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create Organization Error',
          message: error?.message || 'Could not create organization.',
        });
      },
      ...options,
    }
  );
};

export const useUpdateOrganization = (organization?: Organization, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);
  const { setUpdatingOrganization, setOrgNameInput } = useContext(OrganizationContext);
  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const queryClient = useQueryClient();

  return useMutation<ResponseOrganization, WaevErrors>(
    async () => {
      if (!organization) {
        return Promise.reject();
      }
      const data: OrganizationSubmitPayload = {
        data: {
          type: 'organizations',
          id: organization.id,
          attributes: {
            name: organization.attributes.name,
          },
        },
      };
      return apiUpdateOrganization(organization.id, data);
    },
    {
      onMutate: () => {
        // Optimistically updates the name of the Organization
        queryClient.setQueryData(
          ['Organizations', currentUser.id],
          (old: ResponseOrganizations) => {
            const objIndex =
              old?.data && old.data.findIndex((obj: Organization) => obj.id === organization?.id);
            if (old && old.data[objIndex].attributes) {
              old.data[objIndex].attributes.name = organization.attributes.name;
            }
            return old;
          }
        );
      },
      onSuccess: () => {
        setSuccessNotification({
          title: 'Success',
          message: 'Organization Updated',
        });
        getOrganizations();
      },
      onSettled: () => {
        setUpdatingOrganization(undefined);
        setOrgNameInput(undefined);
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Update Organization Error',
          message: error?.errors[0].title || 'Could not update organization.',
        });
      },
      ...options,
    }
  );
};

export const useDeleteOrganization = (organizationIdOverride?: string, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);
  const { selectedOrganization, setSelectedOrganizationId, setSelectedDeploymentId } =
    useContext(SelectedEntityContext);
  const organizationId = organizationIdOverride || selectedOrganization?.id;
  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!organizationId) {
        return Promise.reject();
      }

      return apiDeleteOrganization(organizationId).then((result) => {
        return result;
      });
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['Organizations', currentUser.id]);
        await queryClient.cancelQueries(['Organization', organizationId]);

        // Optimistically deletes the Organization
        queryClient.setQueryData(
          ['Organizations', currentUser.id],
          (old: ResponseOrganizations) => {
            const updated = old.data.filter((org: Organization) => org.id !== organizationId);
            return { ...old, data: updated };
          }
        );
      },
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Organization Deleted',
          });
          // Remove React Query Cache
          queryClient.removeQueries(['SelectedOrganization', organizationId]);
          // setLocalStoreObject(`@selectedOrganizationFor-${businessId}-${locationId}`, null);
          setSelectedOrganizationId && setSelectedOrganizationId(undefined);
          setSelectedDeploymentId && setSelectedDeploymentId(undefined);
          getOrganizations();
        }
      },
      onError: (error) => {
        getOrganizations();
        setErrorNotification({
          title: 'Delete Organization Error',
          message: error?.errors[0].title || 'Could not delete organization.',
        });
      },
      ...options,
    }
  );
};
