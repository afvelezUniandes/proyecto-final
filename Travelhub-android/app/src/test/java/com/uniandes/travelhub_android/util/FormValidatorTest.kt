package com.uniandes.travelhub_android.util

import org.junit.Assert.*
import org.junit.Test

class FormValidatorTest {

    // =========================================================
    // validateLogin
    // =========================================================

    // --- Campos vacíos ---

    @Test
    fun `login - both fields empty returns EmptyFields`() {
        val result = FormValidator.validateLogin("", "")
        assertEquals(LoginFormError.EmptyFields, result)
    }

    @Test
    fun `login - email empty returns EmptyFields`() {
        val result = FormValidator.validateLogin("", "password123")
        assertEquals(LoginFormError.EmptyFields, result)
    }

    @Test
    fun `login - password empty returns EmptyFields`() {
        val result = FormValidator.validateLogin("user@example.com", "")
        assertEquals(LoginFormError.EmptyFields, result)
    }

    @Test
    fun `login - email whitespace only returns EmptyFields`() {
        val result = FormValidator.validateLogin("   ", "password123")
        assertEquals(LoginFormError.EmptyFields, result)
    }

    @Test
    fun `login - password whitespace only returns EmptyFields`() {
        val result = FormValidator.validateLogin("user@example.com", "   ")
        assertEquals(LoginFormError.EmptyFields, result)
    }

    // --- Email inválido (campos no vacíos) ---

    @Test
    fun `login - invalid email format returns InvalidEmail`() {
        val result = FormValidator.validateLogin("not-an-email", "password123")
        assertEquals(LoginFormError.InvalidEmail, result)
    }

    @Test
    fun `login - email missing at sign returns InvalidEmail`() {
        val result = FormValidator.validateLogin("userexample.com", "password123")
        assertEquals(LoginFormError.InvalidEmail, result)
    }

    @Test
    fun `login - email missing domain returns InvalidEmail`() {
        val result = FormValidator.validateLogin("user@", "password123")
        assertEquals(LoginFormError.InvalidEmail, result)
    }

    @Test
    fun `login - email with single char TLD returns InvalidEmail`() {
        val result = FormValidator.validateLogin("user@example.c", "password123")
        assertEquals(LoginFormError.InvalidEmail, result)
    }

    // --- Datos válidos ---

    @Test
    fun `login - valid email and password returns null`() {
        val result = FormValidator.validateLogin("user@example.com", "password123")
        assertNull(result)
    }

    @Test
    fun `login - valid email with plus sign returns null`() {
        val result = FormValidator.validateLogin("user+tag@domain.org", "mypassword")
        assertNull(result)
    }

    @Test
    fun `login - minimum password length with valid email returns null`() {
        val result = FormValidator.validateLogin("user@example.com", "abcdef")
        assertNull(result)
    }

    // --- EmptyFields tiene prioridad sobre InvalidEmail ---

    @Test
    fun `login - empty password beats invalid email - returns EmptyFields`() {
        // invalid email AND empty password: EmptyFields must be returned first
        val result = FormValidator.validateLogin("not-an-email", "")
        assertEquals(LoginFormError.EmptyFields, result)
    }

    // =========================================================
    // validateRegister
    // =========================================================

    // --- Campos vacíos ---

    @Test
    fun `register - all fields empty returns EmptyFields`() {
        val result = FormValidator.validateRegister("", "", "", "")
        assertEquals(RegisterFormError.EmptyFields, result)
    }

    @Test
    fun `register - nombre empty returns EmptyFields`() {
        val result = FormValidator.validateRegister("", "user@example.com", "password123", "password123")
        assertEquals(RegisterFormError.EmptyFields, result)
    }

    @Test
    fun `register - email empty returns EmptyFields`() {
        val result = FormValidator.validateRegister("Juan", "", "password123", "password123")
        assertEquals(RegisterFormError.EmptyFields, result)
    }

    @Test
    fun `register - password empty returns EmptyFields`() {
        val result = FormValidator.validateRegister("Juan", "user@example.com", "", "")
        assertEquals(RegisterFormError.EmptyFields, result)
    }

    @Test
    fun `register - nombre whitespace only returns EmptyFields`() {
        val result = FormValidator.validateRegister("   ", "user@example.com", "password123", "password123")
        assertEquals(RegisterFormError.EmptyFields, result)
    }

    // Nota: confirmPassword NO se incluye en isEmptyFields (igual que la pantalla)
    @Test
    fun `register - only confirmPassword empty does NOT return EmptyFields when others are valid`() {
        val result = FormValidator.validateRegister("Juan", "user@example.com", "password123", "")
        // confirmPassword vacío → no es EmptyFields, sino PasswordMismatch
        assertNotEquals(RegisterFormError.EmptyFields, result)
    }

    // --- Email inválido ---

    @Test
    fun `register - invalid email returns InvalidEmail`() {
        val result = FormValidator.validateRegister("Juan", "not-an-email", "password123", "password123")
        assertEquals(RegisterFormError.InvalidEmail, result)
    }

    @Test
    fun `register - email missing at sign returns InvalidEmail`() {
        val result = FormValidator.validateRegister("Juan", "juanexample.com", "password123", "password123")
        assertEquals(RegisterFormError.InvalidEmail, result)
    }

    @Test
    fun `register - email missing local part returns InvalidEmail`() {
        val result = FormValidator.validateRegister("Juan", "@example.com", "password123", "password123")
        assertEquals(RegisterFormError.InvalidEmail, result)
    }

    // --- Contraseñas no coinciden ---

    @Test
    fun `register - passwords do not match returns PasswordMismatch`() {
        val result = FormValidator.validateRegister("Juan", "user@example.com", "password123", "different")
        assertEquals(RegisterFormError.PasswordMismatch, result)
    }

    @Test
    fun `register - confirmPassword empty while password filled returns PasswordMismatch`() {
        val result = FormValidator.validateRegister("Juan", "user@example.com", "password123", "")
        assertEquals(RegisterFormError.PasswordMismatch, result)
    }

    @Test
    fun `register - passwords differ only in case returns PasswordMismatch`() {
        val result = FormValidator.validateRegister("Juan", "user@example.com", "Password123", "password123")
        assertEquals(RegisterFormError.PasswordMismatch, result)
    }

    // --- Datos válidos ---

    @Test
    fun `register - all fields valid returns null`() {
        val result = FormValidator.validateRegister("Juan Pérez", "juan@example.com", "secure123", "secure123")
        assertNull(result)
    }

    @Test
    fun `register - valid with plus sign email returns null`() {
        val result = FormValidator.validateRegister("Ana", "ana+test@domain.org", "mypassword", "mypassword")
        assertNull(result)
    }

    @Test
    fun `register - passwords match with special characters returns null`() {
        val pass = "P@" + "ssw0rd!"
        val result = FormValidator.validateRegister("Pedro", "pedro@example.com", pass, pass)
        assertNull(result)
    }

    // --- Prioridad de errores ---

    @Test
    fun `register - EmptyFields has priority over InvalidEmail`() {
        val result = FormValidator.validateRegister("", "not-an-email", "password", "password")
        assertEquals(RegisterFormError.EmptyFields, result)
    }

    @Test
    fun `register - InvalidEmail has priority over PasswordMismatch`() {
        val result = FormValidator.validateRegister("Juan", "not-an-email", "password", "different")
        assertEquals(RegisterFormError.InvalidEmail, result)
    }
}
