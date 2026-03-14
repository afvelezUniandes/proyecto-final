package com.uniandes.travelhub_android.util

import org.junit.Assert.*
import org.junit.Test

class DateUtilsTest {

    // --- nightsBetween ---

    @Test
    fun `one night stay returns 1`() {
        assertEquals(1, DateUtils.nightsBetween("2025-06-01", "2025-06-02"))
    }

    @Test
    fun `seven night stay returns 7`() {
        assertEquals(7, DateUtils.nightsBetween("2025-06-01", "2025-06-08"))
    }

    @Test
    fun `same date returns 0`() {
        assertEquals(0, DateUtils.nightsBetween("2025-06-01", "2025-06-01"))
    }

    @Test
    fun `checkout before checkin returns 0`() {
        assertEquals(0, DateUtils.nightsBetween("2025-06-05", "2025-06-01"))
    }

    @Test
    fun `invalid date string returns 0`() {
        assertEquals(0, DateUtils.nightsBetween("not-a-date", "2025-06-02"))
    }

    @Test
    fun `blank dates return 0`() {
        assertEquals(0, DateUtils.nightsBetween("", ""))
    }

    @Test
    fun `cross month boundary is calculated correctly`() {
        assertEquals(3, DateUtils.nightsBetween("2025-05-30", "2025-06-02"))
    }

    @Test
    fun `cross year boundary is calculated correctly`() {
        assertEquals(2, DateUtils.nightsBetween("2025-12-31", "2026-01-02"))
    }

    @Test
    fun `30 night stay returns 30`() {
        assertEquals(30, DateUtils.nightsBetween("2025-06-01", "2025-07-01"))
    }

    // --- isValidDateRange ---

    @Test
    fun `valid range with checkout after checkin returns true`() {
        assertTrue(DateUtils.isValidDateRange("2025-06-01", "2025-06-05"))
    }

    @Test
    fun `same day range is invalid`() {
        assertFalse(DateUtils.isValidDateRange("2025-06-01", "2025-06-01"))
    }

    @Test
    fun `reversed dates are invalid`() {
        assertFalse(DateUtils.isValidDateRange("2025-06-10", "2025-06-05"))
    }

    @Test
    fun `invalid format date range is invalid`() {
        assertFalse(DateUtils.isValidDateRange("not-a-date", "2025-06-05"))
    }
}
