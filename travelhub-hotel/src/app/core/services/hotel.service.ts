import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Hotel } from '../models/index';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private _hotel = signal<Hotel | null>(null);
  readonly hotel = this._hotel.asReadonly();

  constructor(private api: ApiService) {}

  loadMyHotel(): Observable<Hotel> {
    return this.api.get<Hotel>('/catalog/hotels/mine').pipe(tap((hotel) => this._hotel.set(hotel)));
  }

  uploadImage(hotelId: number, file: File): Observable<{ image_url: string }> {
    return this.api
      .uploadFile<{ image_url: string }>(`/catalog/hotels/${hotelId}/image`, file)
      .pipe(
        tap((res) => {
          const current = this._hotel();
          if (current) {
            this._hotel.set({ ...current, image_url: res.image_url });
          }
        }),
      );
  }

  setImageUrl(hotelId: number, url: string): Observable<Hotel> {
    return this.api
      .put<Hotel>(`/catalog/hotels/${hotelId}`, { image_url: url })
      .pipe(tap((hotel) => this._hotel.set(hotel)));
  }
}
