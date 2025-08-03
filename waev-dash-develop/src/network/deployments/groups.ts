import {
  ApiResponse,
  WaevPermissionsSubmitPayload,
  ResponseGroup,
  ResponseWaevPermission,
  ResponseGroups,
  GroupSubmitPayload,
} from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const GROUPS_URL = `${API_URL}/deployments/{{deployment_id}}/groups`;
export const USER_GROUPS_URL = `${API_URL}/groups`;
export const GROUP_URL = `${API_URL}/deployments/{{deployment_id}}/groups/{{group_id}}`;
export const GROUP_PERMISSIONS_URL = `${API_URL}/groups/{{group_id}}/permissions`;
export const GROUP_PERMISSION_URL = `${API_URL}/groups/{{group_id}}/permissions/{{group_permission_id}}`;

export const apiGetGroups = (deployment_id: string): Promise<ResponseGroups> => {
  return call('GET', GROUPS_URL, {}, { deployment_id }, null);
};

export const apiGetUserGroups = (): Promise<ResponseGroups> => {
  return call('GET', USER_GROUPS_URL, {}, {}, null);
};

export const apiGetGroupById = (
  deployment_id: string,
  group_id: string
): Promise<ResponseGroup> => {
  return call('GET', GROUP_URL, {}, { deployment_id, group_id }, null);
};

export const apiCreateGroup = (
  data: GroupSubmitPayload,
  deployment_id: string
): Promise<ResponseGroup> => {
  return call('POST', GROUPS_URL, data, { deployment_id }, null);
};

export const apiDeleteGroup = (deployment_id: string, group_id: string): Promise<ApiResponse> => {
  return call('DELETE', GROUP_URL, '', { deployment_id, group_id }, null);
};

export const apiGetGroupPermissionById = (
  group_id: string,
  group_permission_id: string
): Promise<ResponseWaevPermission> => {
  return call('GET', GROUP_PERMISSION_URL, {}, { group_id, group_permission_id }, null);
};

// export const apiListGroupPermissions = (): Promise<ResponseWaevPermissions> => {
// //   return call('GET', GROUP_PERMISSIONS_URL, {}, {});
// };

export const apiCreateGroupPermission = (
  group_id: string,
  data: WaevPermissionsSubmitPayload
): Promise<ResponseWaevPermission> => {
  return call('POST', GROUP_PERMISSIONS_URL, data, { group_id }, null);
};

export const apiUpdateGroupPermission = (
  group_id: string,
  group_permission_id: string,
  data: WaevPermissionsSubmitPayload
): Promise<ResponseWaevPermission> => {
  return call('PATCH', GROUP_PERMISSION_URL, data, { group_id, group_permission_id }, null);
};

export const apiDeleteGroupPermission = (
  group_id: string,
  group_permission_id: string
): Promise<ApiResponse> => {
  return call('DELETE', GROUP_PERMISSION_URL, {}, { group_id, group_permission_id }, null);
};
