import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-admin-bookings',
  imports: [CommonModule],
  templateUrl: './admin-bookings.component.html'
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  loading = true;
  errorMessage = '';
  selectedStatus: BookingStatus | 'ALL' = 'ALL';
  statuses: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  updatingId: number | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load bookings.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredBookings = this.selectedStatus === 'ALL'
      ? this.bookings
      : this.bookings.filter(b => b.status === this.selectedStatus);
  }

  selectStatus(status: BookingStatus | 'ALL'): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  updateStatus(booking: Booking, status: BookingStatus): void {
    this.updatingId = booking.id;
    this.bookingService.updateStatus(booking.id, status).subscribe({
      next: (updated) => {
        const idx = this.bookings.findIndex(b => b.id === updated.id);
        if (idx > -1) this.bookings[idx] = updated;
        this.applyFilter();
        this.updatingId = null;
      },
      error: () => {
        this.updatingId = null;
        alert('Failed to update booking status.');
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
