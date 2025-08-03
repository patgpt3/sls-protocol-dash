import {
  ApiResponse,
  ResponseUnion,
  ResponseUnions,
  UnionCreatePayload,
  UnionUpdatePayload,
  UnionDeploymentCreatePayload,
  ResponseUnionRecords,
} from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const UNIONS_URL = `${API_URL}/organizations/{{organization_id}}/unions`;
export const UNION_URL = `${API_URL}/organizations/{{organization_id}}/unions/{{union_id}}`;
export const DEPLOYMENT_UNIONS_URL = `${API_URL}/deployments/{{deployment_id}}/deployment_unions`;
export const PUBLIC_UNIONS_URL = `${API_URL}/organizations/{{organization_id}}/unions/public_list`;
export const UNION_DEPLOYMENTS_URL = `${API_URL}/unions/{{union_id}}/union_deployments`;
export const UNION_DEPLOYMENT_URL = `${API_URL}/unions/{{union_id}}/union_deployments/{{union_deployment_id}}`;
export const UNION_USER_DETAILS_URL = `${API_URL}/unions/{{union_id}}/user_details/{{user_identifier}}`;

export const apiListUnions = (organization_id: string): Promise<ResponseUnions> => {
  return call('GET', UNIONS_URL, {}, { organization_id }, null);
};

export const apiListDeploymentUnions = (deployment_id: string): Promise<ResponseUnions> => {
  return call('GET', DEPLOYMENT_UNIONS_URL, {}, { deployment_id }, null);
};

export const apiListPublicUnions = (organization_id: string): Promise<ResponseUnions> => {
  return call('GET', PUBLIC_UNIONS_URL, {}, { organization_id }, null);
};

export const apiGetUnionById = (
  organization_id: string,
  union_id: string
): Promise<ResponseUnion> => {
  return call('GET', UNION_URL, {}, { organization_id, union_id }, null);
};

export const apiCreateUnion = (
  organization_id: string,
  data: UnionCreatePayload
): Promise<ResponseUnion> => {
  return call('POST', UNIONS_URL, data, { organization_id }, null);
};

export const apiUpdateUnion = (
  union_id: string,
  organization_id: string,
  data: UnionUpdatePayload
): Promise<ResponseUnion> => {
  return call('PATCH', UNION_URL, data, { organization_id, union_id }, null);
};

export const apiDeleteUnion = (union_id: string, organization_id: string): Promise<ApiResponse> => {
  return call('DELETE', UNION_URL, '', { organization_id, union_id }, null);
};

export const apiCreateUnionDeployment = (
  union_id: string,
  data: UnionDeploymentCreatePayload
): Promise<ResponseUnion> => {
  return call('POST', UNION_DEPLOYMENTS_URL, data, { union_id }, null);
};

export const apiDeleteUnionDeployment = (
  union_id: string,
  union_deployment_id: string
): Promise<ApiResponse> => {
  return call('DELETE', UNION_DEPLOYMENT_URL, '', { union_id, union_deployment_id }, null);
};

export const apiGetUnionUserDetails = (
  union_id: string,
  user_identifier: string
): Promise<ResponseUnionRecords> => {
  return call('GET', UNION_USER_DETAILS_URL, {}, { union_id, user_identifier }, null);
};
