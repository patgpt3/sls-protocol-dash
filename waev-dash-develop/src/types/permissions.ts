import { JSONApiFailure, JSONApiSuccess, JSONApiVersion, JSONLinks } from './data';
import { EntityStatus } from './deployments';

export interface Permissions {
  owner?: boolean;
  admin?: boolean;
  read?: boolean;
  write?: boolean;
  delete?: boolean;
}

export const PERMISSION_KEY_OPTIONS = [
  'owner',
  'admin',
  'read',
  'write',
  'delete',
] as PermissionKeys[];

export type PermissionKeys = keyof Permissions;

export type ResponseWaevPermission = ResponseWaevPermissionPayload | JSONApiFailure;
export type ResponseWaevPermissions = ResponseWaevPermissionsPayload | JSONApiFailure;

interface ResponseWaevPermissionPayload extends JSONApiSuccess {
  data: WaevPermissionsResponseData;
  included?: any[];
}

interface ResponseWaevPermissionsPayload extends JSONApiSuccess {
  data: WaevPermissionsResponseData[];
  included?: any[];
}
export interface OrganizationPermissionRelationships {
  organization: {
    data: {
      type: string;
      id: string;
    };
  };
  user: {
    data: {
      type: string;
      id: string;
    };
  };
}
export interface WaevPermissionResponsePayload {
  data: WaevPermissionsResponseData;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { [key: string]: string | number | Date };
}

export interface WaevPermissionsResponsePayload {
  data: WaevPermissionsResponseData[];
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { count?: number; [key: string]: string | number | Date };
}

export interface WaevPermissions {
  attributes: WaevPermissionsAttributes;
  type?: 'permissions';
  id?: string;
  links?: JSONLinks;
  relationships?: OrganizationPermissionRelationships;
}

export interface WaevPermissionsResponseData {
  attributes: WaevPermissionsAttributes;
  type: 'permissions';
  id?: string;
  relationships?: OrganizationPermissionRelationships;
  links?: JSONLinks;
}

export interface WaevPermissionsSubmitData {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  organization_id?: string;
  domain_id?: string;
  deployment_id?: string;
  groups?: {
    id: string;
  };
  permissions: Permissions;
  address?: string;
  users?: {
    email?: string;
    first_name: string;
    last_name: string;
  };
  access?: {
    api_key?: string;
  };
}

export interface WaevPermissionsAttributes extends WaevPermissionsSubmitData {
  pending: boolean;
  status?: EntityStatus;
  fingerprint: string;
}

// Submit Data
export interface WaevPermissionsSubmitPayload {
  data: {
    type?:
      | 'organization_permissions'
      | 'deployment_permissions'
      | 'group_permissions'
      | 'permissions';
    id?: string;
    user_id?: string;
    attributes: WaevPermissionsSubmitData;
  };
}

export type EntityTypes = 'organization' | 'deployment' | 'group';
