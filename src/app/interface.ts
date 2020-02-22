export interface IFilter {
  address: string;
  lat: number;
  lng: number;
}


export interface MaskModel {
  type: string;
  features: GeoJson[];
}

export interface GeoJson {
  type: string;
  properties: GeoProperty[];
  geometry: Geometry;
}

export interface GeoProperty {
  id: number;
  name: string;
  phone: string;
  address: string;
  mask_adult: number;
  mask_child: number;
  update: string;
  avaiable: string;
  note: string;
  custom_note: string;
  website: string;
  contry: string;
  town: string;
  cunli: string;
  service_period: string;
  service_note: string;
}

export interface Geometry {
  type: string;
  conordinaties: [number, number]; // [longitude, latitude]
}


