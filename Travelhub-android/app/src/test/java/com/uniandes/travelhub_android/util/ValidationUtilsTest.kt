package com.uniandes.travelhub_android.util

import org.junit.Assert.*
import org.junit.Test

class ValidationUtilsTest {

    // --- isValidEmail ---

    @Test
    fun `valid email passes`() {
        assertTrue(ValidationUtils.isValidEmail("user@example.com"))
    }

    @Test
    fun `valid email with plus sign passes`() {
        assertTrue(ValidationUtils.isValidEmail("user+tag@domain.org"))
    }

    @Test
    fun `valid email with subdomain passes`() {
        assertTrue(ValidationUtils.isValidEmail("user@mail.example.co"))
    }

    @Test
    fun `email with leading spaces is trimmed and passes`() {
        assertTrue(ValidationUtils.isValidEmail("  user@example.com  "))
    }

    @Test
    fun `email missing at sign fails`() {
        assertFalse(ValidationUtils.isValidEmail("userexample.com"))
    }

    @Test
    fun `email missing domain fails`() {
        assertFalse(ValidationUtils.isValidEmail("user@"))
    }

    @Test
    fun `email missing local part fails`() {
        assertFalse(ValidationUtils.isValidEmail("@example.com"))
    }

    @Test
    fun `email with single char TLD fails`() {
        assertFalse(ValidationUtils.isValidEmail("user@example.c"))
    }

    @Test
    fun `blank email fails`() {
        assertFalse(ValidationUtils.isValidEmail(""))
    }

    // --- isEmptyFields ---

    @Test
    fun `no empty fields returns false`() {
        assertFalse(ValidationUtils.isEmptyFields("hello", "world"))
    }

    @Test
    fun `one blank field returns true`() {
        assertTrue(ValidationUtils.isEmptyFields("hello", "  ", "world"))
    }

    @Test
    fun `all blank fields returns true`() {
        assertTrue(ValidationUtils.isEmptyFields("", " ", "\t"))
    }

    @Test
    fun `single non-blank field returns false`() {
        assertFalse(ValidationUtils.isEmptyFields("data"))
    }

    @Test
    fun `single blank field returns true`() {
        assertTrue(ValidationUtils.isEmptyFields(""))
    }

    // --- passwordsMatch ---

    @Test
    fun `identical passwords match`() {
        assertTrue(ValidationUtils.passwordsMatch("Secret123", "Secret123"))
    }

    @Test
    fun `different passwords do not match`() {
        assertFalse(ValidationUtils.passwordsMatch("Secret123", "secret123"))
    }

    @Test
    fun `both empty passwords match`() {
        assertTrue(ValidationUtils.passwordsMatch("", ""))
    }

    @Test
    fun `one empty password does not match`() {
        assertFalse(ValidationUtils.passwordsMatch("abc", ""))
    }

    // --- isValidPassword ---

    @Test
    fun `valid password with all requirements passes`() {
        assertTrue(ValidationUtils.isValidPassword("Secure@123"))
    }

    @Test
    fun `valid password exactly 8 chars passes`() {
        assertTrue(ValidationUtils.isValidPassword("Secret1!"))
    }

    @Test
    fun `password with multiple special chars passes`() {
        assertTrue(ValidationUtils.isValidPassword("P@ssw0rd!!"))
    }

    @Test
    fun `password shorter than 8 chars fails`() {
        assertFalse(ValidationUtils.isValidPassword("Sec@1"))
    }

    @Test
    fun `password of exactly 7 chars fails`() {
        assertFalse(ValidationUtils.isValidPassword("Secur1!"))
    }

    @Test
    fun `password without uppercase fails`() {
        assertFalse(ValidationUtils.isValidPassword("secure@123"))
    }

    @Test
    fun `password without digit fails`() {
        assertFalse(ValidationUtils.isValidPassword("Secure@abc"))
    }

    @Test
    fun `password without special character fails`() {
        assertFalse(ValidationUtils.isValidPassword("Secure1234"))
    }

    @Test
    fun `empty password is invalid`() {
        assertFalse(ValidationUtils.isValidPassword(""))
    }
}
