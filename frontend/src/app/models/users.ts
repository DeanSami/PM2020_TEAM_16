export interface User {
  id: number;
  name: string;
  user_type: UserType;
  email?: string;
  phone: string;
  password?: string;
  avatar: string;
  deleted: boolean;
  birthday?: string;
  gender: UserGender;
  hobbies: number;
  created_at?: string;
  update_at?: string;
}

export enum UserGender{
  Mail = 0,
  Femail = 1
}

export enum UserType{
  Admin = 0,
  DogOwner = 1,
  BusinessOwner = 2
}

export enum UserHobbies{
  Travelling = 1,
  Driving = 2,
  Photography = 4,
  Gaming = 8,
  Music = 16,
  Surfing = 32,
  Foodie = 64,
  TV = 128,
  Shopping = 256,
  Social = 512,
  Reading = 1024,
  Sport = 2048,
  Computers = 4096,
  Camping = 8192,
}
