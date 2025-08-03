import { useContext, useMutation, useStrictQuery } from 'hooks';
import { UserSubmitPayload, ResponseUser, WaevErrors, CurrentUser } from 'types';
import { apiCreateUser, apiUpdateUser, apiGetCurrentUser } from 'network';
import { NotificationContext } from 'contexts';

export const useCreateUser = (
  email: string,
  first_name: string,
  // last_name: string,
  options?: {}
) => {
  // const queryClient = useQueryClient();
  return useMutation<ResponseUser, WaevErrors>(
    async () => {
      if (!email || !first_name) {
        return Promise.resolve({
          errors: [{ details: 'Content Not Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUser);
      }
      const payload: UserSubmitPayload = {
        data: {
          type: 'users',
          attributes: {
            email,
            first_name,
            // last_name,
          },
        },
      };
      return apiCreateUser(payload);
    },
    {
      // onMutate: () => {
      //   // Optimistically adds user
      //   queryClient.setQueryData(['Users'], (old: ResponseUsers) => {
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
      // onSuccess: (result) => {
      //   // setSelectedUserId && setSelectedUserId(result.data.id);
      //   // setLocalStoreObject(
      //   //   `@selectedUser`,
      //   //   result.user
      //   // );
      //   getUsers();
      // },
      ...options,
    }
  );
};

export const useUpdateUser = (
  userId: string,
  first_name: string,
  last_name: string,
  options?: {}
) => {
  const { refetch: getMe } = useGetCurrentUser(userId);
  const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);

  return useMutation<ResponseUser, WaevErrors>(
    async () => {
      if (!first_name || !userId) {
        return Promise.resolve({
          errors: [{ details: 'Content Not Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUser);
      }
      const payload: UserSubmitPayload = {
        data: {
          type: 'users',
          attributes: {
            first_name,
            last_name,
          },
        },
      };
      return apiUpdateUser(payload);
    },
    {
      onSuccess: () => {
        getMe();
        setSuccessNotification({
          title: 'Success',
          message: 'Name Updated',
        });
      },
      onError: (error) => {
        setErrorNotification({
          title: 'Update Name Error',
          message: error?.errors[0].title || 'Could not update name.',
        });
      },
      ...options,
    }
  );
};

export const useGetCurrentUser = (userId?: string, options?: {}) => {
  return useStrictQuery<ResponseUser, WaevErrors, CurrentUser>(
    ['CurrentUser'],
    () => {
      if (!userId) {
        return Promise.resolve({
          errors: [{ details: 'Current User Not Logged In', title: 'Bad Request', status: 400 }],
        } as ResponseUser);
      }
      return apiGetCurrentUser();
    },
    {
      select: (result) => result?.data,
      ...options,
    }
  );
};
