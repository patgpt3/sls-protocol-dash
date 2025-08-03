import {
  ApiResponse,
  ResponseOrganizations,
  ResponseWaevPermission,
  WaevPermissionsSubmitPayload,
  ResponseOrganization,
  OrganizationSubmitPayload,
} from 'types';

import { call } from 'network/NetworkRoutes';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const ORGANIZATIONS_URL = `${API_URL}/organizations`;
export const ORGANIZATION_URL = `${API_URL}/organizations/{{organization_id}}`;
export const ORGANIZATION_PERMISSIONS_URL = `${API_URL}/organizations/{{organization_id}}/permissions?included=user,organization`;
export const ORGANIZATION_PERMISSION_URL = `${API_URL}/organizations/{{organization_id}}/permissions/{{organization_permission_id}}`;

export const apiGetOrganizations = (): Promise<ResponseOrganizations> => {
  return call('GET', ORGANIZATIONS_URL, {}, {});
};

export const apiGetOrganizationById = (organization_id: string): Promise<ResponseOrganization> => {
  return call('GET', ORGANIZATION_URL, {}, { organization_id }, null);
};

export const apiCreateOrganization = (data: object): Promise<ResponseOrganization> => {
  return call('POST', ORGANIZATIONS_URL, data, {}, null);
};

export const apiUpdateOrganization = (
  organization_id: string,
  data: OrganizationSubmitPayload
): Promise<ResponseOrganization> => {
  return call('PATCH', ORGANIZATION_URL, data, { organization_id }, null);
};

export const apiDeleteOrganization = (organization_id: string): Promise<ApiResponse> => {
  return call('DELETE', ORGANIZATION_URL, {}, { organization_id }, null);
};

export const apiListOrganizationPermissions = (
  organization_id: string
): Promise<ResponseWaevPermission> => {
  return call('GET', ORGANIZATION_PERMISSIONS_URL, {}, { organization_id }, null);
};

// export const apiListOrganizationPermissions = (): Promise<ResponseWaevPermissions> => {
//   // @ts-ignore
//   return call('GET', ORGANIZATION_PERMISSIONS_URL, {}, {});
// };

export const apiCreateOrganizationPermission = (
  organization_id: string,
  data: WaevPermissionsSubmitPayload
): Promise<ResponseWaevPermission> => {
  return call('POST', ORGANIZATION_PERMISSIONS_URL, data, { organization_id }, null);
};

export const apiUpdateOrganizationPermission = (
  organization_id: string,
  organization_permission_id: string,
  data: WaevPermissionsSubmitPayload
): Promise<ResponseWaevPermission> => {
  return call(
    'PATCH',
    ORGANIZATION_PERMISSION_URL,
    data,
    { organization_id, organization_permission_id },
    null
  );
};

export const apiDeleteOrganizationPermission = (
  organization_id: string,
  organization_permission_id: string
): Promise<ApiResponse> => {
  return call(
    'DELETE',
    ORGANIZATION_PERMISSION_URL,
    {},
    { organization_id, organization_permission_id },
    null
  );
};
