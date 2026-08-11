import { PropertyType } from "./common";

export type PropertyListResponse = {
  data: PropertyItem[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}

export type PropertyItem = {
  id: string;
  title: string;
  location: string;
  type: string;
  price: string;
  rating: number;
  image: string;
  lat?: number;
  lng?: number;
  isFavorite?: boolean;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  pricePerMonth: string;
  seatCapacity: number;
  hasAC: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  type: "APARTMENT" | "HOUSE" | "VILLA" | "HOTEL" | string;
  rating: string;
  isFavorite?: boolean;
  amenities: string[];
  latitude: number;
  longitude: number;
  imageUrl: string;
  minStay: string;
  cost?: string;
  available_seats?: number;
  isActive: boolean;
  createdAt: string;
}

export interface RoomType {
  id: string,
  name: string,
  pricePerMonth: string,
  freeSeats: number,
  maxSeatsCount: number,
  roomsCount: number,
  seatCapacity: number,
  hasAC: boolean,
  rooms: Room[]
}

export interface Seat {
  seatIndex: number,
  tenant: string,
  tenantBio: string
}

export interface Room {
  roomId: string,
  roomName: string,
  booking: Seat[]
}

export interface PropertyLocation {
  id: string;
  name: string;
  address: string;
  cost: string;
  image: string;
  lat: number;
  lng: number;
  ratings: number;
}
