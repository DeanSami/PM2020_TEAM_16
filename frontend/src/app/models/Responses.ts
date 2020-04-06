import { User } from './users';
import { Places } from './places'
export interface LoginResponse {
  status: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface PlaceResponse{
  status: boolean;
  message?: string;
  Place?: Places | [Places];
}
