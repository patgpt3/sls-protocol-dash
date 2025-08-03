import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion, Relationships } from '../data';

export interface Access {
  attributes: AccessAttributes;
  type?: 'accesses';
  id?: string;
  relationships?: Relationships;
}

interface ResponseAccessPayload extends JSONApiSuccess {
  data: Access;
  included?: any[];
}

interface ResponseAccessesPayload extends JSONApiSuccess {
  data: Access[];
  included?: any[];
}

export type ResponseAccess = ResponseAccessPayload | JSONApiFailure;
export type ResponseAccesses = ResponseAccessesPayload | JSONApiFailure;

export interface AccessAttributes extends AccessData {
  fingerprint?: string;
}

export interface AccessData {
  api_key?: string;
  description?: string;
  permissions: {
    owner?: boolean;
    admin?: boolean;
    read?: boolean;
    write?: boolean;
    delete?: boolean;
  };
}

export interface AccessPayloadData {
  attributes: AccessData | {};
  type: 'accesses';
  id?: string;
  // relationships?: AccessRelationships;
  links?: JSONLinks;
}

export interface AccessPayload {
  data: AccessPayloadData;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
}
