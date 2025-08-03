import { ResponseLogin } from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const LOGIN_URL = `${API_URL}/auth/login`;
export const REGISTER_URL = `${API_URL}/auth/register`;
export const FORGOT_PASS_URL = `${API_URL}/auth/forgot`;
export const MAGIC_LINK_URL = `${API_URL}/auth/magiclink`;
export const VERIFY_LINK_URL = `${API_URL}/auth/verify_link`;

export const apiLogin = (email: string, totp?: string, otp?: string): Promise<ResponseLogin> => {
  return call('POST', LOGIN_URL, { email, totp, otp });
};

export const apiRegister = (
  email: string,
  firstName: string,
  lastName: string
  // password: string
): Promise<ResponseLogin> => {
  return call('POST', REGISTER_URL, {
    data: {
      type: 'users',
      attributes: {
        email,
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
};

export const apiForgotPassword = (email: string): Promise<ResponseLogin> => {
  return call('POST', FORGOT_PASS_URL, { email }, {}, null);
};

export const apiMagicLink = (email: string): Promise<ResponseLogin> => {
  return call('POST', MAGIC_LINK_URL, { email });
};

export const apiVerifyLink = (email: string, key: string): Promise<ResponseLogin> => {
  return call('POST', VERIFY_LINK_URL, { email, key });
};
