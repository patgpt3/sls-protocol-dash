import { useContext, useQueries, useStrictQuery, useMutation } from 'hooks';
import {
  ResponseFullRecords,
  ResponseFullRecord,
  FullRecord,
  WaevErrors,
  ResponseUserDetails,
  UserDetails,
  SlimRecord,
  ResponseSlimRecords,
} from 'types';
import {
  apiGetRecords,
  apiGetRecordById,
  apiGetRecordsByUUID,
  apiGetUserDetails,
  apiCreateRecord,
  apiUploadRecordsCSV,
} from 'network';
import { NotificationContext } from 'contexts';
import { useDispatch } from 'react-redux';
import { setAddSingleData } from 'store';

export const useListSlimDeploymentRecords = (
  deploymentId?: string,
  isEnabled?: boolean,
  options?: {}
) => {
  return useStrictQuery<ResponseSlimRecords, Error, SlimRecord[] | [] | undefined>(
    [`SlimDeploymentRecords`, isEnabled && deploymentId],
    () => {
      if (!deploymentId || !isEnabled) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseSlimRecords);
      }
      return apiGetRecords(deploymentId);
    },
    {
      select: (result) => result.data,
      onError: (error) => {
        console.error('useListSlimDeploymentRecords Error', error);
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useListSlimDeploymentUserRecords = (
  deploymentId?: string,
  uuid?: string,
  isEnabled?: boolean,
  options?: {}
) => {
  return useStrictQuery<ResponseSlimRecords, Error, SlimRecord[] | [] | undefined>(
    [`SlimDeploymentRecords`, deploymentId, isEnabled && uuid],
    () => {
      if (!deploymentId || !uuid || uuid === '' || !isEnabled) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID/UUID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseSlimRecords);
      }
      return apiGetRecordsByUUID(deploymentId, uuid);
    },
    {
      select: (result) => result.data,
      onError: (error) => {
        console.error('useListSlimDeploymentUserRecords Error', error);
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useGetFullDeploymentRecord = (
  deploymentId?: string,
  storeId?: string,
  isEnabled?: boolean,
  options?: {}
) => {
  return useStrictQuery<ResponseFullRecord, WaevErrors, FullRecord | undefined>(
    [`FullDeploymentRecord`, deploymentId, isEnabled && storeId],
    () => {
      if (!deploymentId || !storeId || !isEnabled) {
        return Promise.resolve({
          errors: [
            { details: 'No Deployment ID/Record ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseFullRecord);
      }

      return apiGetRecordById(deploymentId, storeId);
    },
    {
      retry: false,
      select: (result) => result.data,
      refetchOnWindowFocus: false,
      enabled: !!storeId,
      onError: (error) => {
        console.error('useGetRecord Error', error);
      },
      ...options,
    }
  );
};

export const useGetFullDeploymentUserDetails = (
  deploymentId?: string,
  user?: string,
  isEnabled?: boolean,
  options?: {}
) => {
  const { setErrorNotification } = useContext(NotificationContext);

  return useStrictQuery<ResponseUserDetails, WaevErrors, UserDetails | undefined>(
    [`DeploymentUserDetails`, deploymentId, isEnabled && user],
    () => {
      if (!deploymentId || !user || !isEnabled) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID/User Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUserDetails);
      }

      return apiGetUserDetails(deploymentId, user);
    },
    {
      retry: false,
      select: (result) => result.data,
      refetchOnWindowFocus: false,
      enabled: !!user && !!deploymentId,
      onError: (error) => {
        console.error('useGetRecord Error', error);
        setErrorNotification({
          title: 'Create Organization Error',
          message: error?.errors[0].title || 'Could not create organization.',
        });
      },
      ...options,
    }
  );
};

export const useListFullDeploymentRecords = (
  deploymentId?: string,
  storeIds?: string[],
  isEnabled?: boolean,
  options?: {}
) => {
  const queryFn = async (storeId: string) => {
    if (!deploymentId || !storeId || !isEnabled) {
      return Promise.resolve({
        errors: [
          { details: 'No Deployment ID/Record ID Defined', title: 'Bad Request', status: 400 },
        ],
      } as ResponseFullRecords);
    }
    try {
      const result = await apiGetRecordById(deploymentId, storeId);
      return result;
    } catch (e) {
      return Promise.reject({
        data: { storeId },
        error: e,
      });
    }
  };

  const queries = storeIds.map((storeId) => {
    return {
      queryKey: [`FullDeploymentRecord`, deploymentId, isEnabled && storeId],
      queryFn: () => queryFn(storeId),
      retry: false,
      onError: (error: any) => {
        console.error('error:', error);
      },
      enabled: !!storeId && !!deploymentId,
      ...options,
    };
  });
  return useQueries(queries);
};

export const useCreateRecord = (deploymentId?: string, data?: any, options?: {}) => {
  const dispatch = useDispatch();
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  return useMutation<ResponseFullRecord, WaevErrors>(
    'Record',
    async () => {
      const payload: any = {
        data: {
          type: 'records',
          attributes: {
            data: data,
            meta: {
              url: 'https://app.waevdata.com',
            },
          },
        },
      };
      return apiCreateRecord(deploymentId, payload);
    },
    {
      onSuccess: (result) => {
        if (result) {
          dispatch(setAddSingleData(undefined));
          setSuccessNotification({
            title: 'Success',
            message: 'Record Created',
          });
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create Record Error',
          message: error?.message || 'Could not create the record.',
        });
      },
      ...options,
    }
  );
};

export const useCreateManyRecords = (deploymentId?: string, data?: any, options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  return useMutation<ResponseFullRecord, WaevErrors>(
    'Records',
    async () => {
      const payload: any = {
        data: data,
      };
      return apiCreateRecord(deploymentId, payload);
    },
    {
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'The records were successfully created.',
          });
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Create records from CSV error',
          message: error?.message || 'Could not create the imported records.',
        });
      },
      ...options,
    }
  );
};

export const useListDeploymentUserRecordsHistory = (
  deploymentId?: string,
  uuid?: string,
  options?: {}
) => {
  return useStrictQuery<ResponseSlimRecords, Error, SlimRecord[] | [] | undefined>(
    [`DeploymentUserRecordsHistory`, deploymentId, uuid],
    () => {
      if (!deploymentId || !uuid || uuid === undefined) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID/UUID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseSlimRecords);
      } else {
        return apiGetRecordsByUUID(deploymentId, uuid);
      }
    },
    {
      select: (result) => result.data,
      onError: (error) => {
        console.error('useListDeploymentUserRecordsHistory Error', error);
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useUploadRecordsCSV = (deploymentId?: string, files?: File[], options?: {}) => {
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
  return useMutation<ResponseFullRecord, WaevErrors>(
    'UploadRecords',
    async () => {
      return apiUploadRecordsCSV(deploymentId, files);
    },
    {
      onSuccess: (result) => {
        if (result) {
          setSuccessNotification({
            title: 'Success',
            message: 'The records creation process has started.',
          });
        }
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Upload CSV Error',
          message: error?.message || 'Error in uploading the CSV file.',
        });
      },
      ...options,
    }
  );
};
