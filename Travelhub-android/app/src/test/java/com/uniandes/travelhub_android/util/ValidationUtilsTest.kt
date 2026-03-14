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
    fun `password of exactly 6 chars is valid`() {
        assertTrue(ValidationUtils.isValidPassword("abcdef"))
    }

    @Test
    fun `password longer than 6 chars is valid`() {
        assertTrue(ValidationUtils.isValidPassword("strongPassword1!"))
    }

    @Test
    fun `password of 5 chars is invalid`() {
        assertFalse(ValidationUtils.isValidPassword("abcde"))
    }

    @Test
    fun `empty password is invalid`() {
        assertFalse(ValidationUtils.isValidPassword(""))
    }
}
