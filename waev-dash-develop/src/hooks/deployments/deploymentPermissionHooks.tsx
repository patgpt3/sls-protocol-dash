import { useListDeployments, useMutation, useQueryClient, useStrictQuery } from 'hooks';
import {
  ApiResponse,
  WaevPermissions,
  WaevPermissionsSubmitPayload,
  ResponseWaevPermission,
  WaevErrors,
} from 'types';
import {
  apiCreateDeploymentPermission,
  apiDeleteDeploymentPermission,
  apiGetDeploymentPermissionById,
  apiUpdateDeploymentPermission,
} from 'network';

export const useGetDeploymentPermission = (
  deploymentId?: string,
  deploymentPermissionId?: string,
  options?: {}
) => {
  return useStrictQuery<ResponseWaevPermission, WaevErrors, WaevPermissions | undefined>(
    ['SelectedDeploymentPermission'],
    () => {
      if (!deploymentPermissionId || !deploymentId) {
        return Promise.reject({
          errors: [
            {
              details: 'No Valid WaevPermissions ID Defined',
              title: 'Bad Request',
              status: 400,
            },
          ],
        } as ResponseWaevPermission);
      }
      return apiGetDeploymentPermissionById(deploymentId, deploymentPermissionId);
    },
    {
      retry: false,
      // select: (data) => data.deploymentPermission,
      refetchOnWindowFocus: false,
      enabled: !!deploymentPermissionId,
      onError: (error) => {
        console.error('useGetDeploymentPermission Error', error);
      },
      ...options,
    }
  );
};

export const useCreateDeploymentPermission = (
  orgId?: string,
  deploymentId?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  isAdmin?: boolean,
  isRead?: boolean,
  isWrite?: boolean,
  isDelete?: boolean,
  options?: {}
) => {
  const { refetch: refetchListDeployments } = useListDeployments(orgId, deploymentId);
  return useMutation<ResponseWaevPermission, WaevErrors>(
    async () => {
      if (!deploymentId) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID', title: 'Bad Request', status: 400 }],
        } as ResponseWaevPermission);
      }
      const payload: WaevPermissionsSubmitPayload = {
        data: {
          type: 'deployment_permissions',
          attributes: {
            user_id: email,
            first_name: firstName,
            last_name: lastName,
            deployment_id: deploymentId,
            permissions: {
              admin: isAdmin,
              read: isRead,
              write: isWrite,
              delete: isDelete,
            },
          },
        },
      };
      return apiCreateDeploymentPermission(deploymentId, payload);
    },
    {
      // onMutate: () => {
      //   // Optimistically adds deploymentPermission
      //   queryClient.setQueryData(['DeploymentPermissions'], (old: ResponseDeploymentPermissions) => {
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
      onError: (error) => {
        console.error('useCreateDeploymentPermission Error', error);
      },
      onSuccess: () => {
        // setSelectedDeploymentPermissionId && setSelectedDeploymentPermissionId(result.data.id);
        // setLocalStoreObject(
        //   `@selectedDeploymentPermission`,
        //   result.deploymentPermission
        // );
        refetchListDeployments();
      },
      ...options,
    }
  );
};

export const useUpdateDeploymentPermission = (
  deploymentPermission?: WaevPermissions,
  organizationId?: string,
  isAdmin?: boolean,
  isRead?: boolean,
  isWrite?: boolean,
  isDelete?: boolean
) => {
  const { refetch: refetchListDeployments } = useListDeployments(organizationId);

  return useMutation<ResponseWaevPermission, WaevErrors>(
    async () => {
      if (!deploymentPermission) {
        return Promise.reject({
          errors: [{ details: 'No IDs', title: 'Bad Request', status: 400 }],
        } as ResponseWaevPermission);
      }
      const payload: WaevPermissionsSubmitPayload = {
        data: {
          type: 'deployment_permissions',
          id: deploymentPermission.id,
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
      return apiUpdateDeploymentPermission(
        deploymentPermission?.attributes.deployment_id,
        deploymentPermission?.id,
        payload
      ).then((result) => {
        return result;
      });
    },
    {
      onSuccess: () => {
        refetchListDeployments();
      },
    }
  );
};

export const useDeleteDeploymentPermission = (
  deploymentPermission?: WaevPermissions,
  organizationId?: string,
  options?: {}
) => {
  const queryClient = useQueryClient();
  const { refetch: refetchListDeployments } = useListDeployments(
    organizationId,
    deploymentPermission?.attributes.deployment_id
  );

  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!deploymentPermission || !organizationId) {
        return Promise.reject();
      }
      // @ts-ignore
      return apiDeleteDeploymentPermission(
        deploymentPermission?.attributes.deployment_id,
        deploymentPermission?.id
      ).then((result) => {
        return result;
      });
    },
    {
      // onMutate: () => {
      //   // Optimistically deletes the WaevPermissions
      //   queryClient.setQueryData(
      //     ['DeploymentPermissions'],
      //     (old: ResponseDeploymentPermissions) => {
      //       const updated = old.data.filter((org) => org.id !== deploymentPermissionId);
      //       return { ...old, ...{ data: updated } };
      //     }
      //   );
      // },
      onSuccess: (result) => {
        if (result) {
          refetchListDeployments();
          // Remove React Query Cache
          queryClient.removeQueries(['SelectedDeploymentPermission', deploymentPermission.id]);
        }
      },
      ...options,
    }
  );
};
