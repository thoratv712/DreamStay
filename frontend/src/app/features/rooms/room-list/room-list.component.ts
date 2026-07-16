import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { Room, RoomType } from '../../../core/models/room.model';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './room-list.component.html'
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  loading = true;
  errorMessage = '';

  checkIn = '';
  checkOut = '';
  isSearchMode = false;

  selectedType: RoomType | 'ALL' = 'ALL';
  roomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'DELUXE', 'SUITE', 'FAMILY'];

  constructor(private roomService: RoomService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.checkIn = params['checkIn'] || '';
      this.checkOut = params['checkOut'] || '';
      this.isSearchMode = !!(this.checkIn && this.checkOut);
      this.loadRooms();
    });
  }

  loadRooms(): void {
    this.loading = true;
    this.errorMessage = '';

    const request$ = this.isSearchMode
      ? this.roomService.searchAvailableRooms(this.checkIn, this.checkOut)
      : this.roomService.getAllRooms();

    request$.subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load rooms. Please make sure the backend server is running.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredRooms = this.selectedType === 'ALL'
      ? this.rooms
      : this.rooms.filter(r => r.type === this.selectedType);
  }

  selectType(type: RoomType | 'ALL'): void {
    this.selectedType = type;
    this.applyFilter();
  }

  clearSearch(): void {
    this.isSearchMode = false;
    this.checkIn = '';
    this.checkOut = '';
    this.loadRooms();
  }
}
