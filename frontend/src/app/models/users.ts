export interface User {
  id: number;
  user_type: UserType;
  email?: string;
  phone: number;
  password: string;
  avatar: string;
  deleted: boolean;
  created_at?: string;
  update_at?: string;
}

export enum UserType{
  Admin = 0,
  DogOwner = 1,
  BusinessOwner = 2
}
