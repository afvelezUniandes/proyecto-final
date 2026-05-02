import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HotelAdminService } from '../../../core/services/hotel-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Room, HotelDetail } from '../../../core/models';
import { map } from 'rxjs';

@Component({
  selector: 'app-hotel-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './hotel-rooms.component.html',
})
export class HotelRoomsComponent implements OnInit {
  hotel = signal<HotelDetail | null>(null);
  rooms = signal<Room[]>([]);
  loading = signal(true);

  showForm = false;
  editing: Room | null = null;
  saving = false;

  formNombre = '';
  formTipo = 'estandar';
  formCapacidad = 2;
  formPrecio = 0;
  formMoneda = 'COP';

  constructor(
    private hotelAdmin: HotelAdminService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.hotelAdmin.getMyHotel().subscribe({
      next: (h) => {
        this.hotel.set(h);
        this.loadRooms(h.id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadRooms(hotelId: number) {
    this.hotelAdmin
      .getRooms(hotelId)
      .pipe(map((rooms) => rooms.filter((r) => r.hotel_id === hotelId)))
      .subscribe({
        next: (rooms) => {
          this.rooms.set(rooms);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  openCreate() {
    this.editing = null;
    this.formNombre = '';
    this.formTipo = 'estandar';
    this.formCapacidad = 2;
    this.formPrecio = 0;
    this.formMoneda = 'COP';
    this.showForm = true;
  }

  openEdit(room: Room) {
    this.editing = room;
    this.formNombre = room.nombre;
    this.formTipo = room.tipo;
    this.formCapacidad = room.capacidad;
    this.formPrecio = room.precio_noche;
    this.formMoneda = room.moneda;
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editing = null;
  }

  save() {
    const h = this.hotel();
    if (!h) return;
    this.saving = true;

    if (this.editing) {
      this.hotelAdmin
        .updateRoom(this.editing.id, {
          nombre: this.formNombre,
          tipo: this.formTipo,
          capacidad: this.formCapacidad,
          precio_noche: this.formPrecio,
          moneda: this.formMoneda,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.showForm = false;
            this.editing = null;
            this.loadRooms(h.id);
          },
          error: () => (this.saving = false),
        });
    } else {
      this.hotelAdmin
        .createRoom({
          hotel_id: h.id,
          nombre: this.formNombre,
          tipo: this.formTipo,
          capacidad: this.formCapacidad,
          precio_noche: this.formPrecio,
          moneda: this.formMoneda,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.showForm = false;
            this.loadRooms(h.id);
          },
          error: () => (this.saving = false),
        });
    }
  }

  deleteRoom(room: Room) {
    const h = this.hotel();
    if (!h) return;
    this.hotelAdmin.deleteRoom(room.id).subscribe({
      next: () => this.loadRooms(h.id),
    });
  }

  logout() {
    this.auth.logout();
  }
}
