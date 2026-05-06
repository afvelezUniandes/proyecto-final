package com.uniandes.travelhub_android.data

// --- Auth ---
data class SignInRequest(val email: String, val password: String)
data class SignInResponse(val token: String)
data class SignUpRequest(
    val nombre: String,
    val email: String,
    val password: String
)

// --- Catalog ---
data class Hotel(
    val id: Int,
    val nombre: String,
    val ciudad: String,
    val pais: String,
    val estrellas: Int,
    val activo: Boolean,
    val descripcion: String? = null,
    val direccion: String? = null,
    val image_url: String? = null,
    val precio_noche: Double? = null,
    val tiene_piscina: Boolean? = null,
    val tiene_gimnasio: Boolean? = null,
    val tiene_spa: Boolean? = null,
    val permite_mascotas: Boolean? = null,
    val tiene_restaurante: Boolean? = null,
    val tiene_bar: Boolean? = null,
    val tiene_wifi: Boolean? = null,
    val tiene_parqueadero: Boolean? = null
)

data class HotelsResponse(
    val total: Int,
    val page: Int,
    val per_page: Int,
    val hotels: List<Hotel>
)

data class Room(
    val id: Int,
    val hotel_id: Int,
    val nombre: String,
    val tipo: String,
    val capacidad: Int,
    val precio_noche: Double,
    val moneda: String,
    val disponible: Boolean
)

// --- Reservas (API real) ---
data class ReservationApi(
    val id: Int,
    val usuario_id: Int,
    val habitacion_id: Int,
    val hotel_id: Int,
    val nombre_hotel: String? = null,
    val fecha_checkin: String,
    val fecha_checkout: String,
    val num_huespedes: Int,
    val fecha_creacion: String,
    val codigo: String,
    val monto_total: Double,
    val moneda: String,
    val estado: String   // "confirmada" | "cancelada" | "completada"
)

data class CreateReservationRequest(
    val habitacion_id: Int,
    val hotel_id: Int,
    val fecha_checkin: String,
    val fecha_checkout: String,
    val num_huespedes: Int,
    val monto_total: Double,
    val moneda: String = "COP"
)

// --- Reservas (UI local — para pantallas sin API) ---
data class Reservation(
    val id: String,
    val hotelName: String,
    val hotelColor: Long,
    val status: ReservationStatus,
    val city: String,
    val checkIn: String,
    val checkOut: String,
    val nights: Int,
    val totalCop: String,
    val roomType: String,
    val guests: String,
    val createdAt: String
)

enum class ReservationStatus { CONFIRMADA, COMPLETADA, CANCELADA }

// --- Perfil de usuario ---
data class UserProfile(
    val id: Int,
    val nombre: String,
    val email: String,
    val telefono: String,
    val pais: String,
    val idioma_preferido: String
)

data class UpdateProfileRequest(
    val nombre: String? = null,
    val email: String? = null,
    val telefono: String? = null,
    val pais: String? = null,
    val idioma_preferido: String? = null,
    val password: String? = null
)

// --- Disponibilidad ---
data class OccupiedRoomsResponse(
    val occupied_room_ids: List<Int>
)
