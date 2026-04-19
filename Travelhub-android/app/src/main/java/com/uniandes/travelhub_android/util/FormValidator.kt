package com.uniandes.travelhub_android.util

/**
 * Encapsula las secuencias de validación de los formularios de Login y Registro,
 * usando exactamente el mismo orden de reglas que aplican las pantallas.
 *
 * Al centralizar la lógica aquí se pueden escribir unit-tests puros (sin Android,
 * sin emulador) que corren en CI con `./gradlew testDebugUnitTest`.
 */

sealed class LoginFormError {
    object EmptyFields : LoginFormError()
    object InvalidEmail : LoginFormError()
}

sealed class RegisterFormError {
    object EmptyFields : RegisterFormError()
    object InvalidEmail : RegisterFormError()
    object WeakPassword : RegisterFormError()
    object PasswordMismatch : RegisterFormError()
}

object FormValidator {

    /**
     * Valida los campos del formulario de login en el mismo orden
     * que aplica [LoginScreen]:
     * 1. Campos vacíos
     * 2. Formato de email inválido
     *
     * @return [LoginFormError] si hay un error, null si todo es válido.
     */
    fun validateLogin(email: String, password: String): LoginFormError? = when {
        ValidationUtils.isEmptyFields(email, password) -> LoginFormError.EmptyFields
        !ValidationUtils.isValidEmail(email)           -> LoginFormError.InvalidEmail
        else                                           -> null
    }

    /**
     * Valida los campos del formulario de registro en el mismo orden
     * que aplica [RegisterScreen]:
     * 1. Campos vacíos (nombre, email, password — confirmPassword se valida aparte)
     * 2. Formato de email inválido
     * 3. Contraseñas no coinciden
     *
     * @return [RegisterFormError] si hay un error, null si todo es válido.
     */
    fun validateRegister(
        nombre: String,
        email: String,
        password: String,
        confirmPassword: String
    ): RegisterFormError? = when {
        ValidationUtils.isEmptyFields(nombre, email, password) -> RegisterFormError.EmptyFields
        !ValidationUtils.isValidEmail(email)                   -> RegisterFormError.InvalidEmail
        !ValidationUtils.isValidPassword(password)             -> RegisterFormError.WeakPassword
        !ValidationUtils.passwordsMatch(password, confirmPassword) -> RegisterFormError.PasswordMismatch
        else                                                   -> null
    }
}
