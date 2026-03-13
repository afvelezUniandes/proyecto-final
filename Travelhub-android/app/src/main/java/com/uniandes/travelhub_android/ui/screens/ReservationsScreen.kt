package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

// Stub temporal — se implementará en Fase 2
@Composable
fun ReservationsScreen(
    onReservationClick: (String) -> Unit,
    onHomeClick: () -> Unit,
    onNotificationsClick: () -> Unit
) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}
