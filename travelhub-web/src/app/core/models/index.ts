export interface Hotel {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
  estrellas: number;
  activo: boolean;
  descripcion?: string;
  direccion?: string;
  image_url?: string;
  precio_noche?: number;
  tiene_piscina?: boolean;
  tiene_gimnasio?: boolean;
  tiene_spa?: boolean;
  permite_mascotas?: boolean;
}

export interface HotelsResponse {
  total: number;
  page: number;
  per_page: number;
  hotels: Hotel[];
  hoteles?: Hotel[];
}

export interface Room {
  id: number;
  hotel_id: number;
  nombre: string;
  tipo: string;
  capacidad: number;
  disponible: boolean;
  precio_noche: number;
  moneda: string;
  imagen_url?: string;
}

export interface Reservation {
  id: number;
  usuario_id?: number;
  habitacion_id: number;
  hotel_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  fecha_checkin?: string;
  fecha_checkout?: string;
  num_huespedes?: number;
  adultos?: number;
  ninos?: number;
  fecha_creacion?: string;
  codigo?: string;
  total?: number;
  monto_total?: number;
  moneda?: string;
  estado: string;
}

export interface CreateReservationRequest {
  habitacion_id: number;
  hotel_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  fecha_checkin?: string;
  fecha_checkout?: string;
  adultos?: number;
  ninos?: number;
  num_huespedes?: number;
  monto_total?: number;
  moneda?: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  idioma_preferido?: string;
  rol?: string;
}

export interface AuthResponse {
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  nombre: string;
  email: string;
  password: string;
}
