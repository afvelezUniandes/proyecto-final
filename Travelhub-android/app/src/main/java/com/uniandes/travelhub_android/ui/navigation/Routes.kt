package com.uniandes.travelhub_android.ui.navigation

object Routes {
    const val LOGIN = "login"
    const val HOME = "home"
    const val HOTEL_DETAIL = "hotel_detail/{hotelId}"
    const val RESERVATIONS = "reservations"
    const val RESERVATION_DETAIL = "reservation_detail/{reservationId}"
    const val NOTIFICATIONS = "notifications"

    fun hotelDetail(hotelId: Int) = "hotel_detail/$hotelId"
    fun reservationDetail(reservationId: String) = "reservation_detail/$reservationId"
}
