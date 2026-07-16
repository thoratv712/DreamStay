import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { RoomListComponent } from './features/rooms/room-list/room-list.component';
import { RoomDetailComponent } from './features/rooms/room-detail/room-detail.component';
import { MyBookingsComponent } from './features/bookings/my-bookings/my-bookings.component';
import { AdminRoomsComponent } from './features/admin/admin-rooms/admin-rooms.component';
import { AdminBookingsComponent } from './features/admin/admin-bookings/admin-bookings.component';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'rooms/:id', component: RoomDetailComponent },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
  { path: 'admin/rooms', component: AdminRoomsComponent, canActivate: [AdminGuard] },
  { path: 'admin/bookings', component: AdminBookingsComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];
