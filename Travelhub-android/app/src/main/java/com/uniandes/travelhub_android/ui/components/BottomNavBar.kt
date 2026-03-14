package com.uniandes.travelhub_android.ui.components

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Assignment
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.uniandes.travelhub_android.R
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
            icon = { Icon(Icons.Default.Home, contentDescription = stringResource(R.string.nav_home), modifier = Modifier.size(24.dp)) },
            label = { Text(stringResource(R.string.nav_home)) },
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
            icon = { Icon(Icons.Default.Search, contentDescription = stringResource(R.string.nav_search), modifier = Modifier.size(24.dp)) },
            label = { Text(stringResource(R.string.nav_search)) },
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
            icon = { Icon(Icons.AutoMirrored.Filled.Assignment, contentDescription = stringResource(R.string.nav_reservations), modifier = Modifier.size(24.dp)) },
            label = { Text(stringResource(R.string.nav_reservations)) },
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
            icon = { Icon(Icons.Default.Person, contentDescription = stringResource(R.string.nav_profile), modifier = Modifier.size(24.dp)) },
            label = { Text(stringResource(R.string.nav_profile)) },
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
