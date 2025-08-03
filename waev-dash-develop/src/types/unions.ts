import { JSONApiSuccess, JSONApiFailure } from './data';
import { Deployment } from './deployments';
import { Group } from './deployments/groups';
import { WaevPermissions } from './permissions';

interface ResponseUnionPayload extends JSONApiSuccess {
  data: Union;
  included?: any[];
  [key: string]: any;
}

export interface ResponseUnionsPayload extends JSONApiSuccess {
  data: Union[];
  included?: any[];
  [key: string]: any;
}

export interface ResponseDeploymentUnionsPayload extends JSONApiSuccess {
  data: DeploymentUnion[];
}

export interface UnionRecordField {
  key: string;
  value: string;
}

export interface UnionUserRecords {
  uid: string;
  data: {
    anon: UnionRecordField[];
    pii: UnionRecordField[];
    flags: UnionRecordField[];
    meta: UnionRecordField[];
  };
}

export interface ResponseUnionRecordsData extends JSONApiSuccess {
  attributes: UnionUserRecords;
  type: 'records';
}

export interface ResponseUnionRecordsPayload extends JSONApiSuccess {
  data: ResponseUnionRecordsData;
}

export type ResponseUnion = ResponseUnionPayload | JSONApiFailure;
export type ResponseUnions = ResponseUnionsPayload | JSONApiFailure;
export type ResponseDeploymentUnions = ResponseDeploymentUnionsPayload | JSONApiFailure;
export type ResponseUnionRecords = ResponseUnionRecordsPayload | JSONApiFailure;

export interface UnionRelationships {
  [key: string]: { data?: [{ type: string; id: string }] };
}

export interface Union {
  attributes: UnionAttributes;
  type?: 'unions';
  id?: string;
  relationships?: UnionRelationships;
  permissions?: UnionPermissions[];
}

export interface UnionAttributes extends UnionData {
  name: string;
  organization_id: string;
}
export type UnionPermissions = WaevPermissions;

export interface UnionData {
  domain: string;
  dnsVerified?: boolean;
  domainVerified?: boolean;
  name?: string;
  organization_id: string;
}

export interface UnionCreatePayload {
  data: {
    type: 'unions';
    attributes: {
      name: string;
    };
  };
}

export interface UnionUpdatePayload {
  data: {
    type: 'unions';
    attributes: {
      name: string;
    };
  };
  deployment_data?: Deployment;
}

export interface UnionGroup {
  type: string;
  id: string;
  attributes?: {
    union_id: string;
    group_id: string;
  };
  group_data?: Group;
}

export interface UnionDeployment {
  type: string;
  id: string;
  attributes?: {
    union_id: string;
    deployment_id: string;
    deployments: {
      name: string;
    };
  };
}

export interface DeploymentUnion {
  type: string;
  id: string;
  attributes?: {
    union_id: string;
    deployment_id: string;
    unions: {
      name: string;
    };
  };
}

export interface UnionDeploymentCreatePayload {
  data: {
    type: 'union_deployments';
    attributes: {
      union_id: string;
      deployment_id: string;
      flags: string[];
      parts: string[];
    };
  };
}
