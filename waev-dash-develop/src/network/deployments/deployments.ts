import {
  ApiResponse,
  WaevPermissionsSubmitPayload,
  ResponseDeployment,
  ResponseWaevPermission,
  ResponseDeployments,
  DeploymentSubmitPayload,
} from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const DEPLOYMENTS_URL = `${API_URL}/organizations/{{organization_id}}/deployments`;
export const DEPLOYMENT_URL = `${API_URL}/organizations/{{organization_id}}/deployments/{{deployment_id}}`;
export const DEPLOYMENT_PERMISSIONS_URL = `${API_URL}/deployments/{{deployment_id}}/permissions`;
export const DEPLOYMENT_PERMISSION_URL = `${API_URL}/deployments/{{deployment_id}}/permissions/{{deployment_permission_id}}`;

export const apiGetDeployments = (organization_id: string): Promise<ResponseDeployments> => {
  return call('GET', DEPLOYMENTS_URL, {}, { organization_id }, null);
};

export const apiGetDeploymentById = (
  organization_id: string,
  deployment_id: string
): Promise<ResponseDeployment> => {
  return call('GET', DEPLOYMENT_URL, {}, { organization_id, deployment_id }, null);
};

export const apiCreateDeployment = (
  data: object,
  organization_id: string
): Promise<ResponseDeployment> => {
  return call('POST', DEPLOYMENTS_URL, data, { organization_id }, null);
};

export const apiUpdateDeployment = (
  organization_id: string,
  deployment_id: string,
  data: DeploymentSubmitPayload
): Promise<ResponseDeployment> => {
  return call('PATCH', DEPLOYMENT_URL, data, { organization_id, deployment_id }, null);
};

export const apiDeleteDeployment = (
  organization_id: string,
  deployment_id: string
): Promise<ApiResponse> => {
  return call('DELETE', DEPLOYMENT_URL, '', { organization_id, deployment_id }, null);
};

export const apiGetDeploymentPermissionById = (
  deployment_id: string,
  deployment_permission_id: string
): Promise<ResponseWaevPermission> => {
  return call(
    'GET',
    DEPLOYMENT_PERMISSION_URL,
    {},
    { deployment_id, deployment_permission_id },
    null
  );
};

// export const apiListDeploymentPermissions = (): Promise<ResponseWaevPermissions> => {
// //   return call('GET', DEPLOYMENT_PERMISSIONS_URL, {}, {});
// };

export const apiCreateDeploymentPermission = (
  deployment_id: string,
  data: WaevPermissionsSubmitPayload
): Promise<ResponseWaevPermission> => {
  return call('POST', DEPLOYMENT_PERMISSIONS_URL, data, { deployment_id }, null);
};

export const apiUpdateDeploymentPermission = (
  deployment_id: string,
  deployment_permission_id: string,
  data: WaevPermissionsSubmitPayload
): Promise<ResponseWaevPermission> => {
  return call(
    'PATCH',
    DEPLOYMENT_PERMISSION_URL,
    data,
    { deployment_id, deployment_permission_id },
    null
  );
};

export const apiDeleteDeploymentPermission = (
  deployment_id: string,
  deployment_permission_id: string
): Promise<ApiResponse> => {
  return call(
    'DELETE',
    DEPLOYMENT_PERMISSION_URL,
    {},
    { deployment_id, deployment_permission_id },
    null
  );
};
