import { RecordFormField, CSVDataType } from './records/records';
import { CurrentUser as CurrentUserType } from './auth';

export interface recordsStateType {
  csv_data?: CSVDataType;
  isTablePretty: boolean;
  addSingleData?: RecordFormField[];
}

export interface SelectedUnionType {
  unionId: string;
  unionName: string;
  selectionPage: string;
}

export interface unionsStateType {
  selected_union?: SelectedUnionType;
}

export interface userStateType {
  token?: string;
  userData?: CurrentUserType;
}

export interface langStateType {
  lang: string;
}

export interface RootStateType {
  records: recordsStateType;
  user: userStateType;
  language: langStateType;
  unions: unionsStateType;
}
