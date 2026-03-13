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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.uniandes.travelhub_android.data.Reservation
import com.uniandes.travelhub_android.data.ReservationStatus
import com.uniandes.travelhub_android.ui.components.BottomNavBar
import com.uniandes.travelhub_android.ui.theme.*

internal val mockReservations = listOf(
    Reservation(
        id = "TH-2026-0842",
        hotelName = "Hotel Tequendama",
        hotelColor = 0xFFDBEAFE,
        status = ReservationStatus.CONFIRMADA,
        city = "Bogotá, Colombia",
        checkIn = "15 Mar",
        checkOut = "20 Mar",
        nights = 5,
        totalCop = "\$2.250.000",
        roomType = "Suite Ejecutiva",
        guests = "2 adultos",
        createdAt = "01 Mar 2026"
    ),
    Reservation(
        id = "TH-2026-0901",
        hotelName = "W Bogota",
        hotelColor = 0xFFFEF3C7,
        status = ReservationStatus.CONFIRMADA,
        city = "Zona T, Bogotá",
        checkIn = "01 Abr",
        checkOut = "04 Abr",
        nights = 3,
        totalCop = "\$1.860.000",
        roomType = "Habitación Deluxe",
        guests = "2 adultos",
        createdAt = "10 Mar 2026"
    ),
    Reservation(
        id = "TH-2026-0654",
        hotelName = "Dann Carlton Med.",
        hotelColor = 0xFFEDE9FE,
        status = ReservationStatus.COMPLETADA,
        city = "Medellín, Colombia",
        checkIn = "10 Feb",
        checkOut = "14 Feb",
        nights = 4,
        totalCop = "\$1.200.000",
        roomType = "Habitación Estándar",
        guests = "1 adulto",
        createdAt = "05 Feb 2026"
    ),
    Reservation(
        id = "TH-2026-0412",
        hotelName = "Hilton Cartagena",
        hotelColor = 0xFFFFE4E6,
        status = ReservationStatus.CANCELADA,
        city = "Cartagena, Colombia",
        checkIn = "20 Ene",
        checkOut = "25 Ene",
        nights = 5,
        totalCop = "\$2.100.000",
        roomType = "Suite Playa",
        guests = "2 adultos",
        createdAt = "10 Ene 2026"
    )
)

@Composable
fun ReservationsScreen(
    onReservationClick: (String) -> Unit,
    onHomeClick: () -> Unit,
    onNotificationsClick: () -> Unit
) {
    var selectedTab by remember { mutableStateOf("Activas") }
    val tabs = listOf("Activas", "Pasadas", "Canceladas", "Todas")

    val filtered = when (selectedTab) {
        "Activas" -> mockReservations.filter { it.status == ReservationStatus.CONFIRMADA }
        "Pasadas" -> mockReservations.filter { it.status == ReservationStatus.COMPLETADA }
        "Canceladas" -> mockReservations.filter { it.status == ReservationStatus.CANCELADA }
        else -> mockReservations
    }

    val proximas = filtered.filter { it.status == ReservationStatus.CONFIRMADA }
    val completadas = filtered.filter { it.status == ReservationStatus.COMPLETADA }
    val canceladas = filtered.filter { it.status == ReservationStatus.CANCELADA }

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
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(TravelBackground)
                .padding(padding)
        ) {
            item {
                Text(
                    text = "Mis Reservas",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827),
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 20.dp)
                )

                // Pull to refresh label
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Text(
                        "↓ Desliza para actualizar",
                        fontSize = 12.sp,
                        color = TravelBlue
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
                                .background(
                                    if (isSelected) TravelBlue else Color.White
                                )
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

            // Sección PRÓXIMAS
            if (proximas.isNotEmpty()) {
                item {
                    Text(
                        "PRÓXIMAS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TravelGray,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                    )
                }
                items(proximas) { res ->
                    ReservationCard(res, onClick = { onReservationClick(res.id) })
                }
            }

            // Sección COMPLETADAS
            if (completadas.isNotEmpty()) {
                item {
                    Text(
                        "COMPLETADAS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TravelGray,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                    )
                }
                items(completadas) { res ->
                    ReservationCard(res, onClick = { onReservationClick(res.id) })
                }
            }

            // Sección CANCELADAS
            if (canceladas.isNotEmpty()) {
                item {
                    Text(
                        "CANCELADAS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TravelGray,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                    )
                }
                items(canceladas) { res ->
                    ReservationCard(res, onClick = { onReservationClick(res.id) })
                }
            }

            if (filtered.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(40.dp),
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

@Composable
fun ReservationCard(reservation: Reservation, onClick: () -> Unit) {
    val statusColor = when (reservation.status) {
        ReservationStatus.CONFIRMADA -> TravelGreen
        ReservationStatus.COMPLETADA -> TravelGray
        ReservationStatus.CANCELADA -> TravelRed
    }
    val statusLabel = when (reservation.status) {
        ReservationStatus.CONFIRMADA -> "Confirmada"
        ReservationStatus.COMPLETADA -> "Completada ✓"
        ReservationStatus.CANCELADA -> "Cancelada"
    }

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
            // Barra de estado lateral
            Box(
                modifier = Modifier
                    .width(4.dp)
                    .fillMaxHeight()
                    .background(
                        statusColor,
                        RoundedCornerShape(topStart = 16.dp, bottomStart = 16.dp)
                    )
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Logo
                Box(
                    modifier = Modifier
                        .size(70.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(reservation.hotelColor)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Hotel, null, tint = TravelBlue, modifier = Modifier.size(32.dp))
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(reservation.hotelName, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                    Box(
                        modifier = Modifier
                            .padding(vertical = 4.dp)
                            .clip(RoundedCornerShape(20.dp))
                            .background(statusColor.copy(alpha = 0.15f))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(statusLabel, color = statusColor, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, null, tint = TravelRed, modifier = Modifier.size(12.dp))
                        Text(" ${reservation.city}", fontSize = 12.sp, color = TravelGray)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 2.dp)) {
                        Icon(Icons.Default.CalendarMonth, null, tint = TravelGray, modifier = Modifier.size(12.dp))
                        Text(
                            " ${reservation.checkIn} → ${reservation.checkOut} · ${reservation.nights} noches",
                            fontSize = 12.sp,
                            color = TravelGray
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "Codigo: ",
                            fontSize = 12.sp,
                            color = TravelGray
                        )
                        Row {
                            Text(reservation.id, fontSize = 12.sp, color = TravelBlue, fontWeight = FontWeight.SemiBold)
                            Spacer(modifier = Modifier.weight(1f))
                            Text(reservation.totalCop, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        }
                    }
                    Text("COP total", fontSize = 11.sp, color = TravelGray, modifier = Modifier.fillMaxWidth().wrapContentWidth(Alignment.End))
                }
            }
        }
    }
}
