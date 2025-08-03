import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion } from './data';

//  Data
export type ResponseUser = ResponseUserPayload | JSONApiFailure;
export type ResponseUsers = ResponseUsersPayload | JSONApiFailure;

interface ResponseUserPayload extends JSONApiSuccess {
  data: UserAttributes;
  included?: any[];
}

interface ResponseUsersPayload extends JSONApiSuccess {
  data: UserAttributes[];
  included?: any[];
}

export interface UserResponsePayload {
  data: User;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { [key: string]: string | number | Date };
}

export interface UsersResponsePayload {
  data: User[];
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { count?: number; [key: string]: string | number | Date };
}

export interface User {
  attributes: UserAttributes;
  type: 'users';
  id?: string;
  // relationships?: UserRelationships;
  links?: JSONLinks;
}

export interface UserAttributes {
  // user?: UserAttributesUser;
  name?: string;
  token?: string;
  email?: string;
}

// export interface UserAttributesUser {
//   userId: string;
//   transactionId: string;
// }

// These keys will be linked to WaevField[] defined in Deployments.

// Submit Data
export interface UserSubmitPayload {
  data: {
    type: 'users';
    attributes: UserSubmitData;
  };
}

export interface UserSubmitData {
  email?: string;
  first_name?: string;
  last_name?: string;
}

// Table
export interface WaevTableUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  setUpdatingUser: (id: string) => void;
}
