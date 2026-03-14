import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockHotelAdminService } from '../../core/services/mocks/mock-hotel-admin.service';
import { Room } from '../../core/models';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms.component.html',
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private mockService: MockHotelAdminService) {}

  ngOnInit() {
    this.mockService.getRooms().subscribe({ next: (r) => (this.rooms = r) });
  }

  formatPrice(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }
}
