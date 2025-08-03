import { NotificationContext, ApiLoaderContext } from 'contexts';
import { useContext, useMutation, useQueryClient, useStrictQuery } from 'hooks';
import {
  ApiResponse,
  Union,
  UnionCreatePayload,
  UnionUpdatePayload,
  ResponseUnion,
  ResponseUnions,
  WaevErrors,
  UnionDeploymentCreatePayload,
  ResponseDeploymentUnions,
  DeploymentUnion,
  ResponseUnionRecords,
  ResponseUnionRecordsData,
} from 'types';
import {
  apiCreateUnion,
  apiDeleteUnion,
  apiGetUnionById,
  apiListUnions,
  apiUpdateUnion,
  apiListPublicUnions,
  apiListDeploymentUnions,
  apiCreateUnionDeployment,
  apiDeleteUnionDeployment,
  apiGetUnionUserDetails,
} from 'network';

export const useListUnions = (organizationId?: string, options?: {}) => {
  const { setErrorNotification } = useContext(NotificationContext);
  return useStrictQuery<ResponseUnions, WaevErrors, ResponseUnions | undefined>(
    ['Unions'],
    () => {
      if (!organizationId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUnion);
      }

      return apiListUnions(organizationId);
    },
    {
      select: (result) => result,
      onError: (error) => {
        console.error('getUnion Error', error);
        setErrorNotification({
          title: 'Unions Error',
          message: 'Unions Unable to Load.',
        });
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useListDeploymentUnions = (deploymentId?: string, options?: {}) => {
  const { setErrorNotification } = useContext(NotificationContext);
  return useStrictQuery<ResponseDeploymentUnions, WaevErrors, DeploymentUnion[] | undefined>(
    ['DeploymentUnions'],
    () => {
      if (!deploymentId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseDeploymentUnions);
      }

      return apiListDeploymentUnions(deploymentId);
    },
    {
      select: (result) => result.data,
      onError: (error) => {
        console.error('getUnion Error', error);
        setErrorNotification({
          title: 'Unions Error',
          message: 'Unions Unable to Load.',
        });
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useListPublicUnions = (organizationId?: string, options?: {}) => {
  const { setErrorNotification } = useContext(NotificationContext);
  return useStrictQuery<ResponseUnions, WaevErrors, ResponseUnions | undefined>(
    ['PublicUnions'],
    () => {
      if (!organizationId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUnion);
      }
      return apiListPublicUnions(organizationId);
    },
    {
      select: (result) => result,
      onError: (error) => {
        console.error('getUnion Error', error);
        setErrorNotification({
          title: 'Data Unions Error',
          message: 'Data Unions unable to load.',
        });
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useGetUnion = (unionId?: string, organizationId?: string, options?: {}) => {
  return useStrictQuery<ResponseUnion, WaevErrors, Union | undefined>(
    ['SelectedUnion'],
    () => {
      if (!unionId || !organizationId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid Union ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUnion);
      }

      return apiGetUnionById(unionId, organizationId);
    },
    {
      retry: false,
      select: (result) => result.data,
      refetchOnWindowFocus: false,
      enabled: !!unionId,
      onError: (error) => {
        console.error('useGetUnion Error', error);
      },
      ...options,
    }
  );
};

export const useUpdateUnion = (
  unionId?: string,
  organizationId?: string,
  name?: string,
  options?: {}
) => {
  const { refetch: getUnions } = useListUnions(organizationId);

  return useMutation<ResponseUnion, WaevErrors>(
    ['SelectedUnion'],
    async () => {
      if (!unionId || !organizationId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid Union ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUnion);
      }
      const payload: UnionUpdatePayload = {
        data: {
          type: 'unions',
          attributes: {
            name,
          },
        },
      };
      return apiUpdateUnion(unionId, organizationId, payload).then((result) => {
        return result;
      });
    },
    {
      retry: false,
      onError: (error) => {
        console.error('useUpdateUnion Error', error);
      },
      onSuccess: () => {
        getUnions();
      },
      ...options,
    }
  );
};

export const useCreateUnion = (organizationId?: string, name?: string, options?: {}) => {
  const { setIsBlockingLoader } = useContext(ApiLoaderContext);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { refetch: getUnions } = useListUnions(organizationId);
  return useMutation<ResponseUnion, WaevErrors>(
    async () => {
      if (!organizationId || !name) {
        return Promise.reject({
          error: {
            message: 'No Name or Org ID Defined',
            title: 'Bad Request',
            status: 400,
          },
        } as ResponseUnion);
      }
      setIsBlockingLoader(true);

      const payload: UnionCreatePayload = {
        data: {
          type: 'unions',
          attributes: {
            name,
          },
        },
      };
      return apiCreateUnion(organizationId, payload);
    },
    {
      onSuccess: (result) => {
        setSuccessNotification({
          title: 'Success',
          message: 'Data Union Created',
        });
        getUnions();
      },
      onSettled: () => {
        setIsBlockingLoader(false);
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create Data Union Error',
          message: error?.message || 'Could not create the data union.',
        });
      },
      ...options,
    }
  );
};

export const useDeleteUnion = (unionId?: string, organizationId?: string, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { refetch: getUnions } = useListUnions(organizationId);
  const queryClient = useQueryClient();
  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!unionId || !organizationId) {
        return Promise.reject();
      }
      return apiDeleteUnion(unionId, organizationId).then((result) => {
        return result;
      });
    },
    {
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Data Union Deleted',
          });
          // Remove React Query Cache
          queryClient.removeQueries(['SelectedUnion', unionId]);
          getUnions();
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Delete Data Union Error',
          message: error?.errors[0].title || 'Data Union could not be deleted',
        });
      },
      ...options,
    }
  );
};

export const useCreateUnionDeployment = (
  unionId: string,
  deploymentId: string,
  partsList: string[],
  flagIds: string[],
  options?: {}
) => {
  const { refetch: getDeploymentUnions } = useListDeploymentUnions(deploymentId);
  const { setIsBlockingLoader } = useContext(ApiLoaderContext);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);

  return useMutation<ResponseUnion, WaevErrors>(
    // @ts-ignore
    async () => {
      if (!unionId || !deploymentId) {
        return Promise.reject({
          errors: [
            { details: 'No Data Union/Deployment Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseUnion);
      }
      setIsBlockingLoader(true);

      const payload: UnionDeploymentCreatePayload = {
        data: {
          type: 'union_deployments',
          attributes: {
            union_id: unionId,
            deployment_id: deploymentId,
            flags: flagIds,
            parts: partsList,
          },
        },
      };

      return apiCreateUnionDeployment(unionId, payload);
    },
    {
      onSuccess: (result) => {
        setSuccessNotification({
          title: 'Success',
          message: 'Successfully Queued to Create',
        });
        if (result?.data?.id) {
          getDeploymentUnions();
        }
      },
      onSettled: () => {
        setIsBlockingLoader(false);
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create Data Union Deployment Error',
          message: error?.errors[0].title || 'Could not create the data union deployment.',
        });
      },
      ...options,
    }
  );
};

export const useDeleteUnionDeployment = (
  unionId: string,
  unionDeploymentId: string,
  deploymentId: string,
  options?: {}
) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  const { refetch: getDeploymentUnions } = useListDeploymentUnions(deploymentId);
  return useMutation<ApiResponse, WaevErrors>(
    async () => {
      if (!unionId || !unionDeploymentId) {
        return Promise.reject();
      }
      return apiDeleteUnionDeployment(unionId, unionDeploymentId).then((result) => {
        return result;
      });
    },
    {
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'Deployment Data Union Deleted',
          });
          getDeploymentUnions();
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Delete Deployment Data Union Error',
          message: error?.errors[0].title || 'Deployment Data Union could not be deleted',
        });
      },
      ...options,
    }
  );
};

export const useGetUnionUserDetails = (unionId?: string, userIdentifier?: string, options?: {}) => {
  const { setErrorNotification } = useContext(NotificationContext);
  return useStrictQuery<ResponseUnionRecords, WaevErrors, ResponseUnionRecordsData | undefined>(
    [`UnionUserDetails`, unionId, userIdentifier],
    () => {
      if (!unionId || !userIdentifier) {
        return Promise.resolve({
          errors: [{ details: 'No Data Union ID/User Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUnionRecords);
      }
      return apiGetUnionUserDetails(unionId, userIdentifier);
    },
    {
      retry: false,
      select: (result) => result.data,
      refetchOnWindowFocus: false,
      enabled: !!unionId && !!userIdentifier,
      onError: (error) => {
        console.error('getUnionRecords Error', error);
        setErrorNotification({
          title: 'Data Union Records Error',
          message: 'Data Union records unable to load.',
        });
      },
      ...options,
    }
  );
};
