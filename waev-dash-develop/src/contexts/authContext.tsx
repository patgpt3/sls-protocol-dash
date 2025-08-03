import { createContext, useEffect, useState, PropsWithChildren, useContext } from 'react';

import { useRenewToken, useLogin, useRegister, useForgotPassword, useSendMagicLink } from 'hooks';
import { noop } from 'utils';

import { CurrentUser } from 'types';
import { NotificationContext } from './notificationContext';

interface AuthWithSetter {
  currentUser?: CurrentUser;
  email: string;
  errorLogin?: any;
  errorRegister?: any;
  errorForgotPassword?: any;
  errorSendMagicLink?: any;
  firstName?: string;
  isLoadingLogin?: boolean;
  isLoadingRegister?: boolean;
  isLoadingForgotPasswordRequest?: boolean;
  isLoadingMagicLinkRequest?: boolean;
  isLoadingRenewToken?: boolean;
  isLoginSuccess?: boolean;
  isRegisterSuccess?: boolean;
  isForgotPasswordRequestSuccess?: boolean;
  isMagicLinkRequestSuccess?: boolean;
  isErrorLogin?: boolean;
  isErrorRenewToken?: boolean;
  isSuccessRenewToken?: boolean;
  lastName?: string;
  login?: () => void;
  register?: () => void;
  renewToken?: () => void;
  sendForgotPassword?: () => void;
  sendMagicLink?: () => void;
  setEmail?: (email: string) => void;
  setFirstName?: (firstName: string) => void;
  setLastName?: (lastName: string) => void;
  setTotp?: (totp: string) => void;
  setOtp?: (otp: string) => void;
  totp?: string | '';
  otp?: string | '';
}

export const AuthContext = createContext<AuthWithSetter>({
  email: undefined,
  errorLogin: undefined,
  errorRegister: undefined,
  errorForgotPassword: undefined,
  errorSendMagicLink: undefined,
  firstName: undefined,
  isLoadingLogin: false,
  isLoadingRegister: false,
  isLoadingForgotPasswordRequest: false,
  isLoadingMagicLinkRequest: false,
  isLoadingRenewToken: false,
  isLoginSuccess: false,
  isRegisterSuccess: false,
  isForgotPasswordRequestSuccess: false,
  isMagicLinkRequestSuccess: false,
  isErrorLogin: false,
  isErrorRenewToken: false,
  isSuccessRenewToken: false,
  lastName: undefined,
  login: noop,
  register: noop,
  renewToken: noop,
  sendMagicLink: noop,
  setEmail: noop,
  setFirstName: noop,
  setLastName: noop,
  setTotp: noop,
  totp: undefined,
  setOtp: noop,
  otp: undefined,
});

interface Props {
  value?: AuthWithSetter;
}

export const AuthContextProvider = ({ children, value }: PropsWithChildren<Props>): JSX.Element => {
  const { setSuccessNotification } = useContext(NotificationContext);

  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [totp, setTotp] = useState<string | ''>('');
  const [otp, setOtp] = useState<string | ''>('');

  const {
    error: errorLogin,
    isError: isErrorLogin,
    isLoading: isLoadingLogin,
    mutate: login,
    isSuccess: isLoginSuccess,
  } = useLogin(
    email,
    totp === '' ? undefined : totp.toString(),
    otp === '' ? undefined : otp.toString()
  );

  const {
    isError: isErrorRenewToken,
    isLoading: isLoadingRenewToken,
    mutate: renewToken,
    isSuccess: isSuccessRenewToken,
  } = useRenewToken(
    email,
    totp === '' ? undefined : totp.toString(),
    otp === '' ? undefined : otp.toString()
  );

  useEffect(() => {
    isSuccessRenewToken &&
      setSuccessNotification({
        title: 'Success',
        message: 'Session Renewed!',
      });
  }, [isSuccessRenewToken]);

  const {
    error: errorRegister,
    isLoading: isLoadingRegister,
    mutate: register,
    isSuccess: isRegisterSuccess,
  } = useRegister(email, firstName, lastName);

  const {
    error: errorForgotPassword,
    isLoading: isLoadingForgotPasswordRequest,
    mutate: sendForgotPassword,
    isSuccess: isForgotPasswordRequestSuccess,
  } = useForgotPassword(email);

  const {
    error: errorSendMagicLink,
    isLoading: isLoadingMagicLinkRequest,
    mutate: sendMagicLink,
    isSuccess: isMagicLinkRequestSuccess,
  } = useSendMagicLink(email);

  useEffect(() => {
    isLoadingForgotPasswordRequest && setEmail('');
  }, [isLoadingForgotPasswordRequest]);

  return (
    <AuthContext.Provider
      value={{
        errorLogin,
        errorRegister,
        errorForgotPassword,
        errorSendMagicLink,
        setEmail,
        setTotp,
        setOtp,
        login,
        email,
        totp,
        otp,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        isLoadingLogin,
        isLoadingRegister,
        isLoginSuccess,
        isLoadingRenewToken,
        isSuccessRenewToken,
        isLoadingForgotPasswordRequest,
        isLoadingMagicLinkRequest,
        isRegisterSuccess,
        isErrorLogin,
        isErrorRenewToken,
        isForgotPasswordRequestSuccess,
        isMagicLinkRequestSuccess,
        renewToken,
        register,
        sendForgotPassword,
        sendMagicLink,
        ...value,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
