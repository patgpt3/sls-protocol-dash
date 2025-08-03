import { useContext, useListGroups, useMutation, useQueryClient, useStrictQuery } from 'hooks';
import {
  // ApiResponse,
  WaevPermissions,
  WaevPermissionsSubmitPayload,
  ResponseWaevPermission,
  WaevErrors,
  ApiResponse,
} from 'types';
import {
  apiCreateGroupPermission,
  apiDeleteGroupPermission,
  apiGetGroupPermissionById,
  apiUpdateGroupPermission,
} from 'network';
import { NotificationContext } from 'contexts';

export const useGetGroupPermission = (
  groupId?: string,
  groupPermissionId?: string,
  options?: {}
) => {
  return useStrictQuery<ResponseWaevPermission, WaevErrors, WaevPermissions | undefined>(
    ['GroupPermission', groupId],
    () => {
      if (!groupPermissionId || !groupId) {
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
      return apiGetGroupPermissionById(groupId, groupPermissionId);
    },
    {
      retry: false,
      // select: (data) => data.groupPermission,
      refetchOnWindowFocus: false,
      enabled: !!groupPermissionId,
      onError: (error) => {
        console.error('useGetGroupPermission Error', error);
      },
      ...options,
    }
  );
};

export const useCreateGroupPermission = (
  deploymentId?: string,
  groupId?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  isAdmin?: boolean,
  isRead?: boolean,
  // isWrite?: boolean,
  // isDelete?: boolean,
  options?: {}
) => {
  const { refetch: refetchListGroups } = useListGroups(deploymentId);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);

  return useMutation<ResponseWaevPermission, WaevErrors>(
    async () => {
      if (!groupId) {
        return Promise.resolve({
          errors: [{ details: 'No Group ID', title: 'Bad Request', status: 400 }],
        } as ResponseWaevPermission);
      }
      const payload: WaevPermissionsSubmitPayload = {
        data: {
          type: 'group_permissions',
          attributes: {
            user_id: email,
            first_name: firstName,
            last_name: lastName,
            groups: {
              id: groupId,
            },
            permissions: {
              read: isRead,
              admin: isAdmin,
            },
          },
        },
      };
      return apiCreateGroupPermission(groupId, payload);
    },
    {
      // onMutate: () => {
      //   // Optimistically adds groupPermission
      //   queryClient.setQueryData(['GroupPermissions'], (old: ResponseGroupPermissions) => {
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
        console.error('useCreateGroupPermission Error', error);
        error &&
          setErrorNotification({
            title: 'Create Group Permission Error',
            message: error?.message || 'Could not create group permission.',
          });
      },
      onSuccess: (result) => {
        // setSelectedGroupPermissionId && setSelectedGroupPermissionId(result.data.id);
        // setLocalStoreObject(
        //   `@selectedGroupPermission`,
        //   result.groupPermission
        // );
        setSuccessNotification({
          title: 'Success',
          message: 'Group Permission Created',
        });
        refetchListGroups();
      },
      ...options,
    }
  );
};

export const useUpdateGroupPermission = (
  groupPermission?: WaevPermissions,
  deploymentId?: string,
  isAdmin?: boolean,
  isRead?: boolean,
  isWrite?: boolean,
  isDelete?: boolean
) => {
  const { refetch: refetchListGroups } = useListGroups(deploymentId);

  return useMutation<ResponseWaevPermission, WaevErrors>(
    async () => {
      if (!groupPermission) {
        return Promise.reject({
          errors: [{ details: 'No IDs', title: 'Bad Request', status: 400 }],
        } as ResponseWaevPermission);
      }
      const payload: WaevPermissionsSubmitPayload = {
        data: {
          type: 'permissions',
          id: groupPermission.id,
          // TODO(): This user_id is not correct, but it is something currently required by MW (although does not work). Update it just in case.
          user_id: groupPermission.id,
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
      return apiUpdateGroupPermission(
        groupPermission?.attributes.groups.id,
        groupPermission?.id,
        payload
      );
    },
    {
      onSuccess: () => {
        refetchListGroups();
      },
    }
  );
};

export const useDeleteGroupPermission = (
  groupPermission?: WaevPermissions,
  deploymentId?: string,
  options?: {}
) => {
  const queryClient = useQueryClient();
  const { refetch: refetchListGroups } = useListGroups(
    deploymentId,
    groupPermission?.attributes.groups.id
  );
  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!groupPermission || !deploymentId) {
        return Promise.reject();
      }
      // @ts-ignore
      return apiDeleteGroupPermission(
        groupPermission?.attributes.groups.id,
        groupPermission?.id
      ).then((result) => {
        return result;
      });
    },
    {
      // onMutate: () => {
      //   // Optimistically deletes the WaevPermissions
      //   queryClient.setQueryData(
      //     ['GroupPermissions'],
      //     (old: ResponseGroupPermissions) => {
      //       const updated = old.data.filter((org) => org.id !== groupPermissionId);
      //       return { ...old, ...{ data: updated } };
      //     }
      //   );
      // },
      onSuccess: (result) => {
        if (result) {
          refetchListGroups();
          // Remove React Query Cache
          queryClient.removeQueries(['SelectedGroupPermission', groupPermission.id]);
        }
      },
      ...options,
    }
  );
};
