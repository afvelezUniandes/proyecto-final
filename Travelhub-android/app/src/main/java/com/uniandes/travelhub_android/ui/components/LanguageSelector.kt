package com.uniandes.travelhub_android.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.uniandes.travelhub_android.data.LangStore
import com.uniandes.travelhub_android.ui.theme.TravelBlue
import com.uniandes.travelhub_android.ui.theme.TravelGray
import com.uniandes.travelhub_android.ui.theme.TravelGrayLight

/**
 * Chip selector de idioma reutilizable.
 *
 * @param style LIGHT → fondo gris claro con texto oscuro (para fondos blancos, ej. Login).
 *              DARK  → fondo semitransparente blanco con texto blanco (para fondos azules, ej. Registro, Home).
 */
enum class LanguageSelectorStyle { LIGHT, DARK }

@Composable
fun LanguageSelector(
    style: LanguageSelectorStyle = LanguageSelectorStyle.LIGHT,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val activity = context as android.app.Activity
    val currentLang = remember { LangStore.get(context) }

    val options = listOf("es" to "Español", "en" to "English")

    val containerBg = when (style) {
        LanguageSelectorStyle.LIGHT -> TravelGrayLight
        LanguageSelectorStyle.DARK  -> Color.White.copy(alpha = 0.15f)
    }
    val selectedBg = when (style) {
        LanguageSelectorStyle.LIGHT -> TravelBlue
        LanguageSelectorStyle.DARK  -> Color.White
    }
    val selectedTextColor = when (style) {
        LanguageSelectorStyle.LIGHT -> Color.White
        LanguageSelectorStyle.DARK  -> TravelBlue
    }
    val unselectedTextColor = when (style) {
        LanguageSelectorStyle.LIGHT -> TravelGray
        LanguageSelectorStyle.DARK  -> Color.White
    }

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(containerBg)
            .padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        options.forEach { (code, label) ->
            val isSelected = currentLang == code
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(if (isSelected) selectedBg else Color.Transparent)
                    .clickable(enabled = !isSelected) {
                        LangStore.save(context, code)
                        activity.recreate()
                    }
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = label,
                    color = if (isSelected) selectedTextColor else unselectedTextColor,
                    fontSize = 13.sp,
                    fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                )
            }
        }
    }
}
