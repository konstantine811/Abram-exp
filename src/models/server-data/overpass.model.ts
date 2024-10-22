// Основний інтерфейс, що представляє дані з Overpass API
export interface IOverpassApiResponse {
  elements: INode[];
  generator: string;
  osm3s: IOSM3s;
}

// Інтерфейс для метаданих OSM (як у "osm3s" на зображенні)
export interface IOSM3s {
  copyright: string;
  timestamp_areas_base: string;
  timestamp_osm_base: string;
}

// Інтерфейс для вузлів (Node)
export interface INode {
  type: ElementType.Node;
  id: number;
  lat: number;
  lon: number;
  tags?: ITags; // Теги, що можуть містити різні властивості
}

// Інтерфейс для шляхів (Way)
export interface IWay {
  type: ElementType.Way;
  id: number;
  nodes: number[];
  tags?: IWayTags; // Теги для шляхів
}

// Інтерфейс для відношень (Relation)
export interface IRelation {
  type: ElementType.Relation;
  id: number;
  members: IRelationMember[];
  tags?: IRelationTags;
}

// Спільний інтерфейс для тегів вузлів та шляхів
export interface ITags {
  [key: string]: string | undefined;
  name: string;
  "name:uk": string;
  population: string;
  "addr:postcode": string;
  "name:en": string;
  "name:ru": string;
  place: PlaceType;
  // Інші можливі теги...
}

// Специфічні теги для шляхів
export interface IWayTags extends ITags {
  highway?: string;
  lanes?: string;
  surface?: string;
}

// Теги для відношень
export interface IRelationTags {
  type?: string;
  name?: string;
  "name:en"?: string;
  "name:uk"?: string;
}

// Члени відношення (для Relation)
export interface IRelationMember {
  type: string;
  ref: number;
  role: string;
}

export enum PlaceType {
  City = "city",
  Town = "town",
  Village = "village",
}

export enum ElementType {
  Node = "node",
  Way = "way",
  Relation = "relation",
}
