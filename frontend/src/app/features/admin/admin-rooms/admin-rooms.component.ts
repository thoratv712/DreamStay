import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomService } from '../../../core/services/room.service';
import { Room, RoomType } from '../../../core/models/room.model';

@Component({
  selector: 'app-admin-rooms',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-rooms.component.html'
})
export class AdminRoomsComponent implements OnInit {
  rooms: Room[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  showModal = false;
  editingRoomId: number | null = null;
  form: FormGroup;
  roomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'DELUXE', 'SUITE', 'FAMILY'];
  saving = false;

  constructor(private fb: FormBuilder, private roomService: RoomService) {
    this.form = this.fb.group({
      roomNumber: ['', Validators.required],
      type: ['SINGLE', Validators.required],
      pricePerNight: [0, [Validators.required, Validators.min(1)]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      available: [true],
      amenitiesText: ['']
    });
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load rooms.';
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingRoomId = null;
    this.form.reset({ type: 'SINGLE', pricePerNight: 0, capacity: 1, available: true, amenitiesText: '' });
    this.showModal = true;
  }

  openEditModal(room: Room): void {
    this.editingRoomId = room.id;
    this.form.reset({
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      description: room.description,
      imageUrl: room.imageUrl,
      available: room.available,
      amenitiesText: (room.amenities || []).join(', ')
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRoom(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const value = this.form.value;
    const request = {
      roomNumber: value.roomNumber,
      type: value.type,
      pricePerNight: value.pricePerNight,
      capacity: value.capacity,
      description: value.description,
      imageUrl: value.imageUrl,
      available: value.available,
      amenities: value.amenitiesText
        ? value.amenitiesText.split(',').map((a: string) => a.trim()).filter((a: string) => !!a)
        : []
    };

    const request$ = this.editingRoomId
      ? this.roomService.updateRoom(this.editingRoomId, request)
      : this.roomService.createRoom(request);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.successMessage = this.editingRoomId ? 'Room updated successfully.' : 'Room created successfully.';
        this.loadRooms();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Failed to save room.';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  deleteRoom(room: Room): void {
    if (!confirm(`Delete Room ${room.roomNumber}? This cannot be undone.`)) {
      return;
    }
    this.roomService.deleteRoom(room.id).subscribe({
      next: () => {
        this.rooms = this.rooms.filter(r => r.id !== room.id);
        this.successMessage = 'Room deleted successfully.';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to delete room.';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }
}
