import { NotificationContext } from 'contexts';
import { useCallback, useContext, useMutation, useQueryClient, useStrictQuery } from 'hooks';
import {
  ApiResponse,
  Access,
  AccessPayload,
  ResponseAccess,
  ResponseAccesses,
  WaevErrors,
} from 'types';
import {
  apiCreateAccess,
  apiDeleteAccess,
  apiGetAccessById,
  apiListAccesses,
  apiUpdateAccess,
} from 'network';

export const useListAccesses = (deploymentId?: string, options?: {}) => {
  const { setErrorNotification } = useContext(NotificationContext);

  return useStrictQuery<ResponseAccesses, WaevErrors, Access[] | [] | undefined>(
    ['Accesses'],
    () => {
      if (!deploymentId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseAccess);
      }

      return apiListAccesses(deploymentId);
    },
    {
      select: useCallback((result) => {
        if (result.data?.length && result?.included?.length) {
          result.data[0].attributes.permissions = result.included[0].attributes.permissions;
        }
        return result.data;
      }, []),
      onError: (error) => {
        console.error('getAccess Error', error);
        setErrorNotification({
          title: 'Deployments Error',
          message: 'Deployments/Accesses Unable to Load.',
        });
      },
      refetchOnWindowFocus: false,
      // enabled: !!tokenOverride,
      ...options,
    }
  );
};

export const useGetAccess = (accessId?: string, deploymentId?: string, options?: {}) => {
  return useStrictQuery<ResponseAccess, WaevErrors, Access | undefined>(
    ['SelectedAccess'],
    () => {
      if (!accessId || !deploymentId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid Access ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseAccess);
      }

      return apiGetAccessById(accessId, deploymentId);
    },
    {
      retry: false,
      // select: (data) => data.access,
      refetchOnWindowFocus: false,
      enabled: !!accessId,
      onError: (error) => {
        console.error('useGetAccess Error', error);
      },
      ...options,
    }
  );
};
export const useUpdateAccess = (
  accessId?: string,
  deploymentId?: string,
  descriptionInput?: string,
  options?: {}
) => {
  const { refetch: getAccesses } = useListAccesses(deploymentId);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);


  return useMutation<ResponseAccess, WaevErrors>(
    ['SelectedAccess'],
    async () => {
      if (!accessId || !deploymentId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid Access ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseAccess);
      }
      const payload: AccessPayload = {
        data: {
          type: 'accesses',
          attributes: {
            description: descriptionInput,
          },
        },
      };
      return apiUpdateAccess(accessId, deploymentId, payload).then((result) => {
        return result;
      });
    },
    {
      retry: false,
      onError: (error) => {
        setErrorNotification({
          title: 'Update Access Error',
          message: error?.errors[0].title || 'Access could not be updated',
        });
      },
      onSuccess: () => {
        setSuccessNotification({
          title: 'Success',
          message: 'Access Updated',
        });
        getAccesses();
      },
      ...options,
    }
  );
};

export const useCreateAccess = (deploymentId?: string, descriptionInput?: string, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { refetch: getAccesses } = useListAccesses(deploymentId);
  return useMutation<ResponseAccess, WaevErrors>(
    async () => {
      if (!deploymentId) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID', title: 'Bad Request', status: 400 }],
        } as ResponseAccess);
      }
      const payload: AccessPayload = {
        data: {
          type: 'accesses',
          attributes: {
            description: descriptionInput,
          },
        },
      };
      return apiCreateAccess(deploymentId, payload);
    },
    {
      onSuccess: () => {
        setSuccessNotification({
          title: 'Success',
          message: 'Access Created',
        });
        getAccesses();
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create Access Error',
          message: error?.errors[0].title || 'Access could not be created',
        });
      },
      ...options,
    }
  );
};

export const useDeleteAccess = (accessId?: string, deploymentId?: string, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { refetch: getAccesses } = useListAccesses(deploymentId);
  const queryClient = useQueryClient();
  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!accessId || !deploymentId) {
        return Promise.reject();
      }
      return apiDeleteAccess(accessId, deploymentId).then((result) => {
        return result;
      });
    },
    {
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Access Deleted',
          });
          // Remove React Query Cache
          queryClient.removeQueries(['SelectedAccess', accessId]);
          getAccesses();
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Delete Access Error',
          message: error?.errors[0].title || 'Access could not be deleted',
        });
      },
      ...options,
    }
  );
};
