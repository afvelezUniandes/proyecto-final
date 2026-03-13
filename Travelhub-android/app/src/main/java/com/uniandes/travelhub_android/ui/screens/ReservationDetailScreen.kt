package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
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
import com.uniandes.travelhub_android.ui.theme.*

@Composable
fun ReservationDetailScreen(
    reservationId: String,
    onBack: () -> Unit
) {
    // Buscar en los datos mock de ReservationsScreen
    val reservation = mockReservations.find { it.id == reservationId }
        ?: mockReservations.first()

    var showCancelDialog by remember { mutableStateOf(false) }

    if (showCancelDialog) {
        AlertDialog(
            onDismissRequest = { showCancelDialog = false },
            title = { Text("Cancelar reserva") },
            text = { Text("¿Estás seguro de que deseas cancelar la reserva ${reservation.id}?") },
            confirmButton = {
                TextButton(
                    onClick = { showCancelDialog = false; onBack() },
                    colors = ButtonDefaults.textButtonColors(contentColor = TravelRed)
                ) { Text("Sí, cancelar") }
            },
            dismissButton = {
                TextButton(onClick = { showCancelDialog = false }) { Text("No") }
            }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(TravelBackground)
            .verticalScroll(rememberScrollState())
    ) {
        // App bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 8.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Volver", tint = TravelBlue)
            }
            Text(
                "Detalle de Reserva",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827),
                modifier = Modifier.weight(1f)
            )
        }

        Column(modifier = Modifier.padding(16.dp)) {
            // Banner estado
            val isConfirmed = reservation.status.name == "CONFIRMADA"
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isConfirmed) TravelGreen.copy(alpha = 0.1f) else TravelGray.copy(alpha = 0.1f))
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(if (isConfirmed) TravelGreen else TravelGray),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.Check,
                            null,
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            "Reserva Confirmada",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = if (isConfirmed) TravelGreen else TravelGray
                        )
                        Text(
                            "Tu reserva ha sido procesada exitosamente",
                            fontSize = 13.sp,
                            color = if (isConfirmed) TravelGreen.copy(alpha = 0.8f) else TravelGray
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Info hotel
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(reservation.hotelColor)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Hotel, null, tint = TravelBlue, modifier = Modifier.size(28.dp))
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(reservation.hotelName, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        Row {
                            repeat(5) { Text("★", color = Color(0xFFF59E0B), fontSize = 12.sp) }
                            Text(" 5 estrellas", fontSize = 12.sp, color = TravelOrange, fontWeight = FontWeight.Medium)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.LocationOn, null, tint = TravelRed, modifier = Modifier.size(12.dp))
                            Text(" ${reservation.city}", fontSize = 12.sp, color = TravelGray)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Detalles de la reserva
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Detalles de la Reserva", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                    Spacer(modifier = Modifier.height(12.dp))

                    Text("CODIGO DE RESERVA", fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                    Spacer(modifier = Modifier.height(4.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(TravelBlueLight.copy(alpha = 0.4f))
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Text(reservation.id, color = TravelBlue, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("CHECK-IN", fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                            Text(reservation.checkIn + " 2026", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        }
                        Icon(Icons.AutoMirrored.Filled.ArrowForward, null, tint = TravelGray)
                        Column(modifier = Modifier.weight(1f)) {
                            Text("CHECK-OUT", fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                            Text(reservation.checkOut + " 2026", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("HABITACIÓN", fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                            Text(reservation.roomType, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text("HUÉSPEDES", fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                            Text(reservation.guests, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("NOCHES", fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                            Text("${reservation.nights} noches", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text("CREADA EL", fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                            Text(reservation.createdAt, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Resumen de pago
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Resumen de Pago", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Precio × ${reservation.nights} noches", fontSize = 14.sp, color = TravelGray)
                        Text(reservation.totalCop, fontSize = 14.sp, color = Color(0xFF111827))
                    }
                    HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = TravelGrayLight)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        Text("Total", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                        Column(horizontalAlignment = Alignment.End) {
                            Text(reservation.totalCop, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                            Text("COP - Peso Colombiano", fontSize = 11.sp, color = TravelGray)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Botón cancelar
            if (reservation.status.name == "CONFIRMADA") {
                OutlinedButton(
                    onClick = { showCancelDialog = true },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = TravelRed),
                    border = androidx.compose.foundation.BorderStroke(1.5.dp, TravelRed)
                ) {
                    Text("Cancelar Reserva", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
