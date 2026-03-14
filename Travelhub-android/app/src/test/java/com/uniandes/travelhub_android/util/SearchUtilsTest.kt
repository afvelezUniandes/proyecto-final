package com.uniandes.travelhub_android.util

import com.uniandes.travelhub_android.data.Hotel
import org.junit.Assert.*
import org.junit.Test

class SearchUtilsTest {

    private fun hotel(id: Int, estrellas: Int) = Hotel(
        id = id,
        nombre = "Hotel $id",
        ciudad = "Bogotá",
        pais = "Colombia",
        estrellas = estrellas,
        activo = true
    )

    private val hotels = listOf(
        hotel(1, 3),
        hotel(2, 5),
        hotel(3, 1),
        hotel(4, 4)
    )

    // --- applyFilter ---

    @Test
    fun `FILTER_STARS sorts by stars descending`() {
        val result = SearchUtils.applyFilter(hotels, SearchUtils.FILTER_STARS)
        assertEquals(listOf(5, 4, 3, 1), result.map { it.estrellas })
    }

    @Test
    fun `FILTER_PRICE_DESC sorts by stars descending`() {
        val result = SearchUtils.applyFilter(hotels, SearchUtils.FILTER_PRICE_DESC)
        assertEquals(listOf(5, 4, 3, 1), result.map { it.estrellas })
    }

    @Test
    fun `FILTER_PRICE_ASC sorts by stars ascending`() {
        val result = SearchUtils.applyFilter(hotels, SearchUtils.FILTER_PRICE_ASC)
        assertEquals(listOf(1, 3, 4, 5), result.map { it.estrellas })
    }

    @Test
    fun `unknown filter defaults to stars descending`() {
        val result = SearchUtils.applyFilter(hotels, "unknown_filter")
        assertEquals(listOf(5, 4, 3, 1), result.map { it.estrellas })
    }

    @Test
    fun `empty list returns empty list`() {
        val result = SearchUtils.applyFilter(emptyList(), SearchUtils.FILTER_STARS)
        assertTrue(result.isEmpty())
    }

    @Test
    fun `single hotel list returns same hotel`() {
        val single = listOf(hotel(1, 3))
        val result = SearchUtils.applyFilter(single, SearchUtils.FILTER_STARS)
        assertEquals(1, result.size)
        assertEquals(1, result[0].id)
    }

    // --- nightsLabel ---

    @Test
    fun `one night uses singular`() {
        assertEquals("1 noche", SearchUtils.nightsLabel(1, "noche", "noches"))
    }

    @Test
    fun `two nights uses plural`() {
        assertEquals("2 noches", SearchUtils.nightsLabel(2, "noche", "noches"))
    }

    @Test
    fun `zero nights uses plural`() {
        assertEquals("0 noches", SearchUtils.nightsLabel(0, "noche", "noches"))
    }

    @Test
    fun `seven nights uses plural`() {
        assertEquals("7 nights", SearchUtils.nightsLabel(7, "night", "nights"))
    }

    // --- guestLabel ---

    @Test
    fun `one guest uses singular`() {
        assertEquals("1 huésped", SearchUtils.guestLabel(1, "huésped", "huéspedes"))
    }

    @Test
    fun `two guests uses plural`() {
        assertEquals("2 huéspedes", SearchUtils.guestLabel(2, "huésped", "huéspedes"))
    }

    @Test
    fun `zero guests uses plural`() {
        assertEquals("0 guests", SearchUtils.guestLabel(0, "guest", "guests"))
    }

    @Test
    fun `one guest in english uses singular`() {
        assertEquals("1 guest", SearchUtils.guestLabel(1, "guest", "guests"))
    }
}
