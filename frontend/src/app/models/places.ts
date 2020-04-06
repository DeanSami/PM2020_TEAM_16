export interface Place {
  id?: number;
  type: PlacesType;
  name: string;
  SHAPE_Leng: string;
  SHAPE_Area: string;
  street: string;
  house_number: string;
  neighborhood: string;
  operator: string;
  handicapped: boolean;
  condition: ConditionType;
  deleted?: boolean;
  created_at?: string;
  update_at?: string;
}

export enum PlacesType {
  Dog_garden = 0,
  Historic_Parks = 1,
  Cafewithdog = 2,
  NationalParks = 3,
}

export enum ConditionType {
  Working_Active = 0,
  Working_Not_Active = 1,
  Not_Working_Active = 2,
  Not_Working_Not_Active = 3,
}

export let ConditionTypeTitles = { };
ConditionTypeTitles[ConditionType.Working_Active] = 'פעיל ותקין';
ConditionTypeTitles[ConditionType.Working_Not_Active] = 'תקין ולא פעיל';
ConditionTypeTitles[ConditionType.Not_Working_Active] = 'לא תקין ופעיל';
ConditionTypeTitles[ConditionType.Not_Working_Not_Active] = 'לא תקין ולא פעיל';
