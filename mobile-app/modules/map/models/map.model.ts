export interface HospitalLocation {
  hospitalName: string;
  hospitalAddress: string;
  hospitalLocation: {
    latitude: number;
    longitude: number;
  };
}

export interface HospitalQueryPayload {
  // lat:string
  // lon:string
  query?: string;
}

interface Place {
  business_status: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Array<{
    height: number;
    html_attributions: string[];
    width: number;
  }>;
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
}

export interface PlacesApiResponse {
  html_attributions: string[];
  next_page_token?: string;
  results: Place[];
}

export interface SearchPlaceResponse {
  html_attributions: string[];
  results: PlaceResult[];
  status: string;
}

export interface PlaceResult {
  business_status: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: OpeningHours;
  photos?: Photo[];
  place_id: string;
  plus_code: PlusCode;
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
}

interface Geometry {
  location: Location;
  viewport: Viewport;
}

interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface OpeningHours {
  open_now: boolean;
}

interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface BloodRequest {
  medicalNotes: string;
  hospitalName: string;
  hospitalAddress: string;
  bloodNeededBefore: string;
  bagsNeeded: number;
  hospitalLocation: {
    latitude: number;
    longitude: number;
  };
  prescriptionFiles: PrescriptionFile[];
}

export interface PrescriptionFile {
  name: string;
  url: string;
}
