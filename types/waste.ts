export interface WasteType {
  id: string;
  name: string;
  color: string;
  nextDate: string;
}

export interface Collection {
  type: string;
  date: string;
  time: string;
  color: string;
}

export interface WasteCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  examples: string[];
}

export interface RecyclingFacility {
  id: number;
  name: string;
  type: string;
  distance: string;
  address: string;
  hours: string;
  phone?: string;
  acceptedWaste: string[];
  color: string;
}

export interface UserAddress {
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
}

export interface NotificationPreferences {
  restmuell: boolean;
  biomuell: boolean;
  papier: boolean;
  gelberSack: boolean;
  altglas: boolean;
}
