package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.uniandes.travelhub_android.data.ApiClient
import com.uniandes.travelhub_android.data.CreateReservationRequest
import com.uniandes.travelhub_android.data.Room
import com.uniandes.travelhub_android.data.TokenStore
import com.uniandes.travelhub_android.ui.theme.*
import kotlinx.coroutines.launch

private val amenidades = listOf("WiFi", "Piscina", "Gym", "Restaurante", "Spa", "Bar")

private val reviews = listOf(
    Triple("Maria C.", 5, "Feb 2026"),
    Triple("Carlos M.", 4, "Ene 2026"),
    Triple("Ana P.", 5, "Mar 2026")
)

@Composable
fun HotelDetailScreen(
    hotelId: Int,
    checkIn: String,
    checkOut: String,
    numHuespedes: Int,
    onBack: () -> Unit,
    onReserveDone: () -> Unit
) {
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    var rooms by remember { mutableStateOf<List<Room>>(emptyList()) }
    var occupiedIds by remember { mutableStateOf<Set<Int>>(emptySet()) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedRoom by remember { mutableStateOf<Room?>(null) }
    var isReserving by remember { mutableStateOf(false) }
    var reserveError by remember { mutableStateOf<String?>(null) }

    // Datos mock del hotel (en una app real vendría del API)
    val hotelColors = listOf(
        Color(0xFFDBEAFE), Color(0xFFFEF3C7), Color(0xFFDCFCE7),
        Color(0xFFEDE9FE), Color(0xFFFFE4E6)
    )
    val hotelColor = hotelColors[hotelId % hotelColors.size]

    LaunchedEffect(hotelId) {
        scope.launch {
            try {
                // Cargar habitaciones
                val roomsResp = ApiClient.api.getRooms(hotelId)
                if (roomsResp.isSuccessful) {
                    rooms = roomsResp.body() ?: emptyList()
                    selectedRoom = rooms.firstOrNull { it.disponible }
                }
                // Cargar habitaciones ocupadas si hay fechas
                if (checkIn.isNotBlank() && checkOut.isNotBlank()) {
                    try {
                        val occResp = ApiClient.api.getOccupiedRooms(hotelId, checkIn, checkOut)
                        if (occResp.isSuccessful) {
                            occupiedIds = occResp.body()?.occupied_room_ids?.toSet() ?: emptySet()
                        }
                    } catch (_: Exception) { /* no bloquear si falla disponibilidad */ }
                }
            } catch (_: Exception) {
            } finally {
                isLoading = false
            }
        }
    }

    val availableRooms = rooms.filter { it.disponible && it.id !in occupiedIds }
    val nights = nightsBetween(checkIn, checkOut).takeIf { it > 0 } ?: 1
    val precioNoche = selectedRoom?.precio_noche?.toInt() ?: 0
    val total = precioNoche * nights

    Scaffold(
        bottomBar = {
            Surface(shadowElevation = 8.dp) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(horizontal = 20.dp, vertical = 12.dp)
                ) {
                    if (reserveError != null) {
                        Text(
                            reserveError!!,
                            color = TravelRed,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(bottom = 6.dp)
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = if (precioNoche > 0) "$${"%,.0f".format(precioNoche.toDouble())} COP" else "—",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF111827)
                            )
                            Text(
                                text = "por noche · $nights ${if (nights == 1) "noche" else "noches"} = ${"$%,.0f".format(total.toDouble())}",
                                fontSize = 12.sp,
                                color = TravelGray
                            )
                        }
                        Button(
                            onClick = {
                                val room = selectedRoom ?: run {
                                    reserveError = "Selecciona una habitación"
                                    return@Button
                                }
                                isReserving = true
                                reserveError = null
                                scope.launch {
                                    val token = TokenStore.get(context)
                                    if (token == null) {
                                        reserveError = "Sesión expirada"
                                        isReserving = false
                                        return@launch
                                    }
                                    try {
                                        val resp = ApiClient.api.createReservation(
                                            "Bearer $token",
                                            CreateReservationRequest(
                                                habitacion_id = room.id,
                                                hotel_id = hotelId,
                                                fecha_checkin = checkIn,
                                                fecha_checkout = checkOut,
                                                num_huespedes = numHuespedes,
                                                monto_total = room.precio_noche * nights
                                            )
                                        )
                                        if (resp.isSuccessful) {
                                            onReserveDone()
                                        } else {
                                            reserveError = "Error al reservar (${resp.code()})"
                                        }
                                    } catch (e: Exception) {
                                        reserveError = "Sin conexión al servidor"
                                    }
                                    isReserving = false
                                }
                            },
                            enabled = !isReserving && selectedRoom != null,
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = TravelOrange),
                            modifier = Modifier.height(48.dp)
                        ) {
                            if (isReserving) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    color = Color.White,
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Text("Reservar", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            }
                        }
                    }
                }
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(TravelBackground)
                .padding(padding)
        ) {
            // Imagen / banner del hotel
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(220.dp)
                        .background(hotelColor),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.Hotel,
                            contentDescription = null,
                            tint = TravelBlue,
                            modifier = Modifier.size(80.dp)
                        )
                        Text(
                            text = "Hotel #$hotelId",
                            color = TravelBlue,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    // Botones atrás y favorito
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp)
                            .align(Alignment.TopStart),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        IconButton(
                            onClick = onBack,
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.85f))
                        ) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver", tint = Color(0xFF111827))
                        }
                        IconButton(
                            onClick = {},
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.85f))
                        ) {
                            Icon(Icons.Default.FavoriteBorder, contentDescription = "Favorito", tint = Color(0xFF111827))
                        }
                    }

                    // Paginación de imágenes (dots)
                    Row(
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(bottom = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        repeat(5) { i ->
                            Box(
                                modifier = Modifier
                                    .size(if (i == 0) 10.dp else 8.dp)
                                    .clip(CircleShape)
                                    .background(if (i == 0) TravelBlue else Color.White.copy(alpha = 0.6f))
                            )
                        }
                    }
                }
            }

            // Info principal
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Hotel #$hotelId",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF111827)
                                )
                                Row(modifier = Modifier.padding(top = 4.dp)) {
                                    repeat(5) { Text("★", color = Color(0xFFF59E0B), fontSize = 14.sp) }
                                    Text(" 5 estrellas", fontSize = 13.sp, color = TravelOrange, fontWeight = FontWeight.Medium)
                                }
                                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 4.dp)) {
                                    Icon(Icons.Default.LocationOn, null, tint = TravelRed, modifier = Modifier.size(14.dp))
                                    Text(" Centro, Bogotá, Colombia", fontSize = 13.sp, color = TravelGray)
                                }
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = if (precioNoche > 0) "$${"%,.0f".format(precioNoche.toDouble())}K" else "—",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TravelBlue
                                )
                                Text("COP / noche", fontSize = 11.sp, color = TravelGray)
                            }
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = TravelGrayLight)

                        // Rating
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(TravelBlue)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("9.2", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Excelente", fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                            Text(" · 328 reseñas", color = TravelGray, fontSize = 13.sp)
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = TravelGrayLight)

                        // Descripción
                        Text("Descripción", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Ubicado en el corazón de Bogotá, ofrece una experiencia única con vistas panorámicas a los cerros orientales. Elegancia clásica y confort.",
                            fontSize = 14.sp,
                            color = TravelGray,
                            lineHeight = 22.sp
                        )
                        TextButton(
                            onClick = {},
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Text("Leer más →", color = TravelBlue, fontSize = 13.sp)
                        }
                    }
                }
            }

            // Amenidades
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp).padding(bottom = 12.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Amenidades", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        Spacer(modifier = Modifier.height(12.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            items(amenidades) { amenity ->
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Box(
                                        modifier = Modifier
                                            .size(52.dp)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(TravelBackground),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        val icon = when (amenity) {
                                            "WiFi" -> Icons.Default.Wifi
                                            "Piscina" -> Icons.Default.Pool
                                            "Gym" -> Icons.Default.FitnessCenter
                                            "Restaurante" -> Icons.Default.Restaurant
                                            "Spa" -> Icons.Default.Spa
                                            else -> Icons.Default.LocalBar
                                        }
                                        Icon(icon, null, tint = TravelGray, modifier = Modifier.size(24.dp))
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(amenity, fontSize = 11.sp, color = TravelGray)
                                }
                            }
                        }
                    }
                }
            }

            // Habitaciones disponibles
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp).padding(bottom = 12.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Habitaciones Disponibles", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        Spacer(modifier = Modifier.height(12.dp))

                        if (isLoading) {
                            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally), color = TravelBlue)
                        } else if (availableRooms.isEmpty()) {
                            if (checkIn.isNotBlank() && checkOut.isNotBlank()) {
                                Text("⛔ No hay habitaciones disponibles para las fechas seleccionadas", color = TravelRed, fontSize = 13.sp)
                            } else {
                                Text("No hay habitaciones disponibles", color = TravelGray)
                            }
                        } else {
                            if (checkIn.isNotBlank() && checkOut.isNotBlank()) {
                                Text(
                                    "$nights ${if (nights == 1) "noche" else "noches"} · $checkIn → $checkOut",
                                    fontSize = 12.sp, color = TravelBlue,
                                    modifier = Modifier.padding(bottom = 8.dp)
                                )
                            }
                            availableRooms.forEach { room ->
                                val isSelected = selectedRoom?.id == room.id
                                OutlinedCard(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                        .selectable(selected = isSelected, onClick = { selectedRoom = room }),
                                    shape = RoundedCornerShape(12.dp),
                                    border = CardDefaults.outlinedCardBorder().copy(
                                        width = if (isSelected) 2.dp else 1.dp
                                    ),
                                    colors = CardDefaults.outlinedCardColors(
                                        containerColor = if (isSelected) TravelBlueLight.copy(alpha = 0.3f) else Color.White
                                    )
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp).fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.Bed, null, tint = TravelGray, modifier = Modifier.size(20.dp))
                                            Spacer(modifier = Modifier.width(8.dp))
                                            Column {
                                                Text(room.nombre, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = Color(0xFF111827))
                                                Text(
                                                    "${room.capacidad} personas · WiFi · Minibar",
                                                    fontSize = 12.sp,
                                                    color = TravelGray
                                                )
                                            }
                                        }
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Column(horizontalAlignment = Alignment.End) {
                                                Text(
                                                    "$${"%,.0f".format(room.precio_noche)}K",
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 14.sp,
                                                    color = Color(0xFF111827)
                                                )
                                                Text("COP/noche", fontSize = 11.sp, color = TravelGray)
                                            }
                                            Spacer(modifier = Modifier.width(8.dp))
                                            RadioButton(
                                                selected = isSelected,
                                                onClick = { selectedRoom = room },
                                                colors = RadioButtonDefaults.colors(selectedColor = TravelBlue)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Reseñas
            item {
                Card(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp).padding(bottom = 80.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Reseñas", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                            TextButton(onClick = {}) {
                                Text("Ver todas →", color = TravelBlue, fontSize = 13.sp)
                            }
                        }
                        reviews.forEach { (name, stars, date) ->
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(TravelBlue.copy(alpha = 0.2f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        name.take(2).uppercase(),
                                        color = TravelBlue,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text(name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = Color(0xFF111827))
                                    Row {
                                        repeat(stars) { Text("★", color = Color(0xFFF59E0B), fontSize = 12.sp) }
                                        Text(" $date", fontSize = 12.sp, color = TravelGray)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
