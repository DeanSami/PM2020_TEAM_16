export interface Places {
  id: number;
  type: typeplaces;
  name: string;
  SHAPE_Leng: string;
  SHAPE_Area: string;
  created_at?: string;
  update_at?: string;
  street?: string;
  house_number: string;
  neighborhood: string;
  operator: string;
  handicapped: boolean;
  condition: boolean;
  deleted: boolean;
}


export enum typeplaces {
  Dog_garden = 0,
  Historic_Parks = 1,
  Cafewithdog = 2,
  NationalParks = 3,
}
