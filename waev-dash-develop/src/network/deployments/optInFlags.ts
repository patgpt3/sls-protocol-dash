import { ApiResponse, ResponseOptInFlag, ResponseOptInFlags, OptInFlagPayload } from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const OPT_INS_URL = `${API_URL}/deployments/{{deployment_id}}/flags`;
export const OPT_IN_URL = `${API_URL}/deployments/{{deployment_id}}/flags/{{flag_id}}`;

export const apiGetOptInFlags = (deployment_id: string): Promise<ResponseOptInFlags> => {
  return call('GET', OPT_INS_URL, {}, { deployment_id }, null);
};

export const apiGetOptInFlagById = (
  deployment_id: string,
  flag_id: string
): Promise<ResponseOptInFlag> => {
  return call('GET', OPT_IN_URL, {}, { deployment_id, flag_id }, null);
};

export const apiCreateOptInFlag = (
  data: object,
  deployment_id: string
): Promise<ResponseOptInFlag> => {
  return call('POST', OPT_INS_URL, data, { deployment_id }, null);
};

export const apiUpdateOptInFlag = (
  deployment_id: string,
  flag_id: string,
  data: OptInFlagPayload
): Promise<ResponseOptInFlag> => {
  return call('PATCH', OPT_IN_URL, data, { deployment_id, flag_id }, null);
};

export const apiDeleteOptInFlag = (
  deployment_id: string,
  flag_id: string
): Promise<ApiResponse> => {
  return call('DELETE', OPT_IN_URL, '', { deployment_id, flag_id }, null);
};
