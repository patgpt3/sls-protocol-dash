// @ts-ignore
import { useState } from 'react';
import { CurrentUserContext, NotificationContext } from 'contexts';
import { useContext, useMutation, useQueryClient, useNavigate, useStrictQuery } from 'hooks';
import { ResponseLogin, WaevErrors, ResponseUser } from 'types';
import {
  apiLogin,
  apiRegister,
  apiForgotPassword,
  apiGetCurrentUser,
  apiMagicLink,
  apiVerifyLink,
} from 'network';
import { useDispatch } from 'react-redux';
import { setUserData } from 'store';

export const useLogin = (email: string, totp?: string, otp?: string, options?: {}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setCurrentUser } = useContext(CurrentUserContext);

  return useMutation<ResponseLogin, WaevErrors>(
    'User',
    () => {
      if (!email || (!totp && !otp)) {
        return Promise.reject('No phone or totp provided for Login');
      }
      return apiLogin(email, totp, otp);
    },
    {
      onError: (e) => {
        console.info('Login Error', e);
        // setLocalStoreObject('@currentUser', null);
      },
      onSuccess: (result) => {
        const time = new Date().getTime().toString();
        window.localStorage.setItem('jwtStoreTime', time);
        sessionStorage.setItem('is-authenticated', 'true');
        navigate('../home', { replace: true });
        setCurrentUser(result.data);
        dispatch(setUserData(result.data));
      },
      ...options,
    }
  );
};

export const useRenewToken = (email: string, totp?: string, otp?: string, options?: {}) => {
  const dispatch = useDispatch();
  const { setCurrentUser } = useContext(CurrentUserContext);

  const onRenewSuccess = async (result: any) => {
    const time = new Date().getTime().toString();
    window.localStorage.setItem('jwtStoreTime', time);
    sessionStorage.setItem('is-authenticated', 'true');
    setCurrentUser(result.data);
    dispatch(setUserData(result.data));
  };

  return useMutation<ResponseLogin, WaevErrors>(
    'User',
    () => {
      if (!email || (!totp && !otp)) {
        return Promise.reject('No phone or totp provided for Token Renewal');
      }
      return apiLogin(email, totp, otp);
    },
    {
      onError: (e) => {
        console.info('Token Renewal Error', e);
        // setLocalStoreObject('@currentUser', null);
      },
      onSuccess: async (result) => {
        await onRenewSuccess(result);
        window.location.reload();
      },
      ...options,
    }
  );
};

export const useRefreshToken = (userId?: string, options?: {}) => {
  // Used to refresh the JWT every 5 minutes.
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return useStrictQuery<ResponseUser, WaevErrors, string | undefined>(
    ['RefreshToken'],
    () => {
      if (!userId) {
        return Promise.resolve({
          errors: [{ details: 'No Valid User ID Defined', title: 'Bad Request', status: 400 }],
        } as ResponseUser);
      }
      if (!isLoaded) {
        setIsLoaded(true);
        return Promise.resolve({
          errors: [{ details: 'Skipping first load', title: 'Expected Error', status: 400 }],
        } as ResponseUser);
      }

      return apiGetCurrentUser();
    },
    {
      retry: false,
      select: (result) => result?.data?.attributes?.token,
      refetchOnWindowFocus: false,
      enabled: !!userId,
      refetchInterval: 5 * 60 * 1000,
      refetchIntervalInBackground: true,
      onError: (error) => {
        console.error('useRefresh Error', error);
      },
      ...options,
    }
  );
};

export const useRegister = (email: string, firstName?: string, lastName?: string, options?: {}) => {
  // let navigate = useNavigate();
  return useMutation<ResponseLogin, WaevErrors>(
    'User',
    () => {
      if (!email) {
        return Promise.reject('No email provided for Register');
      }
      return apiRegister(email, firstName, lastName);
    },
    {
      onError: (e) => {
        console.info('Register Error', e);
      },
      onSuccess: (result) => {
        console.info('OnSuccess Register', result);
      },
      ...options,
    }
  );
};

export const useLogout = (options?: {}) => {
  const { logout, setCurrentUser } = useContext(CurrentUserContext);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<{ success: boolean }, Error>(
    'User',
    () => {
      // return apiLogout();
      return Promise.resolve({ success: true, message: 'Logged Out!' });
    },
    {
      onSuccess: () => {
        queryClient.clear();
        setCurrentUser(undefined);
        dispatch(setUserData(null));
        logout();
      },
      ...options,
    }
  );
};

export const useForgotPassword = (email: string, options?: {}) => {
  return useMutation<ResponseLogin, WaevErrors>(
    'User-Forgot',
    () => {
      if (!email) {
        return Promise.reject('No Email Provided for Request');
      }
      return apiForgotPassword(email).then((response) => {
        return response;
      });
    },
    {
      onError: (e) => {
        console.info('Forgot Email Error', e);
      },
      onSuccess: (result) => {
        console.info('OnSuccess Forgot Email', result);
      },
      ...options,
    }
  );
};

export const useSendMagicLink = (email: string, options?: {}) => {
  return useMutation<ResponseLogin, WaevErrors>(
    'User-Magiclink',
    () => {
      if (!email) {
        return Promise.reject('No Email Provided for Request');
      }
      return apiMagicLink(email).then((response) => {
        return response;
      });
    },
    {
      onError: (e) => {
        console.info('Send Magic Link Error', e);
      },
      onSuccess: (result) => {},
      ...options,
    }
  );
};

export const useVerifyMagicLink = (email: string, key: string, options?: {}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setCurrentUser } = useContext(CurrentUserContext);
  const { setErrorNotification } = useContext(NotificationContext);
  return useMutation<ResponseLogin, WaevErrors>(
    'User-Verifylink',
    () => {
      if (!email || !key) {
        return Promise.reject('No Email Or Key Provided for Request');
      }
      return apiVerifyLink(email, key).then((response) => {
        return response;
      });
    },
    {
      onError: (e) => {
        setErrorNotification({
          title: 'Magic Link Authentication Failed',
          message: 'The magic link is not valid. Please send a new request.',
        });
      },
      onSuccess: (result) => {
        const time = new Date().getTime().toString();
        window.localStorage.setItem('jwtStoreTime', time);
        sessionStorage.setItem('is-authenticated', 'true');
        navigate('../home', { replace: true });
        setCurrentUser(result.data);
        dispatch(setUserData(result.data));
      },
      ...options,
    }
  );
};
