package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.uniandes.travelhub_android.data.ApiClient
import com.uniandes.travelhub_android.data.Hotel
import com.uniandes.travelhub_android.ui.components.BottomNavBar
import com.uniandes.travelhub_android.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun SearchScreen(
    ciudad: String,
    checkIn: String,
    checkOut: String,
    adultos: Int,
    ninos: Int,
    onBack: () -> Unit,
    onHotelClick: (hotelId: Int, checkIn: String, checkOut: String, adultos: Int, ninos: Int) -> Unit,
    onHomeClick: () -> Unit,
    onReservationsClick: () -> Unit,
    onNotificationsClick: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var hotels by remember { mutableStateOf<List<Hotel>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var selectedFilter by remember { mutableStateOf("Estrellas") }

    fun loadHotels() {
        scope.launch {
            isLoading = true
            errorMsg = null
            try {
                val resp = ApiClient.api.getHotels(ciudad = ciudad.ifBlank { null })
                if (resp.isSuccessful) {
                    val result = resp.body()?.hotels ?: emptyList()
                    hotels = when (selectedFilter) {
                        "Precio (↑)" -> result.sortedBy { it.estrellas }
                        "Precio (↓)" -> result.sortedByDescending { it.estrellas }
                        else -> result.sortedByDescending { it.estrellas }
                    }
                } else {
                    errorMsg = "Error al cargar hoteles (${resp.code()})"
                }
            } catch (e: Exception) {
                errorMsg = "Sin conexión al servidor"
            }
            isLoading = false
        }
    }

    LaunchedEffect(Unit) { loadHotels() }

    Scaffold(
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            BottomNavBar(
                selected = "Buscar",
                onHomeClick = onHomeClick,
                onSearchClick = {},
                onReservationsClick = onReservationsClick,
                onNotificationsClick = onNotificationsClick
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(TravelBackground)
                .padding(bottom = padding.calculateBottomPadding())
        ) {
            // Header azul compacto con back + resumen
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(TravelBlue)
                    .statusBarsPadding()
                    .padding(horizontal = 4.dp, vertical = 12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) {
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Volver",
                            tint = Color.White
                        )
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Column {
                        Text(
                            text = if (ciudad.isNotBlank()) ciudad else "Todos los destinos",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        val guests = adultos + ninos
                        Text(
                            text = buildString {
                                if (checkIn.isNotBlank() && checkOut.isNotBlank()) append("$checkIn → $checkOut · ")
                                append("$guests ${if (guests == 1) "huésped" else "huéspedes"}")
                            },
                            color = Color.White.copy(alpha = 0.85f),
                            fontSize = 12.sp
                        )
                    }
                }
            }

            // Filtros + resultados
            LazyColumn(modifier = Modifier.fillMaxSize()) {
                item {
                    Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp)) {
                        if (!isLoading) {
                            Text(
                                text = if (errorMsg == null) "${hotels.size} hospedajes encontrados" else "",
                                fontSize = 13.sp,
                                color = TravelGray
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            items(listOf("Estrellas", "Precio (↑)", "Precio (↓)")) { filter ->
                                FilterChip(
                                    selected = selectedFilter == filter,
                                    onClick = {
                                        selectedFilter = filter
                                        loadHotels()
                                    },
                                    label = { Text(filter, fontSize = 13.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = TravelBlue,
                                        selectedLabelColor = Color.White
                                    )
                                )
                            }
                        }
                    }
                }

                if (isLoading) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(40.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(color = TravelBlue)
                        }
                    }
                } else if (errorMsg != null) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(40.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(errorMsg!!, color = TravelRed, fontSize = 14.sp)
                        }
                    }
                } else if (hotels.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(40.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(
                                    Icons.Default.SearchOff,
                                    contentDescription = null,
                                    tint = TravelGrayLight,
                                    modifier = Modifier.size(64.dp)
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text("No se encontraron hoteles", color = TravelGray, fontSize = 15.sp)
                            }
                        }
                    }
                } else {
                    items(hotels) { hotel ->
                        HotelCard(
                            hotel = hotel,
                            onClick = { onHotelClick(hotel.id, checkIn, checkOut, adultos, ninos) }
                        )
                    }
                }
            }
        }
    }
}
