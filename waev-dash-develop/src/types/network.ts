// export interface ApiFailure extends Response {
//   success: false;
//   message: string;
// }

// export interface ApiSuccess extends Response {
//   success: true;
// }

export interface ApiError {
  details: string;
  status: number;
  title: string;
}

export interface ApiResponse extends Response {
  // success?: boolean;
  // message?: string;
  errors?: ApiError[];
}

// export interface ApiResponseArray extends Response {
//   success?: boolean;
//   message?: string;
//   count?: number;
// }
