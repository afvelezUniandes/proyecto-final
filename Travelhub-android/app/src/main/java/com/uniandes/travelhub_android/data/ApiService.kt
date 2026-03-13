package com.uniandes.travelhub_android.data

import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @POST("/auth/sign-in")
    suspend fun signIn(@Body request: SignInRequest): Response<SignInResponse>

    @GET("/catalog/hotels")
    suspend fun getHotels(
        @Query("ciudad") ciudad: String? = null,
        @Query("nombre") nombre: String? = null,
        @Query("estrellas") estrellas: Int? = null,
        @Query("page") page: Int = 1,
        @Query("per_page") perPage: Int = 20
    ): Response<HotelsResponse>

    @GET("/catalog/rooms")
    suspend fun getRooms(
        @Query("hotel_id") hotelId: Int
    ): Response<List<Room>>

    // Reservation endpoints (requieren Authorization header)
    @GET("/reservations")
    suspend fun getReservations(
        @Header("Authorization") token: String,
        @Query("estado") estado: String? = null
    ): Response<List<ReservationApi>>

    @GET("/reservations/{id}")
    suspend fun getReservation(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Response<ReservationApi>

    @POST("/reservations")
    suspend fun createReservation(
        @Header("Authorization") token: String,
        @Body request: CreateReservationRequest
    ): Response<ReservationApi>

    @PATCH("/reservations/{id}/cancel")
    suspend fun cancelReservation(
        @Header("Authorization") token: String,
        @Path("id") id: Int
    ): Response<ReservationApi>
}
