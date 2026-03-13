package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.uniandes.travelhub_android.data.Notification
import com.uniandes.travelhub_android.data.NotificationType
import com.uniandes.travelhub_android.ui.components.BottomNavBar
import com.uniandes.travelhub_android.ui.theme.*

private val mockNotifications = listOf(
    Notification(
        id = "1",
        title = "Reserva Confirmada",
        body = "Tu reserva en Hotel Tequendama Bogota ha sido confirmada.",
        subtitle = "Codigo: TH-2026-0842 · Hace 2 horas",
        type = NotificationType.CONFIRMED,
        isRead = false,
        isToday = true
    ),
    Notification(
        id = "2",
        title = "Confirmacion Enviada",
        body = "Se envio email de confirmacion para tu reserva TH-2026-0842.",
        subtitle = "Hotel Tequendama · Hace 2 horas",
        type = NotificationType.EMAIL,
        isRead = false,
        isToday = true
    ),
    Notification(
        id = "3",
        title = "Reserva Creada",
        body = "Has creado una reserva en W Bogota para 01-04 Abr 2026.",
        subtitle = "Codigo: TH-2026-0901 · Hace 5 horas",
        type = NotificationType.CREATED,
        isRead = false,
        isToday = true
    ),
    Notification(
        id = "4",
        title = "Reserva Cancelada",
        body = "Tu reserva en Hilton Cartagena ha sido cancelada exitosamente.",
        subtitle = "Codigo: TH-2026-0412 · 02 Ene 2026",
        type = NotificationType.CANCELLED,
        isRead = true,
        isToday = false
    ),
    Notification(
        id = "5",
        title = "Estancia Completada",
        body = "Tu estancia en Dann Carlton Medellin ha finalizado.",
        subtitle = "Codigo: TH-2026-0654 · 14 Feb 2026",
        type = NotificationType.COMPLETED,
        isRead = true,
        isToday = false
    )
)

@Composable
fun NotificationsScreen(
    onBack: () -> Unit,
    onHomeClick: () -> Unit,
    onReservationsClick: () -> Unit
) {
    var notifications by remember { mutableStateOf(mockNotifications) }
    val unreadCount = notifications.count { !it.isRead }

    val todayNotifs = notifications.filter { it.isToday }
    val previousNotifs = notifications.filter { !it.isToday }

    Scaffold(
        bottomBar = {
            BottomNavBar(
                selected = "Alertas",
                notificationCount = unreadCount,
                onHomeClick = onHomeClick,
                onSearchClick = onHomeClick,
                onReservationsClick = onReservationsClick,
                onNotificationsClick = {}
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
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .padding(horizontal = 16.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "Notificaciones",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                    TextButton(
                        onClick = {
                            notifications = notifications.map { it.copy(isRead = true) }
                        }
                    ) {
                        Text("Marcar leídas", color = TravelBlue, fontWeight = FontWeight.SemiBold)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Banner sin leer
                if (unreadCount > 0) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(TravelBlueLight.copy(alpha = 0.5f))
                            .padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "$unreadCount notificaciones sin leer",
                            color = TravelBlue,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 14.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))
            }

            // HOY
            if (todayNotifs.isNotEmpty()) {
                item {
                    Text(
                        "HOY",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TravelGray,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                    )
                }
                items(todayNotifs) { notif ->
                    NotificationCard(notif)
                }
            }

            // ANTERIORES
            if (previousNotifs.isNotEmpty()) {
                item {
                    Text(
                        "ANTERIORES",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TravelGray,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                    )
                }
                items(previousNotifs) { notif ->
                    NotificationCard(notif)
                }
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }
        }
    }
}

@Composable
fun NotificationCard(notification: Notification) {
    val (icon, bgColor, iconColor) = when (notification.type) {
        NotificationType.CONFIRMED -> Triple(Icons.Default.Check, TravelGreen.copy(alpha = 0.15f), TravelGreen)
        NotificationType.EMAIL -> Triple(Icons.Default.Email, TravelBlueLight.copy(alpha = 0.5f), TravelBlue)
        NotificationType.CREATED -> Triple(Icons.Default.Hotel, Color(0xFFFEF3C7), TravelOrange)
        NotificationType.CANCELLED -> Triple(Icons.Default.Close, TravelRed.copy(alpha = 0.1f), TravelRed)
        NotificationType.COMPLETED -> Triple(Icons.Default.Flag, TravelGrayLight, TravelGray)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(if (notification.isRead) 1.dp else 3.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Punto azul (sin leer)
            Box(modifier = Modifier.width(12.dp), contentAlignment = Alignment.Center) {
                if (!notification.isRead) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(androidx.compose.foundation.shape.CircleShape)
                            .background(TravelBlue)
                    )
                }
            }

            Spacer(modifier = Modifier.width(6.dp))

            // Ícono
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(bgColor),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon as ImageVector, null, tint = iconColor, modifier = Modifier.size(24.dp))
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    notification.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(0xFF111827)
                )
                Text(
                    notification.body,
                    fontSize = 13.sp,
                    color = Color(0xFF374151),
                    lineHeight = 18.sp
                )
                Text(
                    notification.subtitle,
                    fontSize = 11.sp,
                    color = TravelGray,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            Icon(Icons.Default.ChevronRight, null, tint = TravelGray, modifier = Modifier.size(16.dp))
        }
    }
}
