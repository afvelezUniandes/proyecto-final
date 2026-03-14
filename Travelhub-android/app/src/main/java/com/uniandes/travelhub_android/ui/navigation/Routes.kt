package com.uniandes.travelhub_android.ui.navigation

import android.net.Uri

object Routes {
    const val LOGIN = "login"
    const val REGISTER = "register"
    const val HOME = "home"
    const val HOTEL_DETAIL = "hotel_detail/{hotelId}?checkIn={checkIn}&checkOut={checkOut}&adultos={adultos}&ninos={ninos}"
    const val RESERVATIONS = "reservations"
    const val RESERVATION_DETAIL = "reservation_detail/{reservationId}"
    const val PROFILE = "profile"
    const val SEARCH = "search?ciudad={ciudad}&checkIn={checkIn}&checkOut={checkOut}&adultos={adultos}&ninos={ninos}"

    fun hotelDetail(
        hotelId: Int,
        checkIn: String = "",
        checkOut: String = "",
        adultos: Int = 2,
        ninos: Int = 0
    ) = "hotel_detail/$hotelId?checkIn=$checkIn&checkOut=$checkOut&adultos=$adultos&ninos=$ninos"

    fun reservationDetail(reservationId: String) = "reservation_detail/$reservationId"

    fun search(
        ciudad: String = "",
        checkIn: String = "",
        checkOut: String = "",
        adultos: Int = 2,
        ninos: Int = 0
    ) = "search?ciudad=${Uri.encode(ciudad)}&checkIn=$checkIn&checkOut=$checkOut&adultos=$adultos&ninos=$ninos"
}
