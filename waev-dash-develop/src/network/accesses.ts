import { ApiResponse, ResponseAccess, ResponseAccesses, AccessPayload } from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const ACCESSES_URL = `${API_URL}/deployments/{{deployment_id}}/accesses`;
export const ACCESS_URL = `${API_URL}/deployments/{{deployment_id}}/accesses/{{access_id}}`;

export const apiGetAccessById = (
  access_id: string,
  deployment_id: string
): Promise<ResponseAccess> => {
  return call('GET', ACCESS_URL, {}, { access_id, deployment_id }, null);
};

export const apiListAccesses = (deployment_id: string): Promise<ResponseAccesses> => {
  return call('GET', ACCESSES_URL, {  }, {deployment_id});
};

export const apiCreateAccess = (
  deployment_id: string,
  data: AccessPayload
): Promise<ResponseAccess> => {
  return call('POST', ACCESSES_URL, data, { deployment_id }, null);
};

export const apiUpdateAccess = (
  access_id: string,
  deployment_id: string,
  data: AccessPayload
): Promise<ResponseAccess> => {
  return call('PATCH', ACCESS_URL, data, { access_id, deployment_id }, null);
};

export const apiDeleteAccess = (access_id: string, deployment_id: string): Promise<ApiResponse> => {
  return call('DELETE', ACCESS_URL, {}, { access_id, deployment_id }, null);
};
