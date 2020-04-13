import { User } from './users';
import { Place } from './places';

export interface LoginResponse {
  status: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export interface PlaceResponse {
  status: boolean;
  message?: string;
  Place?: Place | Place[];
}

export interface SmsResponse {
  status: boolean;
  message?: string;
}

