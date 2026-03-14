package com.uniandes.travelhub_android.ui.components

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Assignment
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.uniandes.travelhub_android.ui.theme.TravelBlue
import com.uniandes.travelhub_android.ui.theme.TravelGray

@Composable
fun BottomNavBar(
    selected: String,
    onHomeClick: () -> Unit,
    onSearchClick: () -> Unit,
    onReservationsClick: () -> Unit,
    onNotificationsClick: () -> Unit
) {
    NavigationBar(
        containerColor = Color.White,
        tonalElevation = 8.dp
    ) {
        NavigationBarItem(
            selected = selected == "Inicio",
            onClick = onHomeClick,
            icon = { Icon(Icons.Default.Home, contentDescription = "Inicio", modifier = Modifier.size(24.dp)) },
            label = { Text("Inicio") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = TravelBlue,
                selectedTextColor = TravelBlue,
                unselectedIconColor = TravelGray,
                unselectedTextColor = TravelGray,
                indicatorColor = Color.Transparent
            )
        )
        NavigationBarItem(
            selected = selected == "Buscar",
            onClick = onSearchClick,
            icon = { Icon(Icons.Default.Search, contentDescription = "Buscar", modifier = Modifier.size(24.dp)) },
            label = { Text("Buscar") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = TravelBlue,
                selectedTextColor = TravelBlue,
                unselectedIconColor = TravelGray,
                unselectedTextColor = TravelGray,
                indicatorColor = Color.Transparent
            )
        )
        NavigationBarItem(
            selected = selected == "Reservas",
            onClick = onReservationsClick,
            icon = { Icon(Icons.AutoMirrored.Filled.Assignment, contentDescription = "Reservas", modifier = Modifier.size(24.dp)) },
            label = { Text("Reservas") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = TravelBlue,
                selectedTextColor = TravelBlue,
                unselectedIconColor = TravelGray,
                unselectedTextColor = TravelGray,
                indicatorColor = Color.Transparent
            )
        )
        NavigationBarItem(
            selected = selected == "Perfil",
            onClick = onNotificationsClick,
            icon = { Icon(Icons.Default.Person, contentDescription = "Perfil", modifier = Modifier.size(24.dp)) },
            label = { Text("Perfil") },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = TravelBlue,
                selectedTextColor = TravelBlue,
                unselectedIconColor = TravelGray,
                unselectedTextColor = TravelGray,
                indicatorColor = Color.Transparent
            )
        )
    }
}
