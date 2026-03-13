package com.uniandes.travelhub_android.data

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

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
}
