package com.uniandes.travelhub_android.util

object ValidationUtils {

    private val EMAIL_REGEX = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")

    fun isValidEmail(email: String): Boolean = EMAIL_REGEX.matches(email.trim())

    fun isEmptyFields(vararg fields: String): Boolean = fields.any { it.isBlank() }

    fun passwordsMatch(password: String, confirm: String): Boolean = password == confirm

    fun isValidPassword(password: String): Boolean = password.length >= 6
}
