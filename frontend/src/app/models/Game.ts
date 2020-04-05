export interface Games {
  id: number;
  owner_id: number;
  name: string;
  start: string;
  end: string;
  start_location: number;
  finish_location: number;
  deleted?: boolean;
  created_at?: string;
  update_at?: string;
}

export interface Gamestep {
  id: number;
  game_id: number;
  name: string;
  secret_key: number;
  start_location: number;
  finish_location: number;
  description?: string;
  created_at?: string;
  update_at?: string;
}

