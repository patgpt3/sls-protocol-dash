import {
  ApiLoaderContext,
  GroupContext,
  NotificationContext,
  SelectedEntityContext,
} from 'contexts';
import {
  useCallback,
  useContext,
  useListDeployments,
  useMutation,
  useQueries,
  useQueryClient,
  useStrictQuery,
} from 'hooks';
import {
  Group,
  OptInFlag,
  ApiResponse,
  GroupSubmitPayload,
  ResponseGroup,
  ResponseGroups,
  WaevErrors,
  PartsType,
  WaevPermissions,
} from 'types';
import {
  apiCreateGroup,
  apiDeleteGroup,
  apiGetGroupById,
  apiGetGroups,
  apiGetUserGroups,
} from 'network';
import { deepCopy } from 'utils';

export const useListGroups = (deploymentId?: string, options?: {}) => {
  const queryClient = useQueryClient();

  return useStrictQuery<ResponseGroups, WaevErrors, Group[] | [] | undefined>(
    ['Groups', deploymentId],
    // @ts-ignore
    () => {
      if (!deploymentId) {
        return Promise.reject({
          errors: [
            { details: 'No Valid Deployment ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseGroup);
      }
      return apiGetGroups(deploymentId);
    },
    {
      select: useCallback((result) => {
        (result?.included || []).forEach((include: any) => {
          if (include.type === 'group_permissions') {
            const index = result.data.findIndex(
              (group: Group) => group.id === include.attributes.groups.id
            );
            if (index > -1) {
              if (result.data[index]?.fullPermissions) {
                result.data[index].fullPermissions.findIndex(
                  (perm: WaevPermissions) => perm.id === include.id
                ) === -1 && result.data[index].fullPermissions.push(include);
              } else {
                result.data[index].fullPermissions = [include];
              }
            }
          }
          if (include.type === 'flags') {
            const index = result.data.findIndex(
              (group: Group) => group.id === include.attributes.group_id
            );
            if (index > -1) {
              if (result.data[index]?.fullOptInFlags) {
                result.data[index].fullOptInFlags.findIndex(
                  (flag: OptInFlag) => flag.id === include.id
                ) === -1 && result.data[index].fullOptInFlags.push(include);
              } else {
                result.data[index].fullOptInFlags = [include];
              }
            }
          }
        });
        return result.data;
      }, []),
      onError: (error) => {
        console.error('getGroups Error', error);
      },
      onSuccess: (results) => {
        results?.forEach((result) => {
          queryClient.setQueryData(['SelectedGroup', deploymentId, result.id], {
            data: result,
          });
        });
      },
      refetchOnWindowFocus: false,
      enabled: !!deploymentId,
      ...options,
    }
  );
};

export const useListOrgGroups = (deploymentIds?: string[], options?: {}) => {
  const queryFn = async (deploymentId: string) => {
    if (!deploymentId) {
      return Promise.reject({
        errors: [{ details: 'No Valid Deployment ID Defined', title: 'Bad Request', status: 400 }],
      } as ResponseGroup);
    }

    try {
      const result = await apiGetGroups(deploymentId);
      return result;
    } catch (e) {
      return Promise.reject({
        data: { deploymentId },
        error: e,
      });
    }
  };

  const queries = deploymentIds.map((deploymentId) => {
    return {
      queryKey: ['DeploymentGroups', deploymentId],
      queryFn: () => queryFn(deploymentId),
      retry: false,
      onError: (error: any) => {
        console.error('error:', error);
      },
      enabled: !!deploymentId,
      ...options,
    };
  });
  return useQueries(queries);
};

export const useListUserGroups = (options?: {}) => {
  return useStrictQuery<ResponseGroups, WaevErrors, Group[] | [] | undefined>(
    ['Groups'],
    // @ts-ignore
    () => {
      return apiGetUserGroups();
    },
    {
      select: useCallback((result) => {
        (result?.included || []).forEach((include: any) => {
          // if (include.type === 'permissions') {
          //   const index = result.data.findIndex(
          //     (group: Group) => group.id === include.attributes.group_id
          //   );
          //   if (index > -1) {
          //     if (result.data[index]?.fullPermissions) {
          //       result.data[index].fullPermissions.findIndex(
          //         (perm: GroupPermissions) => perm.id === include.id
          //       ) === -1 && result.data[index].fullPermissions.push(include);
          //     } else {
          //       result.data[index].fullPermissions = [include];
          //     }
          //   }
          // }
          if (include.type === 'flags') {
            const index = result.data.findIndex(
              (group: Group) => group.id === include.attributes.group_id
            );
            if (index > -1) {
              if (result.data[index]?.fullOptInFlags) {
                result.data[index].fullOptInFlags.findIndex(
                  (flag: OptInFlag) => flag.id === include.id
                ) === -1 && result.data[index].fullOptInFlags.push(include);
              } else {
                result.data[index].fullOptInFlags = [include];
              }
            }
          }
        });
        return result.data;
      }, []),
      onError: (error) => {
        console.error('useListUserGroups Error', error);
      },

      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useGetGroup = (
  groupIdOverride?: string,
  deploymentIdOverride?: string,
  isRefetch?: boolean,

  options?: {}
) => {
  const { selectedGroup } = useContext(SelectedEntityContext);
  const groupId = groupIdOverride || selectedGroup?.id;
  const deploymentId = deploymentIdOverride;
  const queryClient = useQueryClient();

  return useStrictQuery<ResponseGroup, WaevErrors, Group | undefined>(
    ['SelectedGroup', deploymentId, groupId],
    // @ts-ignore
    () => {
      if (!groupId || !deploymentId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid Group ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseGroup);
      }
      if (isRefetch) {
        return apiGetGroupById(deploymentId, groupId);
      }
      const query = queryClient.getQueryData<ResponseGroup>([
        'SelectedGroup',
        deploymentId,
        groupId,
      ]);

      if (query?.data?.id) {
        return Promise.resolve({ data: query.data });
      }
      return Promise.resolve({});
    },
    {
      retry: false,
      select: (result) => {
        return result.data;
      },
      refetchOnWindowFocus: false,
      enabled: !!groupId && !!deploymentId,
      onError: (error) => {
        console.error('useGetGroup Error', error);
      },
      onSuccess: (result) => {
        // console.info('---- useGetGroup result:', result);
      },
      ...options,
    }
  );
};

export const useCreateGroup = (
  deploymentId: string,
  organizationId: string,
  name: string,
  partsList: PartsType[],
  flagIds: string[],
  options?: {}
) => {
  const { setGroupNameInput } = useContext(GroupContext);
  const { refetch: getGroups } = useListGroups(deploymentId);
  const { refetch: getDeployments } = useListDeployments(organizationId);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { setIsBlockingLoader } = useContext(ApiLoaderContext);

  const queryClient = useQueryClient();

  return useMutation<ResponseGroup, WaevErrors>(
    // @ts-ignore
    async () => {
      if (!name || !deploymentId) {
        return Promise.reject({
          errors: [{ details: 'No Name/Org Defined', title: 'Bad Request', status: 400 }],
        } as ResponseGroup);
      }
      if (name === 'Error') {
        return Promise.reject({
          errors: [
            { details: 'No Name of Group Defined', title: 'Bad Request for name', status: 400 },
          ],
        } as ResponseGroup);
      }
      setIsBlockingLoader(true);

      const payload: GroupSubmitPayload = {
        data: {
          type: 'groups',
          attributes: {
            name,
            deployment_id: deploymentId,
            flags: flagIds,
            parts: partsList, // anon, pii, meta
          },
        },
      };

      return apiCreateGroup(payload, deploymentId);
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['Groups', deploymentId]);
      },
      onSuccess: (result) => {
        setSuccessNotification({
          title: 'Success',
          message: 'Successfully Queued to Create',
        });
        if (result?.data?.id) {
          // Manually adds the result to the list of DeploymentGroups
          queryClient.setQueryData(['Groups', deploymentId], (old: ResponseGroups) => {
            const group = {
              id: result.data.id,
              type: 'groups',
              attributes: {
                name: name,
                config: { parts: partsList },
              },
            } as Group;
            old.data.push(group);
            return old;
          });
          getGroups();
          getDeployments();
        }
      },
      onSettled: () => {
        setGroupNameInput(undefined);
        setIsBlockingLoader(false);
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create Group Error',
          message: error?.errors[0].title || 'Could not create group.',
        });
      },
      ...options,
    }
  );
};

export const useDeleteGroup = (
  groupId?: string,
  deploymentId?: string,
  onCleanup?: (test: boolean) => void,
  options?: {}
) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { refetch: getGroups } = useListGroups(deploymentId);
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!groupId) {
        return Promise.reject();
      }
      return apiDeleteGroup(deploymentId, groupId);
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['Groups', deploymentId]);
        await queryClient.cancelQueries(['Group', groupId]);

        // Preserves old data in case of rollback
        const previousSnapshot: ResponseGroup = queryClient.getQueryData([
          'SelectedGroup',
          deploymentId,
          groupId,
        ]);
        const prevClone = deepCopy(previousSnapshot);

        // Optimistically deletes the Deployment
        queryClient.setQueryData(['Groups', deploymentId], (old: ResponseGroups) => {
          const updated = old.data.filter((group: Group) => group.id !== groupId);
          return { ...old, data: updated };
        });
        onCleanup(true);
        return prevClone;
      },
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Group Deleted',
          });
          getGroups();
        }
      },
      onError: (_error, _i, context: ResponseGroup) => {
        setErrorNotification({
          title: 'Delete Group Error',
          message: 'Could not delete group.',
        });

        // Rolls back the changes in the Group.
        queryClient.setQueryData(['SelectedGroup', deploymentId, groupId], () => context);

        // Rolls back the delete in the Groups record
        queryClient.setQueryData(['Groups', deploymentId], (old: ResponseGroups) => {
          old.data.push(context.data);
          return old;
        });
        getGroups();
      },
      ...options,
    }
  );
};
