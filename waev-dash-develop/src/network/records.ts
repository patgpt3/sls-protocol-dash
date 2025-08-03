import { ResponseFullRecord, ResponseSlimRecords, ResponseFullRecords } from 'types';
import { API_URL, call } from 'network/NetworkRoutes';

export const RECORDS_USER_URL = `${API_URL}/deployments/{{deployment_id}}/records/{{uuid}}`;
export const RECORDS_URL = `${API_URL}/deployments/{{deployment_id}}/records`;
export const RECORD_URL = `${API_URL}/deployments/{{deployment_id}}/records/{{store_id}}/read`;
export const USER_DETAILS_URL = `${API_URL}/deployments/{{deployment_id}}/user_details/{{user_identifier}}`;

export const GROUP_RECORDS_USER_URL = `${API_URL}/groups/{{group_id}}/records/{{uuid}}`;
export const GROUP_RECORDS_URL = `${API_URL}/groups/{{group_id}}/records`;
export const GROUP_RECORD_URL = `${API_URL}/groups/{{group_id}}/records/{{store_id}}/read`;
export const GROUP_USER_DETAILS_URL = `${API_URL}/groups/{{group_id}}/user_details/{{user_identifier}}`;

export const UPLOAD_CSV_URL = `${API_URL}/uploads/{{deployment_id}}/csv`;

export const apiGetRecords = (deployment_id: string): Promise<ResponseSlimRecords> => {
  return call('GET', RECORDS_URL, {}, { deployment_id });
};

export const apiGetRecordById = (
  deployment_id: string,
  store_id: string
): Promise<ResponseFullRecord> => {
  return call('GET', RECORD_URL, {}, { deployment_id, store_id }, null);
};

export const apiGetRecordsByUUID = (
  deployment_id: string,
  uuid: string
): Promise<ResponseSlimRecords> => {
  return call('GET', RECORDS_USER_URL, {}, { deployment_id, uuid }, null);
};

export const apiGetUserDetails = (
  deployment_id: string,
  user_identifier: string
): Promise<ResponseFullRecords> => {
  return call('GET', USER_DETAILS_URL, {}, { deployment_id, user_identifier }, null);
};

export const apiCreateRecord = (
  deployment_id: string,
  data: object
): Promise<ResponseFullRecord> => {
  return call('POST', RECORDS_URL, data, { deployment_id }, null);
};

export const apiGetGroupRecords = (group_id: string): Promise<ResponseSlimRecords> => {
  return call('GET', GROUP_RECORDS_URL, {}, { group_id });
};

export const apiGetGroupRecordById = (
  group_id: string,
  store_id: string
): Promise<ResponseFullRecord> => {
  return call('GET', GROUP_RECORD_URL, {}, { group_id, store_id }, null);
};

export const apiGetGroupRecordsByUUID = (
  group_id: string,
  uuid: string
): Promise<ResponseSlimRecords> => {
  return call('GET', GROUP_RECORDS_USER_URL, {}, { group_id, uuid }, null);
};

export const apiGetGroupUserDetails = (
  group_id: string,
  user_identifier: string
): Promise<ResponseFullRecords> => {
  return call('GET', GROUP_USER_DETAILS_URL, {}, { group_id, user_identifier }, null);
};

export const apiUploadRecordsCSV = (
  deployment_id: string,
  files: File[]
): Promise<ResponseFullRecord> => {
  return call('UPLOAD', UPLOAD_CSV_URL, files, { deployment_id }, null);
};
