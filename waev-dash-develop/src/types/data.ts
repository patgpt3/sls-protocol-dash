export interface JSONApi {
  id: string;
  stale: boolean;
  storeKey: string;
  errors: any;
  isPersisted: boolean;
  isMarkedForDestruction: boolean;
  isMarkedForDisassociation: boolean;
}
export type JSONLinks = { self: string; related?: string };
export type JSONApiVersion = { version: string };

export interface JSONApiSuccess {
  included?: any[];
  meta?: any;
  raw?: any;
  _collections?: any;
  jsonapi?: { version: string };
  // meta?: {waev_api_version: string; [k: string ]: any }
  // data
  // included
}

export interface JSONApiFailure {
  errors?: any;
  data?: any;
  [key: string]: any;
}

// Table Data Interfaces
export interface ColumnHeader {
  Header?: string | JSX.Element;
  accessor: string;
  width?: string;
  [key: string]: any;
}

export type Row = Record<string, string | number | Date | JSX.Element>;

export interface TableData {
  columns: ColumnHeader[];
  rows: Row[];
}

// // Waev Data Response Interfaces
// export interface WaevSignature {
//   keyType: string;
//   sig: string;
//   pubKey: string;
// }

export type WaevMetaRecord = Row;

// export interface WaevData {
//   values: WaevMetaRecord;
//   private_values: WaevMetaRecord;
// }

// export interface WaevEventData {
//   uid: string;
//   timestamp: number;
//   flags: number;
//   sourceId: number;
//   // Un-Encrypted and Encrypted
//   otherData: WaevData;
//   clientId: string;
// }
// export interface WaevEventDataEncrypted {
//   uid: string;
//   timestamp: number;
//   flags: number;
//   sourceId: number;
//   // Un-Encrypted and Encrypted
//   otherData: string;
//   clientId: string;
// }

// export interface WaevDataResponse {
//   signature: WaevSignature;
//   eventData: WaevEventData;
//   blockchainId: string;
//   storeId: string;
// }
// export interface WaevDataResponseEncrypted {
//   signature: WaevSignature;
//   eventData: WaevEventDataEncrypted;
//   blockchainId: string;
//   storeId: string;
// }
export interface ReactQueryErrors {
  errors: ReactQueryError[];
}
export interface ReactQueryError {
  source: string;
  status: string;
  title: string;
}

export interface WaevError extends Error {
  name: string;
  message: string;
  detail?: string | object;
  source?: object;
  status?: string;
  title?: string;
  code?: number;
  data?: object;
  type?: string;
}

export interface WaevErrors extends Error {
  errors: WaevError[];
}
export interface Relationships {
  [key: string]: { data: { type: string; id: string } };
}
