package com.uniandes.travelhub_android.util

import java.text.SimpleDateFormat
import java.util.Locale

object DateUtils {

    private val fmt = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun nightsBetween(fechaCheckin: String, fechaCheckout: String): Int {
        return try {
            val d1 = fmt.parse(fechaCheckin) ?: return 0
            val d2 = fmt.parse(fechaCheckout) ?: return 0
            val diff = d2.time - d1.time
            if (diff <= 0) 0 else (diff / (1000L * 60 * 60 * 24)).toInt()
        } catch (e: Exception) {
            0
        }
    }

    fun isValidDateRange(checkIn: String, checkOut: String): Boolean {
        return nightsBetween(checkIn, checkOut) > 0
    }
}
