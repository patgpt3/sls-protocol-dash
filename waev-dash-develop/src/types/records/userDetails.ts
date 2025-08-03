import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion } from '../data';

interface ResponseUserDetailsPayload extends JSONApiSuccess {
  data: UserDetails;
  included?: any[];
  [key: string]: any;
}

export type ResponseUserDetails = ResponseUserDetailsPayload | JSONApiFailure;

export interface UserDetails {
  attributes: UserDetailsFullAttributes;
  type?: 'user_details';
  id?: string;
}

export interface UserDetailsFullAttributes extends UserDetailsAttributes {
  fingerprint?: string;
}

export interface UserDetailsPayloadData {
  attributes: UserDetailsAttributes;
  type: 'user_details';
  id?: string;
  links?: JSONLinks;
}

export interface UserDetailsPayload {
  data: UserDetailsPayloadData;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
}

export interface UserDetailsFieldData {
  anon?: {data: Record<string, boolean>};
  pii?: {data: Record<string, boolean>};
  meta?: {
    "_gclid": string;
    fingerprint: string;
    url: string;
  }
}

export interface UserDetailsAttributes {
  flags: Record<string, boolean>;
  data: UserDetailsFieldData
}
