package com.uniandes.travelhub_android.data

// --- Auth ---
data class SignInRequest(val email: String, val password: String)
data class SignInResponse(val token: String)

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
    val image_url: String? = null
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

// --- Notificaciones (mock) ---
data class Notification(
    val id: String,
    val title: String,
    val body: String,
    val subtitle: String,
    val type: NotificationType,
    val isRead: Boolean,
    val isToday: Boolean
)

enum class NotificationType { CONFIRMED, EMAIL, CREATED, CANCELLED, COMPLETED }

// --- Disponibilidad ---
data class OccupiedRoomsResponse(
    val occupied_room_ids: List<Int>
)
