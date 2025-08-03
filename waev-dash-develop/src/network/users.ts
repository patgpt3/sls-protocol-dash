import { ResponseUser, UserSubmitPayload } from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const USERS_URL = `${API_URL}/users`;
export const ME_URL = `${API_URL}/users/me`;

export const apiCreateUser = (data: UserSubmitPayload): Promise<ResponseUser> => {
  return call('POST', USERS_URL, data, {}, null);
};

export const apiUpdateUser = (data: UserSubmitPayload): Promise<ResponseUser> => {
  return call('PATCH', USERS_URL, data, {}, null);
};

export const apiGetCurrentUser = (): Promise<ResponseUser> => {
  return call('GET', ME_URL, {}, {}, null);
};
