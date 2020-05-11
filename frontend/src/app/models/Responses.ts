import { User } from './users';
import { Place } from './places';
import { Game } from './Games';
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
  Game?: Game | Game[];
}

export interface SmsResponse {
  token: string;
  message?: string;
}

