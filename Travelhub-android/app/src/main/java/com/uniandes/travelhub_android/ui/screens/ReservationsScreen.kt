package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
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
import com.uniandes.travelhub_android.data.ReservationApi
import com.uniandes.travelhub_android.data.TokenStore
import com.uniandes.travelhub_android.ui.components.BottomNavBar
import com.uniandes.travelhub_android.ui.theme.*
import java.text.SimpleDateFormat
import java.util.Locale
import kotlinx.coroutines.launch

internal fun nightsBetween(fechaCheckin: String, fechaCheckout: String): Int {
    return try {
        val fmt = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val d1 = fmt.parse(fechaCheckin) ?: return 0
        val d2 = fmt.parse(fechaCheckout) ?: return 0
        ((d2.time - d1.time) / (1000L * 60 * 60 * 24)).toInt()
    } catch (e: Exception) { 0 }
}

@Composable
fun ReservationsScreen(
    onReservationClick: (String) -> Unit,
    onHomeClick: () -> Unit,
    onNotificationsClick: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var reservations by remember { mutableStateOf<List<ReservationApi>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var selectedTab by remember { mutableStateOf("Activas") }

    val tabs = listOf("Activas", "Pasadas", "Canceladas", "Todas")

    suspend fun loadReservations() {
        isLoading = true
        val token = TokenStore.get(context) ?: run {
            errorMsg = "No hay sesión activa"
            isLoading = false
            return
        }
        try {
            val resp = ApiClient.api.getReservations("Bearer $token")
            if (resp.isSuccessful) {
                reservations = resp.body() ?: emptyList()
                errorMsg = null
            } else {
                errorMsg = "Error al cargar reservas (${resp.code()})"
            }
        } catch (e: Exception) {
            errorMsg = "Sin conexión al servidor"
        }
        isLoading = false
    }

    LaunchedEffect(Unit) { loadReservations() }

    val filtered = when (selectedTab) {
        "Activas"    -> reservations.filter { it.estado == "confirmada" }
        "Pasadas"    -> reservations.filter { it.estado == "completada" }
        "Canceladas" -> reservations.filter { it.estado == "cancelada" }
        else         -> reservations
    }
    val proximas    = filtered.filter { it.estado == "confirmada" }
    val completadas = filtered.filter { it.estado == "completada" }
    val canceladas  = filtered.filter { it.estado == "cancelada" }

    Scaffold(
        bottomBar = {
            BottomNavBar(
                selected = "Reservas",
                onHomeClick = onHomeClick,
                onSearchClick = onHomeClick,
                onReservationsClick = {},
                onNotificationsClick = onNotificationsClick
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(TravelBackground)
                .padding(padding)
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = TravelBlue, modifier = Modifier.align(Alignment.Center))
            } else {
                LazyColumn(modifier = Modifier.fillMaxSize()) {
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(start = 20.dp, end = 8.dp, top = 20.dp, bottom = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Mis Reservas",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF111827)
                            )
                            IconButton(onClick = { scope.launch { loadReservations() } }) {
                                Icon(Icons.Default.Refresh, contentDescription = "Actualizar", tint = TravelBlue)
                            }
                        }
                        if (errorMsg != null) {
                            Text(
                                errorMsg!!,
                                fontSize = 13.sp,
                                color = TravelRed,
                                modifier = Modifier.padding(horizontal = 20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))

                        // Tabs
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 20.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            tabs.forEach { tab ->
                                val isSelected = selectedTab == tab
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(20.dp))
                                        .background(if (isSelected) TravelBlue else Color.White)
                                        .clickable { selectedTab = tab }
                                        .padding(horizontal = 14.dp, vertical = 8.dp)
                                ) {
                                    Text(
                                        tab,
                                        color = if (isSelected) Color.White else Color(0xFF111827),
                                        fontSize = 13.sp,
                                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                                    )
                                }
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                    }

                    if (proximas.isNotEmpty()) {
                        item {
                            Text(
                                "PRÓXIMAS", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TravelGray,
                                modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                            )
                        }
                        items(proximas) { res ->
                            ReservationCard(res, onClick = { onReservationClick(res.id.toString()) })
                        }
                    }

                    if (completadas.isNotEmpty()) {
                        item {
                            Text(
                                "COMPLETADAS", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TravelGray,
                                modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                            )
                        }
                        items(completadas) { res ->
                            ReservationCard(res, onClick = { onReservationClick(res.id.toString()) })
                        }
                    }

                    if (canceladas.isNotEmpty()) {
                        item {
                            Text(
                                "CANCELADAS", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TravelGray,
                                modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                            )
                        }
                        items(canceladas) { res ->
                            ReservationCard(res, onClick = { onReservationClick(res.id.toString()) })
                        }
                    }

                    if (filtered.isEmpty()) {
                        item {
                            Box(
                                modifier = Modifier.fillMaxWidth().padding(40.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("No hay reservas en esta categoría", color = TravelGray)
                            }
                        }
                    }

                    item { Spacer(modifier = Modifier.height(16.dp)) }
                }
            }
        }
    }
}

@Composable
fun ReservationCard(reservation: ReservationApi, onClick: () -> Unit) {
    val statusColor = when (reservation.estado) {
        "confirmada" -> TravelGreen
        "completada" -> TravelGray
        "cancelada"  -> TravelRed
        else -> TravelGray
    }
    val statusLabel = when (reservation.estado) {
        "confirmada" -> "Confirmada"
        "completada" -> "Completada ✓"
        "cancelada"  -> "Cancelada"
        else -> reservation.estado.replaceFirstChar { it.uppercase() }
    }
    val cardBgColor = when (reservation.estado) {
        "confirmada" -> Color(0xFFDBEAFE)
        "completada" -> Color(0xFFEDE9FE)
        "cancelada"  -> Color(0xFFFFE4E6)
        else -> Color(0xFFF3F4F6)
    }
    val nights = nightsBetween(reservation.fecha_checkin, reservation.fecha_checkout)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 6.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth()) {
            Box(
                modifier = Modifier
                    .width(4.dp)
                    .fillMaxHeight()
                    .background(statusColor, RoundedCornerShape(topStart = 16.dp, bottomStart = 16.dp))
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(70.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(cardBgColor),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Hotel, null, tint = TravelBlue, modifier = Modifier.size(32.dp))
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        "Hotel #${reservation.hotel_id}",
                        fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827)
                    )
                    Box(
                        modifier = Modifier
                            .padding(vertical = 4.dp)
                            .clip(RoundedCornerShape(20.dp))
                            .background(statusColor.copy(alpha = 0.15f))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(statusLabel, color = statusColor, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 2.dp)) {
                        Icon(Icons.Default.CalendarMonth, null, tint = TravelGray, modifier = Modifier.size(12.dp))
                        Text(
                            " ${reservation.fecha_checkin} → ${reservation.fecha_checkout} · $nights noches",
                            fontSize = 12.sp, color = TravelGray
                        )
                    }
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Cód: ", fontSize = 12.sp, color = TravelGray)
                        Row {
                            Text(reservation.codigo, fontSize = 12.sp, color = TravelBlue, fontWeight = FontWeight.SemiBold)
                            Spacer(modifier = Modifier.weight(1f))
                            Text(
                                "${"%.0f".format(reservation.monto_total)}",
                                fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827)
                            )
                        }
                    }
                    Text(
                        "${reservation.moneda} total",
                        fontSize = 11.sp, color = TravelGray,
                        modifier = Modifier.fillMaxWidth().wrapContentWidth(Alignment.End)
                    )
                }
            }
        }
    }
}
