import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Hotel, HotelsResponse, Room } from '../models';

// ---------- Mock data (fallback when backend is unavailable) ----------
const MOCK_HOTELS: Hotel[] = [
  {
    id: 1,
    nombre: 'Hotel Casa Medina',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    estrellas: 5,
    activo: true,
    descripcion:
      'Boutique hotel en el corazón de la Zona Rosa con arquitectura colonial restaurada.',
    direccion: 'Cra 7 # 69A-22, Bogotá',
    precio_noche: 420000,
    tiene_piscina: false,
    tiene_gimnasio: true,
    tiene_spa: true,
    permite_mascotas: false,
  },
  {
    id: 2,
    nombre: 'Hotel Dann Carlton',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    estrellas: 5,
    activo: true,
    descripcion: 'Hotel de lujo con vista panorámica, piscina en la azotea y restaurante gourmet.',
    direccion: 'Cra 15 # 97-47, Bogotá',
    precio_noche: 580000,
    tiene_piscina: true,
    tiene_gimnasio: true,
    tiene_spa: true,
    permite_mascotas: false,
  },
  {
    id: 3,
    nombre: 'Hotel El Cielo',
    ciudad: 'Medellín',
    pais: 'Colombia',
    estrellas: 4,
    activo: true,
    descripcion:
      'Moderno hotel en El Poblado rodeado de naturaleza y con excelentes vistas de la ciudad.',
    direccion: 'Cl 16 # 43D-30, Medellín',
    precio_noche: 310000,
    tiene_piscina: true,
    tiene_gimnasio: true,
    tiene_spa: false,
    permite_mascotas: true,
  },
  {
    id: 4,
    nombre: 'Charlee Hotel',
    ciudad: 'Medellín',
    pais: 'Colombia',
    estrellas: 5,
    activo: true,
    descripcion: 'Icónico hotel lifestyle en El Poblado con rooftop bar y piscina infinita.',
    direccion: 'Cl 9 # 37-16, Medellín',
    precio_noche: 490000,
    tiene_piscina: true,
    tiene_gimnasio: true,
    tiene_spa: true,
    permite_mascotas: false,
  },
  {
    id: 5,
    nombre: 'Hotel Cartagena Plaza',
    ciudad: 'Cartagena',
    pais: 'Colombia',
    estrellas: 4,
    activo: true,
    descripcion: 'A pasos de la ciudad amurallada con piscina, spa y terraza frente al mar.',
    direccion: 'Av. Blas de Lezo, Cartagena',
    precio_noche: 380000,
    tiene_piscina: true,
    tiene_gimnasio: false,
    tiene_spa: true,
    permite_mascotas: false,
  },
  {
    id: 6,
    nombre: 'Sofitel Legend Santa Clara',
    ciudad: 'Cartagena',
    pais: 'Colombia',
    estrellas: 5,
    activo: true,
    descripcion:
      'Antiguo convento del siglo XVII convertido en hotel de lujo dentro de la ciudad amurallada.',
    direccion: 'Calle del Torno # 29-76, Cartagena',
    precio_noche: 890000,
    tiene_piscina: true,
    tiene_gimnasio: true,
    tiene_spa: true,
    permite_mascotas: false,
  },
  {
    id: 7,
    nombre: 'Hotel Abadía Colonial',
    ciudad: 'Cali',
    pais: 'Colombia',
    estrellas: 3,
    activo: true,
    descripcion:
      'Hotel colonial en el centro histórico ideal para viajeros de negocios y culturales.',
    direccion: 'Cra 4 # 7-99, Cali',
    precio_noche: 180000,
    tiene_piscina: false,
    tiene_gimnasio: false,
    tiene_spa: false,
    permite_mascotas: true,
  },
  {
    id: 8,
    nombre: 'Hilton Garden Inn Bogotá',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    estrellas: 4,
    activo: true,
    descripcion: 'Hotel moderno near Aeropuerto El Dorado, ideal para viajes de negocios.',
    direccion: 'Av. El Dorado # 69B-71, Bogotá',
    precio_noche: 290000,
    tiene_piscina: false,
    tiene_gimnasio: true,
    tiene_spa: false,
    permite_mascotas: false,
  },
];

const MOCK_ROOMS: Record<number, Room[]> = {
  1: [
    {
      id: 101,
      hotel_id: 1,
      nombre: 'Habitación Clásica',
      tipo: 'Estándar',
      capacidad: 2,
      disponible: true,
      precio_noche: 420000,
      moneda: 'COP',
    },
    {
      id: 102,
      hotel_id: 1,
      nombre: 'Suite Junior',
      tipo: 'Suite',
      capacidad: 3,
      disponible: true,
      precio_noche: 680000,
      moneda: 'COP',
    },
    {
      id: 103,
      hotel_id: 1,
      nombre: 'Suite Presidencial',
      tipo: 'Suite',
      capacidad: 4,
      disponible: false,
      precio_noche: 1200000,
      moneda: 'COP',
    },
  ],
  2: [
    {
      id: 201,
      hotel_id: 2,
      nombre: 'Deluxe Doble',
      tipo: 'Deluxe',
      capacidad: 2,
      disponible: true,
      precio_noche: 580000,
      moneda: 'COP',
    },
    {
      id: 202,
      hotel_id: 2,
      nombre: 'Suite Ejecutiva',
      tipo: 'Suite',
      capacidad: 2,
      disponible: true,
      precio_noche: 950000,
      moneda: 'COP',
    },
  ],
  3: [
    {
      id: 301,
      hotel_id: 3,
      nombre: 'Habitación Estándar',
      tipo: 'Estándar',
      capacidad: 2,
      disponible: true,
      precio_noche: 310000,
      moneda: 'COP',
    },
    {
      id: 302,
      hotel_id: 3,
      nombre: 'Habitación Superior',
      tipo: 'Superior',
      capacidad: 3,
      disponible: true,
      precio_noche: 420000,
      moneda: 'COP',
    },
  ],
  4: [
    {
      id: 401,
      hotel_id: 4,
      nombre: 'Lifestyle King',
      tipo: 'Deluxe',
      capacidad: 2,
      disponible: true,
      precio_noche: 490000,
      moneda: 'COP',
    },
    {
      id: 402,
      hotel_id: 4,
      nombre: 'Suite Rooftop',
      tipo: 'Suite',
      capacidad: 2,
      disponible: true,
      precio_noche: 890000,
      moneda: 'COP',
    },
  ],
  5: [
    {
      id: 501,
      hotel_id: 5,
      nombre: 'Habitación Vista Mar',
      tipo: 'Deluxe',
      capacidad: 2,
      disponible: true,
      precio_noche: 380000,
      moneda: 'COP',
    },
    {
      id: 502,
      hotel_id: 5,
      nombre: 'Suite Caribe',
      tipo: 'Suite',
      capacidad: 4,
      disponible: true,
      precio_noche: 720000,
      moneda: 'COP',
    },
  ],
  6: [
    {
      id: 601,
      hotel_id: 6,
      nombre: 'Habitación Claustro',
      tipo: 'Superior',
      capacidad: 2,
      disponible: true,
      precio_noche: 890000,
      moneda: 'COP',
    },
    {
      id: 602,
      hotel_id: 6,
      nombre: 'Suite Leyenda',
      tipo: 'Suite',
      capacidad: 2,
      disponible: false,
      precio_noche: 1800000,
      moneda: 'COP',
    },
  ],
  7: [
    {
      id: 701,
      hotel_id: 7,
      nombre: 'Habitación Sencilla',
      tipo: 'Estándar',
      capacidad: 1,
      disponible: true,
      precio_noche: 180000,
      moneda: 'COP',
    },
    {
      id: 702,
      hotel_id: 7,
      nombre: 'Habitación Doble',
      tipo: 'Estándar',
      capacidad: 2,
      disponible: true,
      precio_noche: 240000,
      moneda: 'COP',
    },
  ],
  8: [
    {
      id: 801,
      hotel_id: 8,
      nombre: 'King Business',
      tipo: 'Estándar',
      capacidad: 2,
      disponible: true,
      precio_noche: 290000,
      moneda: 'COP',
    },
    {
      id: 802,
      hotel_id: 8,
      nombre: 'Suite Corporativa',
      tipo: 'Suite',
      capacidad: 2,
      disponible: true,
      precio_noche: 480000,
      moneda: 'COP',
    },
  ],
};

function filterMockHotels(params: {
  ciudad?: string;
  nombre?: string;
  estrellas?: number;
  page?: number;
  per_page?: number;
}): HotelsResponse {
  let results = [...MOCK_HOTELS];
  if (params.ciudad) {
    const q = params.ciudad.toLowerCase();
    results = results.filter((h) => h.ciudad.toLowerCase().includes(q));
  }
  if (params.nombre) {
    const q = params.nombre.toLowerCase();
    results = results.filter((h) => h.nombre.toLowerCase().includes(q));
  }
  if (params.estrellas) {
    results = results.filter((h) => h.estrellas === params.estrellas);
  }
  const perPage = params.per_page || 10;
  const page = params.page || 1;
  const start = (page - 1) * perPage;
  const paginated = results.slice(start, start + perPage);
  return { total: results.length, page, per_page: perPage, hotels: paginated, hoteles: paginated };
}
// --------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private api: ApiService) {}

  getCities(): Observable<string[]> {
    return of(['Bogotá', 'Medellín', 'Cartagena', 'Cali', 'Barranquilla']);
  }

  getHotels(
    params: {
      ciudad?: string;
      nombre?: string;
      estrellas?: number;
      page?: number;
      per_page?: number;
    } = {},
  ): Observable<HotelsResponse> {
    return of(filterMockHotels(params));
  }

  getHotel(id: number): Observable<Hotel> {
    const hotel = MOCK_HOTELS.find((h) => h.id === id);
    return of(hotel ?? MOCK_HOTELS[0]);
  }

  getRooms(hotelId: number): Observable<Room[]> {
    return of(MOCK_ROOMS[hotelId] ?? MOCK_ROOMS[1]);
  }
}
