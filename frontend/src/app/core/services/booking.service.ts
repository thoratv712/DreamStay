import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingRequest, BookingStatus } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(request: BookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, request);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/my`);
  }

  cancelBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.baseUrl}/${id}/cancel`, {});
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/admin/all`);
  }

  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Booking>(`${this.baseUrl}/admin/${id}/status`, {}, { params });
  }
}
