package com.uniandes.travelhub_android.util

import com.uniandes.travelhub_android.data.Hotel

object SearchUtils {

    const val FILTER_STARS = "stars"
    const val FILTER_PRICE_ASC = "price_asc"
    const val FILTER_PRICE_DESC = "price_desc"

    fun applyFilter(hotels: List<Hotel>, filter: String): List<Hotel> = when (filter) {
        FILTER_PRICE_ASC  -> hotels.sortedBy { it.precio_noche ?: 0.0 }
        FILTER_PRICE_DESC -> hotels.sortedByDescending { it.precio_noche ?: 0.0 }
        else              -> hotels.sortedByDescending { it.estrellas } // FILTER_STARS default
    }

    fun nightsLabel(nights: Int, singular: String, plural: String): String =
        "$nights ${if (nights == 1) singular else plural}"

    fun guestLabel(guests: Int, singular: String, plural: String): String =
        "$guests ${if (guests == 1) singular else plural}"
}
