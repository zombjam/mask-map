export interface IFilter {
  searchText?: string;
  tab: 0 | 1 | 2;
  lat?: number;
  lng?: number;
  per: number;
  page: number;
}

export interface IMaskModel {
  type: string;
  features: IGeoJson[];
}

export interface IGeoJson {
  type: string;
  properties: IGeoProperty;
  geometry: IGeometry;
}

export interface IGeoProperty {
  id: number;
  name: string;
  phone: string;
  address: string;
  mask_adult: number;
  mask_child: number;
  updated: string | Date;
  avaiable: string;
  note: string;
  custom_note: string;
  website: string;
  contry: string;
  town: string;
  cunli: string;
  service_periods: string;
}

export interface IGeometry {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}
