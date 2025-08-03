import { OptInFlagContext, NotificationContext } from 'contexts';
import {
  useContext,
  useMutation,
  useListOrganizations,
  useStrictQuery,
  useQueryClient,
} from 'hooks';
import {
  ApiResponse,
  OptInFlag,
  OptInFlagPayload,
  ResponseOptInFlag,
  ResponseOptInFlags,
  WaevErrors,
  RootStateType,
  WaevError,
} from 'types';
import {
  apiCreateOptInFlag,
  apiDeleteOptInFlag,
  apiGetOptInFlagById,
  apiGetOptInFlags,
  apiUpdateOptInFlag,
} from 'network';
import { useSelector } from 'react-redux';

export const useListOptInFlags = (deploymentId?: string, options?: {}) => {
  return useStrictQuery<ResponseOptInFlags, WaevErrors, OptInFlag[] | [] | undefined>(
    ['OptInFlags', deploymentId],
    // @ts-ignore
    () => {
      if (!deploymentId) {
        return Promise.resolve({
          errors: [
            { details: 'No Valid Organization ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseOptInFlag);
      }
      return apiGetOptInFlags(deploymentId);
    },
    {
      select: (result) => result.data,
      onError: (error) => {
        console.error('getOptInFlags Error', error);
      },
      retry: 3,
      refetchOnWindowFocus: false,
      enabled: !!deploymentId,
      ...options,
    }
  );
};

export const useGetOptInFlag = (
  deploymentIdOverride?: string,
  flagIdOverride?: string,
  options?: {}
) => {
  const flagId = flagIdOverride;
  const deploymentId = deploymentIdOverride;
  // const cache = useStrictQueryClient();
  return useStrictQuery<ResponseOptInFlag, WaevErrors, OptInFlag | undefined>(
    ['SelectedOptInFlag', deploymentId, flagIdOverride],
    // @ts-ignore
    () => {
      if (!flagId || !deploymentId) {
        return Promise.resolve({
          errors: [
            { details: 'No Valid Opt-In Flag ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseOptInFlag);
      }
      return apiGetOptInFlagById(deploymentId, flagId);
    },
    {
      // initialData: isSampleMode
      //   ? mockEntity?.selectedOptInFlag
      //   : cache
      //       .getQueryData<OptInFlag[]>(['OptInFlags', deploymentId])
      //       ?.find((d) => d.id === flagId),
      retry: false,
      select: (result) => result.data,
      refetchOnWindowFocus: false,
      // enabled: !!flagId,
      onError: (error) => {
        console.error('useGetOptInFlag Error', error);
      },
      onSuccess: (result) => {
        // console.info('---- useGetOptInFlag result:', result);
      },
      ...options,
    }
  );
};

export const useCreateOptInFlag = (
  deploymentId: string,
  name: string,
  field_selector: string,
  comparator: string,
  isActive: boolean,
  options?: {}
) => {
  const { refetch: getOptInFlags } = useListOptInFlags(deploymentId);
  // const { refetch: getOrganizations } = useListOrganizations();
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  return useMutation<ResponseOptInFlag, WaevError>(
    // @ts-ignore
    async () => {
      if (!name || !deploymentId) {
        return Promise.reject({
          error: { details: 'No Name/Dep Defined', title: 'Bad Request', status: 400 },
        } as ResponseOptInFlag);
      }
      if (comparator === '') {
        return Promise.reject({
          error: { details: 'No Comparator Defined', title: 'Bad Request for name', status: 400 },
        } as ResponseOptInFlag);
      }
      const payload: OptInFlagPayload = {
        data: {
          type: 'flags',
          attributes: {
            deployment_id: deploymentId,
            name,
            field_selector,
            comparator,
            active: isActive,
          },
        },
      };

      return apiCreateOptInFlag(payload, deploymentId);
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['OptInFlags', deploymentId]);

        // Optimistically deletes the OptInFlag
        queryClient.setQueryData(['OptInFlags', deploymentId], (old: ResponseOptInFlags) => {
          const dep = {
            id: undefined,
            type: 'flags',
            attributes: {
              name,
              field_selector,
              comparator,
              deployment_id: deploymentId,
            },
          } as OptInFlag;
          old.data.push(dep);
          return old;
        });
      },
      onSuccess: () => {
        setSuccessNotification({
          title: 'Success',
          message: 'Opt-In Flag Created',
        });
        getOptInFlags();
      },
      onError: (error) => {
        setErrorNotification({
          title: error?.name,
          message: error?.message,
        });
        getOptInFlags();
      },
      ...options,
    }
  );
};

export const useUpdateOptInFlag = (optInFlag?: OptInFlag, deploymentId?: string, options?: {}) => {
  const { setUpdatingOptInFlag } = useContext(OptInFlagContext);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);

  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const { refetch: getOptInFlags } = useListOptInFlags(deploymentId);
  const queryClient = useQueryClient();

  return useMutation<ResponseOptInFlag, WaevErrors>(
    // @ts-ignore
    async () => {
      if (!optInFlag) {
        return Promise.reject();
      }
      const payload: OptInFlagPayload = {
        data: {
          type: 'flags',
          id: optInFlag.id,
          attributes: {
            deployment_id: deploymentId,
            name: optInFlag.attributes.name,
            field_selector: optInFlag.attributes.field_selector,
            comparator: optInFlag.attributes.comparator,
            active: optInFlag.attributes.active,
          },
        },
      };

      return apiUpdateOptInFlag(deploymentId, optInFlag.id, payload);
    },
    {
      onMutate: () => {
        // Optimistically updates the name of the Organization
        queryClient.setQueryData(['OptInFlags', deploymentId], (old: ResponseOptInFlags) => {
          const objIndex =
            old?.data && old.data.findIndex((dep: OptInFlag) => dep.id === optInFlag?.id);
          if (old && old.data[objIndex].attributes) {
            old.data[objIndex].attributes.deployment_id = optInFlag.attributes.deployment_id;
            old.data[objIndex].attributes.name = optInFlag.attributes.name;
            old.data[objIndex].attributes.field_selector = optInFlag.attributes.field_selector;
            old.data[objIndex].attributes.comparator = optInFlag.attributes.comparator;
          }
          return old;
        });
      },
      onSettled: () => {
        getOrganizations();
        getOptInFlags();
        setUpdatingOptInFlag(undefined);
      },
      onSuccess: (result) => {
        if (result) {
          getOptInFlags();
          setSuccessNotification({
            title: 'Success',
            message: 'Opt-In Flag Updated',
          });
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Update Opt-In Flag Error',
          message: error?.errors[0].title || 'Could not update Opt-In Flag.',
        });
      },
      ...options,
    }
  );
};

export const useDeleteOptInFlag = (flagId?: string, deploymentId?: string, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { cleanup } = useContext(OptInFlagContext);
  const { refetch: getOptInFlags } = useListOptInFlags(deploymentId);
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!flagId) {
        return Promise.reject();
      }
      return apiDeleteOptInFlag(deploymentId, flagId);
    },
    {
      onMutate: async () => {
        // Cancels all currently running queries
        await queryClient.cancelQueries(['OptInFlags', deploymentId]);
        await queryClient.cancelQueries(['OptInFlag', flagId]);

        // Optimistically deletes the Organization
        queryClient.setQueryData(['OptInFlags', deploymentId], (old: ResponseOptInFlags) => {
          const updated = old.data.filter((dep: OptInFlag) => dep.id !== flagId);
          return { ...old, data: updated };
        });
      },
      // onMutate: () => {
      //   // Optimistically deletes the OptInFlag
      //   queryClient.setQueryData(['OptInFlags'], (old: ResponseOptInFlags) => {
      //     const updated = old.data.filter((org) => org.id !== flagId);
      //     return { ...old, ...{ data: updated } };
      //   });
      // },
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Opt-In Flag Deleted',
          });
          // Remove React Query Cache
          // queryClient.removeQueries([`SelectedOptInFlag`, flagId]);
          // setLocalStoreObject(`@selectedOptInFlagFor-businessId-locationId`, null);
          // setSelectedOptInFlag && setSelectedOptInFlag(null);
          getOptInFlags();
          cleanup();
          // getUserOptInFlags();
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Delete Opt-In Flag Error',
          message: error?.errors[0].title || 'Could not delete Opt-In Flag.',
        });
      },
      ...options,
    }
  );
};

export const useUpdateOptInFlags = (
  optInFlags: OptInFlag[],
  deploymentId?: string,
  options?: {}
) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const currentUser = useSelector((state: RootStateType) => state.user.userData);
  const token = useSelector((state: RootStateType) => state.user.token);

  const { refetch: getOrganizations } = useListOrganizations(currentUser, token);
  const { refetch: getOptInFlags } = useListOptInFlags(deploymentId);

  return useMutation<ResponseOptInFlag, WaevErrors>(
    // @ts-ignore
    async () => {
      if (optInFlags.length === 0) {
        return Promise.reject();
      }

      const updateOptInFlagsCall = await Promise.allSettled(
        optInFlags.map(async (flag) => {
          try {
            const payload: OptInFlagPayload = {
              data: {
                type: 'flags',
                id: flag.id,
                attributes: {
                  deployment_id: deploymentId,
                  name: flag.attributes.name,
                  field_selector: flag.attributes.field_selector,
                  comparator: flag.attributes.comparator,
                  active: flag.attributes.active,
                },
              },
            };
            await apiUpdateOptInFlag(deploymentId, flag.id, payload);
          } catch (err) {
            console.error('Error: ', err);
          }
        })
      );
      return await updateOptInFlagsCall;
    },
    {
      onSettled: () => {
        getOrganizations();
        getOptInFlags();
      },
      onSuccess: (result) => {
        if (result) {
          getOptInFlags();
          setSuccessNotification({
            title: 'Success',
            message: 'Opt-In Flags Updated',
          });
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Update Opt-In Flags Error',
          message: 'One or more of your changes to your opt-in flags failed.',
        });
      },
      ...options,
    }
  );
};
