import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room, RoomRequest } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private baseUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/${id}`);
  }

  searchAvailableRooms(checkIn: string, checkOut: string): Observable<Room[]> {
    const params = new HttpParams().set('checkIn', checkIn).set('checkOut', checkOut);
    return this.http.get<Room[]>(`${this.baseUrl}/search`, { params });
  }

  createRoom(request: RoomRequest): Observable<Room> {
    return this.http.post<Room>(this.baseUrl, request);
  }

  updateRoom(id: number, request: RoomRequest): Observable<Room> {
    return this.http.put<Room>(`${this.baseUrl}/${id}`, request);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
