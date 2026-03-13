package com.uniandes.travelhub_android.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val TravelHubColorScheme = lightColorScheme(
    primary = TravelBlue,
    onPrimary = TravelOnPrimary,
    primaryContainer = TravelBlueLight,
    secondary = TravelOrange,
    onSecondary = TravelOnPrimary,
    background = TravelBackground,
    onBackground = TravelOnBackground,
    surface = TravelSurface,
    onSurface = TravelOnBackground,
    error = TravelRed,
    outline = TravelGrayLight
)

@Composable
fun TravelhubandroidTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = TravelHubColorScheme,
        typography = Typography,
        content = content
    )
}