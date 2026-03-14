package com.uniandes.travelhub_android.ui.navigation

object Routes {
    const val LOGIN = "login"
    const val HOME = "home"
    const val HOTEL_DETAIL = "hotel_detail/{hotelId}?checkIn={checkIn}&checkOut={checkOut}&adultos={adultos}&ninos={ninos}"
    const val RESERVATIONS = "reservations"
    const val RESERVATION_DETAIL = "reservation_detail/{reservationId}"
    const val NOTIFICATIONS = "notifications"

    fun hotelDetail(
        hotelId: Int,
        checkIn: String = "",
        checkOut: String = "",
        adultos: Int = 2,
        ninos: Int = 0
    ) = "hotel_detail/$hotelId?checkIn=$checkIn&checkOut=$checkOut&adultos=$adultos&ninos=$ninos"

    fun reservationDetail(reservationId: String) = "reservation_detail/$reservationId"
}
