import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockHotelAdminService } from '../../core/services/mocks/mock-hotel-admin.service';
import { Room } from '../../core/models';

interface RoomForm {
  nombre: string;
  tipo: string;
  capacidad: number;
  precio_noche: number;
  descripcion: string;
  disponible: boolean;
}

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  panelOpen = signal(false);
  editingRoom: Room | null = null;
  saving = false;
  deleteConfirmId: number | null = null;

  tipos = ['sencilla', 'doble', 'suite', 'familiar', 'presidencial'];

  form: RoomForm = this.emptyForm();

  constructor(private mockService: MockHotelAdminService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.mockService.getRooms().subscribe({ next: (r) => (this.rooms = r) });
  }

  openAdd() {
    this.editingRoom = null;
    this.form = this.emptyForm();
    this.panelOpen.set(true);
  }

  openEdit(room: Room) {
    this.editingRoom = room;
    this.form = {
      nombre: room.nombre,
      tipo: room.tipo,
      capacidad: room.capacidad,
      precio_noche: room.precio_noche,
      descripcion: room.descripcion || '',
      disponible: room.disponible,
    };
    this.panelOpen.set(true);
  }

  closePanel() {
    this.panelOpen.set(false);
    this.editingRoom = null;
  }

  save() {
    if (!this.form.nombre.trim() || !this.form.tipo || this.form.precio_noche <= 0) return;
    this.saving = true;
    if (this.editingRoom) {
      this.mockService.updateRoom(this.editingRoom.id, { ...this.form }).subscribe({
        next: () => {
          this.saving = false;
          this.closePanel();
          this.loadRooms();
        },
      });
    } else {
      this.mockService.createRoom({ ...this.form, moneda: 'COP' }).subscribe({
        next: () => {
          this.saving = false;
          this.closePanel();
          this.loadRooms();
        },
      });
    }
  }

  confirmDelete(id: number) {
    this.deleteConfirmId = id;
  }

  cancelDelete() {
    this.deleteConfirmId = null;
  }

  doDelete(id: number) {
    this.mockService.deleteRoom(id).subscribe({
      next: () => {
        this.deleteConfirmId = null;
        this.loadRooms();
      },
    });
  }

  emptyForm(): RoomForm {
    return {
      nombre: '',
      tipo: 'doble',
      capacidad: 2,
      precio_noche: 0,
      descripcion: '',
      disponible: true,
    };
  }

  formatPrice(p: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(p);
  }
}
