import { JSONApiSuccess, JSONApiFailure, Relationships } from './data';
import { WaevPermissions } from './permissions';

interface ResponseOrganizationPayload extends JSONApiSuccess {
  data: Organization;
  included?: WaevPermissions[] | any[];
  [key: string]: any;
}

interface ResponseOrganizationsPayload extends JSONApiSuccess {
  data: Organization[];
  included?: WaevPermissions[] | any[];
  [key: string]: any;
}

export type OrganizationPermissions = WaevPermissions

export type ResponseOrganization = ResponseOrganizationPayload | JSONApiFailure;
export type ResponseOrganizations = ResponseOrganizationsPayload | JSONApiFailure;

export interface Organization {
  attributes: OrganizationAttributes;
  type?: 'organizations';
  id?: string;
  relationships?: Relationships;
  permissions?: any[];
  fullPermissions?: OrganizationPermissions[];
}

export interface OrganizationPayload {
  name: string;
}

export interface OrganizationAttributes extends OrganizationPayload {
  deployment_count: number;
  domain_count: number;
  fingerprint: string;
}

export interface OrganizationSubmitPayload {
  data: {
    type: 'organizations';
    id?: string;
    attributes: OrganizationPayload;
  };
}
