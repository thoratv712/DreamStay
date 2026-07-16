export type RoomType = 'SINGLE' | 'DOUBLE' | 'DELUXE' | 'SUITE' | 'FAMILY';

export interface Room {
  id: number;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  capacity: number;
  description: string;
  imageUrl: string;
  available: boolean;
  amenities: string[] | null;
}

export interface RoomRequest {
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  capacity: number;
  description: string;
  imageUrl: string;
  available: boolean;
  amenities: string[];
}
