import { JSONApiSuccess, JSONApiFailure, Relationships } from './data';
import { WaevPermissions } from './permissions';

interface ResponseDomainPayload extends JSONApiSuccess {
  data: Domain;
  included?: any[];
  [key: string]: any;
}

interface ResponseDomainsPayload extends JSONApiSuccess {
  data: Domain[];
  included?: any[];
  [key: string]: any;
}

export type ResponseDomain = ResponseDomainPayload | JSONApiFailure;
export type ResponseDomains = ResponseDomainsPayload | JSONApiFailure;

export interface Domain {
  attributes: DomainAttributes;
  type?: 'domains';
  id?: string;
  relationships?: Relationships;
  permissions?: DomainPermissions[];
}

export interface DomainAttributes extends DomainData {
  fingerprint?: string;
}
export type DomainPermissions = WaevPermissions;

// export interface Domain extends JSONApi {
//   deployments?: Deployment[];
//   organization?: Organization;
//   domain: string;
//   dnsVerified?: boolean;
//   domainVerified?: boolean;
//   name?: string;
// }

export interface DomainData {
  domain: string;
  dnsVerified?: boolean;
  domainVerified?: boolean;
  name?: string;
  organization_id: string;
}

export interface DomainPayloadData {
  attributes: DomainData;
  type: 'domains';
  // id?: string;
  // relationships?: DomainRelationships;
}

export interface DomainPayload {
  domain: string;
}

export interface DomainSubmitPayload {
  data: {
    type: 'domains';
    id?: string;
    attributes: DomainPayload;
  };
}
