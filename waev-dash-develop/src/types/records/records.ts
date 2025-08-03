import { JSONApiSuccess, JSONApiFailure, JSONLinks, JSONApiVersion } from '../data';

// Slim Records Data
export type ResponseSlimRecord = ResponseSlimRecordPayload | JSONApiFailure;
export type ResponseSlimRecords = ResponseSlimRecordsPayload | JSONApiFailure;

interface ResponseSlimRecordPayload extends JSONApiSuccess {
  data: SlimRecord;
  included?: any[];
}

interface ResponseSlimRecordsPayload extends JSONApiSuccess {
  data: SlimRecord[];
  included?: any[];
}

export interface SlimRecordResponsePayload {
  data: SlimRecord;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { [key: string]: string | number | Date };
}

export interface RecordsSlimResponsePayload {
  data: SlimRecord[];
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { count?: number; [key: string]: string | number | Date };
}
export interface SlimRecord {
  attributes: SlimRecordAttributes;
  type?: 'slim_records';
  id?: string;
}

export interface SlimRecordAttributes {
  store_id?: string;
  transactions?: WaevRecordTransactions;
}

// Full Data
export type ResponseFullRecord = ResponseFullRecordPayload | JSONApiFailure;
export type ResponseFullRecords = ResponseFullRecordsPayload | JSONApiFailure;

interface ResponseFullRecordPayload extends JSONApiSuccess {
  data: FullRecordAttributes;
  included?: any[];
}

interface ResponseFullRecordsPayload extends JSONApiSuccess {
  data: FullRecordAttributes[];
  included?: any[];
}
export interface RecordFullResponsePayload {
  data: FullRecord;
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { [key: string]: string | number | Date };
  fingerprint?: string;
  includes?: any[];
}

export interface RecordsResponsePayload {
  data: FullRecord[];
  links?: JSONLinks;
  jsonapi?: JSONApiVersion;
  meta?: { count?: number; [key: string]: string | number | Date };
}

export interface FullRecord {
  attributes: FullRecordAttributes;
  // type?: 'records';
  id?: string;
  relationships?: object;
  links?: JSONLinks;
}

// export interface RecordAttributes {
//   record?: FullRecordAttributes;
//   record_id?: string;
//   id?: string;
// }

// These keys will be linked to WaevField[] defined in Deployments.
export interface RecordDataEntry {
  [key: string]: string | number | Date;
}

// Submit Data
// export interface RecordSubmitData {
//   uid: string;
//   flags: number;
//   sourceId: number | string;
//   otherData?: {
//     values: RecordDataEntry;
//     private_values: RecordDataEntry;
//   };
// }

// export interface RecordSubmitPayload {
//   data: {
//     type: 'records';
//     attributes: {
//       data: RecordSubmitData;
//     };
//   };
// }

export interface FullRecordAttributes {
  //record?: RecordRecord;
  anon?: FullRecordDataAttributes;
  dateTime?: string | Date;
  deployment_id?: string;
  meta?: FullRecordDataAttributes;
  pii?: FullRecordDataAttributes;

  source_id?: number;
  store_id?: string;
  timestamp?: number;
  transactions?: WaevRecordTransactions;
  uid?: string;
  v?: number;
}

export interface FullRecordDataAttributes {
  data?: RecordDataEntry;
  salt?: string;
  sig?: {
    sig: string;
    keyType: string;
  };
}
export interface WaevRecordTransactions {
  announce_tx?: string;
  flags_meta_transaction_id?: string;
  flags_update_transaction_id?: string;
}

// Table Format
export interface WaevTableRecord {
  slimRecordId?: string;
  storeId?: string;
  transactions?: WaevRecordTransactions;

  fullRecord?: FullRecord;
  error?: any;
  errorFull?: any;
  // isLoading?: boolean;
  isLoadingFull?: boolean;
  // isLoadingSlim?: boolean;
  // fetch: () => void;
}

export interface RecordsPage {
  [key: string]: number;
}

export interface RecordFormField {
  field: string;
  value: string;
}

export interface RecordFormField {
  field: string;
  value: string;
}

export interface CSVRecordType {
  [key: string]: string;
}

export interface CSVDataType {
  headers: string[];
  records: CSVRecordType[];
}

export interface FileReaderEventTarget extends EventTarget {
  result: string;
}
