export interface Businesses {
  id: number;
  name: string;
  owner_id: number;
  dog_friendly: boolean;
  description?: string;
  phone: number;
  image: string;
  address: string;
}

export enum Type {
  Barber_Dog = 0,
  Pet_shop = 1
}
