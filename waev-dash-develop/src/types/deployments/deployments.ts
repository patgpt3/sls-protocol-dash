import { EntityStatus } from '.';
import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion, Relationships } from '../data';
import { WaevPermissions } from '../permissions';

interface ResponseDeploymentPayload extends JSONApiSuccess {
  data: Deployment;
  included?: any[];
  [key: string]: any;
}

interface ResponseDeploymentsPayload extends JSONApiSuccess {
  data: Deployment[];
  included?: any[];
  [key: string]: any;
}

export type ResponseDeployment = ResponseDeploymentPayload | JSONApiFailure;
export type ResponseDeployments = ResponseDeploymentsPayload | JSONApiFailure;

export interface Deployment {
  attributes: DeploymentAttributes;
  type?: 'deployments';
  id?: string;
  relationships?: Relationships;
  permissions?: any[];
  fullPermissions?: DeploymentPermissions[];
}

export interface DeploymentAttributes extends DeploymentData {
  status: EntityStatus;
  fingerprint?: string;
}

export type DeploymentPermissions = WaevPermissions;

export interface WaevField {
  name: string;
  required?: boolean;
  opt_in?: boolean;
}

export interface DeploymentConfig {
  user_field?: string;
  fields?: WaevField[];
  private_fields?: WaevField[];
}

export interface DeploymentData {
  name: string;
  config?: DeploymentConfig;
  organization_id?: string;
  id?: string;
}

export interface DeploymentPayloadData {
  attributes: DeploymentData;
  type: 'deployments';
  id?: string;
  relationships?: DeploymentRelationships;
  links?: JSONLinks;
}

export interface DeploymentPayload {
  data: DeploymentPayloadData;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
}
export interface DeploymentSubmitPayload {
  data: {
    type: 'deployments';
    id?: string;
    attributes: {
      name: string;
      config: DeploymentConfig;
    };
  };
}

export interface DeploymentRelationships {
  domains?: { data?: [{ type: 'domains'; id: string }]; links?: JSONLinks };
  [key: string]: { data?: [{ type: string; id: string }]; links?: JSONLinks };
}

export type DeploymentSectionTypes =
  | 'header'
  | 'deploymentDomains'
  | 'dataIngest'
  | 'optInFlags'
  | 'accesses'
  | 'groups'
  | undefined;
