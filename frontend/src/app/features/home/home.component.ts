import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  searchForm: FormGroup;
  minDate: string;

  constructor(private fb: FormBuilder, private router: Router) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.minDate = today.toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      checkIn: [this.toDateInput(today)],
      checkOut: [this.toDateInput(tomorrow)],
      guests: [2]
    });
  }

  private toDateInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSearch(): void {
    const { checkIn, checkOut, guests } = this.searchForm.value;
    this.router.navigate(['/rooms'], { queryParams: { checkIn, checkOut, guests } });
  }
}
