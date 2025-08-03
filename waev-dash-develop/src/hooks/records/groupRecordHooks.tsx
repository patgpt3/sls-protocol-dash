import { useContext, useQueries, useStrictQuery } from 'hooks';
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
  apiGetGroupRecords,
  apiGetGroupRecordById,
  apiGetGroupRecordsByUUID,
  apiGetGroupUserDetails,
} from 'network';
import { NotificationContext } from 'contexts';

export const useListSlimGroupRecords = (groupId?: string, isEnabled?: boolean, options?: {}) => {
  return useStrictQuery<ResponseSlimRecords, Error, SlimRecord[] | [] | undefined>(
    [`SlimGroupRecords`, isEnabled && groupId],
    () => {
      if (!groupId || !isEnabled) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseSlimRecords);
      }
      return apiGetGroupRecords(groupId);
    },
    {
      select: (result) => {
        return result?.data;
      },
      onError: (error) => {
        console.error('useListSlimGroupRecords Error', error);
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useListSlimGroupUserRecords = (
  groupId?: string,
  uuid?: string,
  isEnabled?: boolean,
  options?: {}
) => {
  return useStrictQuery<ResponseSlimRecords, Error, SlimRecord[] | [] | undefined>(
    [`SlimGroupRecords`, groupId, isEnabled && uuid],
    () => {
      if (!groupId || !uuid || uuid === '' || !isEnabled) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID/UUID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseSlimRecords);
      }
      return apiGetGroupRecordsByUUID(groupId, uuid);
    },
    {
      select: (result) => result.data,
      onError: (error) => {
        console.error('useListSlimGroupUserRecords Error', error);
      },
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useGetFullGroupRecord = (
  groupId?: string,
  storeId?: string,
  isEnabled?: boolean,
  options?: {}
) => {
  return useStrictQuery<ResponseFullRecord, WaevErrors, FullRecord | undefined>(
    [`FullGroupRecord`, groupId, isEnabled && storeId],
    () => {
      if (!groupId || !storeId || !isEnabled) {
        return Promise.resolve({
          errors: [
            { details: 'No Deployment ID/Record ID Defined', title: 'Bad Request', status: 400 },
          ],
        } as ResponseFullRecord);
      }

      return apiGetGroupRecordById(groupId, storeId);
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

export const useGetFullGroupUserDetails = (
  groupId?: string,
  user?: string,
  isEnabled?: boolean,
  options?: {}
) => {
  const { setErrorNotification } = useContext(NotificationContext);

  return useStrictQuery<ResponseUserDetails, WaevErrors, UserDetails | undefined>(
    [`GroupUserDetails`, groupId, isEnabled && user],
    () => {
      if (!groupId || !user || !isEnabled) {
        return Promise.resolve({
          errors: [{ details: 'No Deployment ID/User Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUserDetails);
      }

      return apiGetGroupUserDetails(groupId, user);
    },
    {
      retry: false,
      select: (result) => result.data,
      refetchOnWindowFocus: false,
      enabled: !!user && !!groupId,
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

export const useListFullGroupRecords = (
  groupId?: string,
  storeIds?: string[],
  isEnabled?: boolean,
  options?: {}
) => {
  const queryFn = async (storeId: string) => {
    if (!groupId || !storeId || !isEnabled) {
      return Promise.resolve({
        errors: [
          { details: 'No Deployment ID/Record ID Defined', title: 'Bad Request', status: 400 },
        ],
      } as ResponseFullRecords);
    }
    try {
      const result = await apiGetGroupRecordById(groupId, storeId);
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
      queryKey: [`FullGroupRecord`, groupId, isEnabled && storeId],
      queryFn: () => queryFn(storeId),
      retry: false,
      onError: (error: any) => {
        console.error('error:', error);
      },
      enabled: !!storeId && !!groupId,
      ...options,
    };
  });
  return useQueries(queries);
};
