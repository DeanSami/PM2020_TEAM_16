import { User } from './users';
import { Place } from './places';

export interface LoginResponse {
  message?: string;
  user?: User;
  token?: string;
}

export interface PlaceResponse {
  message?: string;
  Place?: Place | Place[];
}

export interface SmsResponse {
  status: boolean;
  message?: string;
}

