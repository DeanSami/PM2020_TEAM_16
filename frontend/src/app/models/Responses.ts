import { User } from './users';

export interface LoginResponse {
  status: boolean;
  message: string;
  user?: User;
  token?: string;
}
