import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockHotelAdminService } from '../../core/services/mocks/mock-hotel-admin.service';
import { HotelService } from '../../core/services/hotel.service';
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

  uploadingImage = false;
  uploadError = '';
  uploadSuccess = false;

  imageUrlInput = '';
  savingUrl = false;
  saveUrlSuccess = false;
  saveUrlError = '';

  tipos = ['sencilla', 'doble', 'suite', 'familiar', 'presidencial'];

  form: RoomForm = this.emptyForm();

  hotelLoadError = '';

  constructor(
    private mockService: MockHotelAdminService,
    public hotelService: HotelService,
  ) {}

  ngOnInit() {
    this.loadRooms();
    this.hotelService.loadMyHotel().subscribe({
      error: (err) => {
        console.error('[HotelService] loadMyHotel failed:', err);
        this.hotelLoadError =
          err?.error?.error || 'No se pudo cargar el hotel. Verifica la conexión.';
      },
    });
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

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const hotel = this.hotelService.hotel();
    if (!file || !hotel) return;

    this.uploadError = '';
    this.uploadSuccess = false;

    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'La imagen no puede superar 5 MB.';
      input.value = '';
      return;
    }

    this.uploadingImage = true;
    this.uploadError = '';
    this.uploadSuccess = false;

    this.hotelService.uploadImage(hotel.id, file).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.uploadSuccess = true;
        setTimeout(() => (this.uploadSuccess = false), 3000);
      },
      error: (e) => {
        this.uploadingImage = false;
        this.uploadError = e?.error?.error || 'Error al subir la imagen.';
      },
    });

    input.value = '';
  }

  saveImageUrl() {
    const hotel = this.hotelService.hotel();
    if (!this.imageUrlInput.trim() || !hotel) return;

    this.savingUrl = true;
    this.saveUrlSuccess = false;
    this.saveUrlError = '';

    this.hotelService.setImageUrl(hotel.id, this.imageUrlInput.trim()).subscribe({
      next: () => {
        this.savingUrl = false;
        this.saveUrlSuccess = true;
        this.imageUrlInput = '';
        setTimeout(() => (this.saveUrlSuccess = false), 3000);
      },
      error: (e) => {
        this.savingUrl = false;
        this.saveUrlError = e?.error?.error || 'Error al guardar la URL.';
      },
    });
  }
}
