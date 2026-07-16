import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Already includes CurrencyPipe
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Room } from '../../../core/models/room.model';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-booking-form',
  // REMOVED CurrencyPipe from imports since CommonModule covers it
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './booking-form.component.html'
})
export class BookingFormComponent implements OnInit {
  @Input({ required: true }) room!: Room;

  form: FormGroup;
  minDate: string;
  loading = false;
  errorMessage = '';
  successMessage = '';
  nights = 0;
  totalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    public authService: AuthService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.form = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.recalculate());
  }

  get f() {
    return this.form.controls;
  }

  recalculate(): void {
    const { checkInDate, checkOutDate } = this.form.value;
    if (checkInDate && checkOutDate) {
      const inDate = new Date(checkInDate);
      const outDate = new Date(checkOutDate);
      const diffMs = outDate.getTime() - inDate.getTime();
      this.nights = diffMs > 0 ? Math.round(diffMs / (1000 * 60 * 60 * 24)) : 0;
      this.totalPrice = this.nights * this.room.pricePerNight;
    } else {
      this.nights = 0;
      this.totalPrice = 0;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.form.invalid || this.nights <= 0) {
      this.form.markAllAsTouched();
      if (this.nights <= 0) {
        this.errorMessage = 'Check-out date must be after check-in date.';
      }
      return;
    }

    this.loading = true;
    const request = {
      roomId: this.room.id,
      checkInDate: this.form.value.checkInDate,
      checkOutDate: this.form.value.checkOutDate,
      guests: this.form.value.guests
    };

    this.bookingService.createBooking(request).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Booking confirmed! Redirecting to your bookings...';
        setTimeout(() => this.router.navigate(['/my-bookings']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Unable to complete booking. Please try again.';
      }
    });
  }
}
