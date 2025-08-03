export interface CurrentUser {
  attributes: CurrentUserAttributes;
  id: string;
  links: UserLinks;
  type: 'users';
  relationship?: {};
}

export interface CurrentUserAttributes {
  created_at: Date;
  display: string; // Nickname
  name: string;
  email: string;
  token: string;
  updated_at: Date;
  last_name: string;
  first_name: string;
}

export interface UserLinks {
  self: string;
}

export interface ResponseLogin extends Response {
  data?: CurrentUser;
  links?: UserLinks;
}

export type AuthPageType = 'login' | 'forgotPassword' | 'register' | 'magicLink';
