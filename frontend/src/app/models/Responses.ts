import { User } from './users';
import { Place } from './places';
import { Games } from './Games';
export interface LoginResponse {
  message?: string;
  user?: User;
  token?: string;
}

export interface PlaceResponse {
  message?: string;
  Place?: Place | Place[];
}

export interface GameResponse {
  message?: string;
  Game?: Games | Games[];
}

export interface SmsResponse {
  token: string;
  message?: string;
}

