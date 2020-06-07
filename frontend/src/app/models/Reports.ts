import { ConditionType, PlaceActiveType, PlacesType } from './places';

export interface GameReport {
  name: string;
  start: string;
  end: string;
  owner: string;
  start_location: string;
  finish_location: string;
  created_at?: string;
}

export interface PlaceReport {
  name: string;
  type: string;
  address: string;
  condition: string;
  created_at?: string;
}

export interface AdminReport {
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}

export interface UsersReport {
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}
