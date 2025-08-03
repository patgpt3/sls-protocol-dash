import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion, Relationships } from '../data';

export interface DeploymentDomainStripped {
  domain?: string;
  deploymentId?: string;
  domainId?: string;
}
export interface DeploymentDomain {
  attributes: DeploymentDomainAttributes;
  type?: 'deployments';
  id?: string;
  relationships?: Relationships;
}

interface ResponseDeploymentDomainPayload extends JSONApiSuccess {
  data: DeploymentDomain;
  included?: any[];
}

interface ResponseDeploymentDomainsPayload extends JSONApiSuccess {
  data: DeploymentDomain[];
  included?: any[];
}

export type ResponseDeploymentDomain = ResponseDeploymentDomainPayload | JSONApiFailure;
export type ResponseDeploymentDomains = ResponseDeploymentDomainsPayload | JSONApiFailure;

export interface DeploymentDomainConfig {
  form_identifier: string;
}
export interface DeploymentDomainAttributes extends DeploymentDomainData {
  fingerprint?: string;
}

export interface DeploymentDomainData {
  config?: DeploymentDomainConfig;
  deployment_id?: string;
  domain_id?: string;
}

export interface DeploymentDomainPayloadData {
  attributes: DeploymentDomainData;
  type: 'deployment_domains';
  id?: string;
  // relationships?: DeploymentDomainRelationships;
  links?: JSONLinks;
}

export interface DeploymentDomainPayload {
  data: DeploymentDomainPayloadData;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
}
