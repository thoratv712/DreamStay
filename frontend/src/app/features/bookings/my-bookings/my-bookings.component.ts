import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html'
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  errorMessage = '';
  cancellingId: number | null = null;

  constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
  this.loading = true;
  this.bookingService.getMyBookings().subscribe({
    next: (bookings) => {
      this.bookings = bookings;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.errorMessage = 'Failed to load your bookings.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  cancelBooking(booking: Booking): void {
  if (!confirm(`Cancel booking for Room ${booking.roomNumber}?`)) {
    return;
  }
  this.cancellingId = booking.id;
  this.bookingService.cancelBooking(booking.id).subscribe({
    next: (updated) => {
      const idx = this.bookings.findIndex(b => b.id === updated.id);
      if (idx > -1) this.bookings[idx] = updated;
      this.cancellingId = null;
      this.cdr.detectChanges();
    },
    error: () => {
      this.cancellingId = null;
      alert('Unable to cancel this booking. Please try again.');
    }
  });
}

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
