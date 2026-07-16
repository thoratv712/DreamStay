import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';
import { BookingFormComponent } from '../../bookings/booking-form/booking-form.component';

@Component({
  selector: 'app-room-detail',
  imports: [CommonModule, RouterLink, BookingFormComponent],
  templateUrl: './room-detail.component.html'
})
export class RoomDetailComponent implements OnInit {
  room: Room | null = null;
  loading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private roomService: RoomService,  private cdr: ChangeDetectorRef) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    this.loading = true;
    this.errorMessage = '';
    this.room = null;

    this.roomService.getRoomById(id).subscribe({
      next: (room) => {
        this.room = room;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Room not found or the server is unavailable.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  });
}
}
