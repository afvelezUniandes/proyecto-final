export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  rol?: string;
  hotel_id?: number;
}

export interface AuthResponse {
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface HotelStats {
  reservas_activas: number;
  reservas_activas_delta: number;
  tasa_ocupacion: number;
  tasa_ocupacion_delta: number;
  ingresos_mes: number;
  ingresos_mes_delta: number;
  calificacion_promedio: number;
  total_resenas: number;
}

export interface HotelReservation {
  id: number;
  codigo: string;
  usuario_id?: number;
  habitacion_id?: number;
  hotel_id?: number;
  fecha_checkin: string;
  fecha_checkout: string;
  num_huespedes: number;
  fecha_creacion: string;
  fecha_cancelacion?: string;
  monto_total: number;
  moneda: string;
  estado: 'confirmada' | 'cancelada' | 'completada';
  // Campos enriquecidos por el gateway (requiere gateway actualizado)
  huesped_nombre?: string;
  huesped_email?: string;
  huesped_telefono?: string;
  huesped_pais?: string;
  huesped_idioma?: string;
  habitacion_nombre?: string;
  precio_noche?: number;
  noches?: number;
}

export interface Hotel {
  id: number;
  admin_id?: number;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  ciudad: string;
  pais: string;
  estrellas?: number;
  activo?: boolean;
  image_url?: string;
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
  descripcion?: string;
  imagen_url?: string;
}

export interface WeeklyOccupancy {
  dia: string;
  porcentaje: number;
}

export interface RevenueByRoom {
  tipo: string;
  monto: number;
}
