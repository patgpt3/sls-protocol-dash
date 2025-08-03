import { EntityStatus } from '.';
import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion, Relationships } from '../data';
import { WaevPermissions } from '../permissions';
import { OptInFlag } from './optInFlags';

interface ResponseGroupPayload extends JSONApiSuccess {
  data: Group;
  included?: any[];
  [key: string]: any;
}

interface ResponseGroupsPayload extends JSONApiSuccess {
  data: Group[];
  included?: any[];
  [key: string]: any;
}

export type ResponseGroup = ResponseGroupPayload | JSONApiFailure;
export type ResponseGroups = ResponseGroupsPayload | JSONApiFailure;

export interface Group {
  attributes: GroupAttributes;
  // TODO: Refine this.
  type?: 'groups' | 'deployment_groups' | 'deploymentGroups';
  id?: string;
  relationships?: Relationships;
  permissions?: any[];
  fullPermissions?: GroupPermissions[];
  fullOptInFlags?: OptInFlag[];
}

export interface GroupAttributes extends GroupDataAttributes {
  fingerprint?: string;
}

export type GroupPermissions = WaevPermissions;

export interface GroupConfig {
  parts: PartsType[];
  flags: string[];
}

// Group's Response Attributes
export interface GroupDataAttributes {
  id?: string;
  grant?: string;
  config?: GroupConfig;
  name: string;
  flags?: string[];
  deployment_id?: string;
  status?: EntityStatus;
}

// Payload Attributes
export interface GroupPayloadAttributes {
  // id?: string;
  name: string;
  flags: string[];
  deployment_id: string;
  parts: PartsType[];
}

export interface GroupPayloadData {
  attributes: GroupPayloadAttributes;
  type: 'groups';
  id?: string;
  relationships?: GroupRelationships;
  links?: JSONLinks;
}

export interface GroupPayload {
  data: GroupPayloadData;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
}
export interface GroupSubmitPayload {
  data: GroupPayloadData;
}

export interface GroupRelationships {
  [key: string]: { data?: [{ type: string; id: string }]; links?: JSONLinks };
}

export type PartsType = 'anon' | 'pii' | 'meta';
