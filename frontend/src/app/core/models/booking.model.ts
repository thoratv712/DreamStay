export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: number;
  userId: number;
  userFullName: string;
  roomId: number;
  roomNumber: string;
  roomType: string;
  roomImageUrl: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}
