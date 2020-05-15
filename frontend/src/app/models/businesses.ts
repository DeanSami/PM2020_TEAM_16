import { ConditionType } from './places';

export interface Businesses {
  id?: number;
  name: string;
  owner_id: number;
  dog_friendly: boolean;
  description?: string;
  phone: string;
  image?: string;
  address: string;
  type: number;
}

export enum BusinessesType {
  Barber_Dog = 0,
  Pet_shop = 1
}

export let BusinessesTypeTitles = { };
BusinessesTypeTitles[BusinessesType.Barber_Dog] = 'מספרת כלבים';
BusinessesTypeTitles[BusinessesType.Pet_shop] = 'חנות חיות';
