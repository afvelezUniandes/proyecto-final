import { ChangeDetectorRef, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HotelService } from '../../core/services/hotel.service';
import { RoomService } from '../../core/services/room.service';
import { Room } from '../../core/models';

interface RoomForm {
  nombre: string;
  tipo: string;
  capacidad: number;
  precio_noche: number;
  descripcion: string;
  disponible: boolean;
}

// Alfanumérico permisivo: letras (con tildes), números, espacios y signos básicos.
const DESCRIPTION_PATTERN = /^[\p{L}\p{N}\s.,;:()\-_/'"¡!¿?]*$/u;

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rooms.component.html',
})
export class RoomsComponent implements OnInit {
  rooms = signal<Room[]>([]);
  deletedRooms = signal<Room[]>([]);
  loadingRooms = signal(false);
  roomFilter = signal<'active' | 'deleted' | 'all'>('active');
  showDeleted = signal(false);
  panelOpen = signal(false);

  filteredRooms = computed(() => {
    const f = this.roomFilter();
    if (f === 'active') return this.rooms();
    if (f === 'deleted') return this.deletedRooms();
    return [...this.rooms(), ...this.deletedRooms()];
  });
  editingRoom: Room | null = null;
  saving = false;
  saveError = '';
  nameError = '';
  capacityError = '';
  priceError = '';
  descriptionError = '';
  deleteConfirmId: number | null = null;
  deleteError = '';
  restoreSuccessMsg = '';

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

  readonly hotelService = inject(HotelService);
  private readonly roomService = inject(RoomService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.hotelService.loadMyHotel().subscribe({
      next: () => this.loadRooms(),
      error: (err) => {
        console.error('[HotelService] loadMyHotel failed:', err);
        this.hotelLoadError =
          err?.error?.error || 'No se pudo cargar el hotel. Verifica la conexión.';
        this.cdr.detectChanges();
      },
    });
  }

  loadRooms() {
    const hotel = this.hotelService.hotel();
    if (!hotel) return;
    this.loadingRooms.set(true);
    this.restoreSuccessMsg = '';
    this.roomService.listAll(hotel.id).subscribe({
      next: (all) => {
        this.rooms.set(all.filter((r) => !r.eliminada));
        this.deletedRooms.set(all.filter((r) => r.eliminada));
        this.loadingRooms.set(false);
      },
      error: () => this.loadingRooms.set(false),
    });
  }

  openAdd() {
    this.editingRoom = null;
    this.form = this.emptyForm();
    this.clearErrors();
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
    this.clearErrors();
    this.panelOpen.set(true);
  }

  closePanel() {
    this.panelOpen.set(false);
    this.editingRoom = null;
  }

  private clearErrors() {
    this.saveError = '';
    this.nameError = '';
    this.capacityError = '';
    this.priceError = '';
    this.descriptionError = '';
  }

  private validateForm(): boolean {
    this.clearErrors();
    let ok = true;
    if (!this.form.nombre.trim()) {
      this.nameError = 'El nombre es obligatorio.';
      ok = false;
    }
    if (!Number.isInteger(this.form.capacidad) || this.form.capacidad < 0) {
      this.capacityError = 'La capacidad debe ser un entero positivo (>= 0).';
      ok = false;
    }
    if (!Number.isInteger(this.form.precio_noche) || this.form.precio_noche <= 0) {
      this.priceError = 'El precio debe ser un entero positivo.';
      ok = false;
    }
    const desc = this.form.descripcion?.trim() || '';
    if (desc && !DESCRIPTION_PATTERN.test(desc)) {
      this.descriptionError = 'La descripción solo admite caracteres alfanuméricos.';
      ok = false;
    }
    return ok;
  }

  save() {
    if (!this.validateForm()) return;
    const hotel = this.hotelService.hotel();
    if (!hotel) return;

    this.saving = true;
    const payload = {
      nombre: this.form.nombre.trim(),
      tipo: this.form.tipo,
      capacidad: this.form.capacidad,
      precio_noche: this.form.precio_noche,
      descripcion: this.form.descripcion?.trim() || '',
      disponible: this.form.disponible,
    };

    const obs = this.editingRoom
      ? this.roomService.update(this.editingRoom.id, payload)
      : this.roomService.create({ ...payload, hotel_id: hotel.id, moneda: 'COP' });

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closePanel();
        this.loadRooms();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        const status = err?.status;
        const backendMsg = err?.error?.error;
        if (status === 409) {
          this.nameError = backendMsg || 'Ya existe una habitación con ese nombre.';
        } else if (status === 400 && backendMsg) {
          this.saveError = backendMsg;
        } else {
          this.saveError = backendMsg || 'No se pudo guardar la habitación.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  confirmDelete(id: number) {
    this.deleteConfirmId = id;
    this.deleteError = '';
  }

  cancelDelete() {
    this.deleteConfirmId = null;
  }

  doDelete(id: number) {
    this.roomService.remove(id).subscribe({
      next: () => {
        this.deleteConfirmId = null;
        this.deleteError = '';
        this.loadRooms();
      },
      error: (err) => {
        const msg = err?.error?.error || '';
        if (err?.status === 409) {
          this.deleteError = 'ROOMS.DELETE_ERR_ACTIVE';
        } else {
          this.deleteError = msg || 'ROOMS.DELETE_ERR_GENERIC';
        }
        this.cdr.detectChanges();
      },
    });
  }

  restore(id: number) {
    this.roomService.restore(id).subscribe({
      next: () => {
        this.restoreSuccessMsg = 'ROOMS.RESTORE_SUCCESS';
        this.loadRooms();
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert(err?.error?.error || 'No se pudo restaurar la habitación.');
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

  /** Vista previa con separador de miles del precio mientras el usuario escribe. */
  formattedPriceInput(): string {
    const p = this.form.precio_noche;
    if (!p || p <= 0) return '';
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(p);
  }

  /** Limpia el 0 inicial al enfocar el campo de precio. */
  onPriceFocus() {
    if (!this.form.precio_noche || this.form.precio_noche === 0) {
      this.form.precio_noche = null as unknown as number;
    }
  }

  /** Restaura 0 si el usuario deja el campo vacío. */
  onPriceBlur() {
    this.form.precio_noche ??= 0;
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
    this.hotelService.uploadImage(hotel.id, file).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.uploadSuccess = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.uploadSuccess = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (e) => {
        this.uploadingImage = false;
        this.uploadError = e?.error?.error || 'Error al subir la imagen.';
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
        setTimeout(() => {
          this.saveUrlSuccess = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (e) => {
        this.savingUrl = false;
        this.saveUrlError = e?.error?.error || 'Error al guardar la URL.';
        this.cdr.detectChanges();
      },
    });
  }
}
