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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.res.stringResource
import com.uniandes.travelhub_android.R
import com.uniandes.travelhub_android.data.ApiClient
import com.uniandes.travelhub_android.data.ReservationApi
import com.uniandes.travelhub_android.data.TokenStore
import com.uniandes.travelhub_android.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun ReservationDetailScreen(
    reservationId: String,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var reservation by remember { mutableStateOf<ReservationApi?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var showCancelDialog by remember { mutableStateOf(false) }
    var isCancelling by remember { mutableStateOf(false) }
    var cancelError by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(reservationId) {
        val token = TokenStore.get(context) ?: run {
            errorMsg = context.getString(R.string.res_no_session)
            isLoading = false
            return@LaunchedEffect
        }
        val id = reservationId.toIntOrNull() ?: run {
            errorMsg = context.getString(R.string.err_invalid_id)
            isLoading = false
            return@LaunchedEffect
        }
        try {
            val resp = ApiClient.api.getReservation("Bearer $token", id)
            if (resp.isSuccessful) {
                reservation = resp.body()
            } else {
                errorMsg = context.getString(R.string.err_loading_reservation, resp.code().toString())
            }
        } catch (e: Exception) {
            errorMsg = context.getString(R.string.err_no_connection)
        }
        isLoading = false
    }

    // Cancel dialog
    val res = reservation
    if (showCancelDialog && res != null) {
        AlertDialog(
            onDismissRequest = { showCancelDialog = false },
            title = { Text(stringResource(R.string.dlg_cancel_title)) },
            text = { Text(stringResource(R.string.dlg_cancel_msg, res.codigo)) },
            confirmButton = {
                TextButton(
                    onClick = {
                        showCancelDialog = false
                        isCancelling = true
                        scope.launch {
                            val token = TokenStore.get(context) ?: ""
                            try {
                                val resp = ApiClient.api.cancelReservation("Bearer $token", res.id)
                                if (resp.isSuccessful) {
                                    onBack()
                                } else {
                                    cancelError = context.getString(R.string.err_cancel_failed, resp.code().toString())
                                }
                            } catch (e: Exception) {
                                cancelError = context.getString(R.string.err_no_connection)
                            }
                            isCancelling = false
                        }
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = TravelRed)
                ) { Text(stringResource(R.string.dlg_yes_cancel)) }
            },
            dismissButton = {
                TextButton(onClick = { showCancelDialog = false }) { Text(stringResource(R.string.dlg_no)) }
            }
        )
    }

    Box(modifier = Modifier.fillMaxSize().background(TravelBackground)) {
        when {
            isLoading -> {
                CircularProgressIndicator(
                    color = TravelBlue,
                    modifier = Modifier.align(Alignment.Center)
                )
            }
            reservation == null -> {
                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(errorMsg ?: stringResource(R.string.err_no_reservation), color = TravelRed)
                    TextButton(onClick = onBack) { Text(stringResource(R.string.btn_back)) }
                }
            }
            else -> {
                val data = reservation!!
                val isConfirmed = data.estado == "confirmada"
                val statusColor = when (data.estado) {
                    "confirmada" -> TravelGreen
                    "cancelada"  -> TravelRed
                    else         -> TravelGray
                }
                val nights = nightsBetween(data.fecha_checkin, data.fecha_checkout)

                Column(
                    modifier = Modifier
                        .fillMaxSize()
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
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, stringResource(R.string.btn_back), tint = TravelBlue)
                        }
                        Text(
                            stringResource(R.string.res_detail_title),
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF111827),
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Column(modifier = Modifier.padding(16.dp)) {

                        // Banner estado
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(statusColor.copy(alpha = 0.1f))
                                .padding(16.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .clip(CircleShape)
                                        .background(statusColor),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        if (data.estado == "cancelada") Icons.Default.Close else Icons.Default.Check,
                                        null, tint = Color.White, modifier = Modifier.size(18.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        when (data.estado) {
                                            "confirmada" -> stringResource(R.string.res_status_confirmed)
                                            "cancelada"  -> stringResource(R.string.res_status_cancelled)
                                            "completada" -> stringResource(R.string.res_status_completed)
                                            else -> data.estado.replaceFirstChar { it.uppercase() }
                                        },
                                        fontWeight = FontWeight.Bold, fontSize = 15.sp, color = statusColor
                                    )
                                    Text(
                                        when (data.estado) {
                                            "confirmada" -> stringResource(R.string.res_status_confirmed_sub)
                                            "cancelada"  -> stringResource(R.string.res_status_cancelled_sub)
                                            else         -> stringResource(R.string.res_status_completed_sub)
                                        },
                                        fontSize = 13.sp, color = statusColor.copy(alpha = 0.8f)
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
                                        .background(Color(0xFFDBEAFE)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Hotel, null, tint = TravelBlue, modifier = Modifier.size(28.dp))
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        "Hotel #${data.hotel_id}",
                                        fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827)
                                    )
                                    Text(
                                        "Habitación #${data.habitacion_id}",
                                        fontSize = 13.sp, color = TravelGray
                                    )
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
                                Text(
                                    stringResource(R.string.res_details_card_title),
                                    fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827)
                                )
                                Spacer(modifier = Modifier.height(12.dp))

                                Text(stringResource(R.string.detail_code_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                Spacer(modifier = Modifier.height(4.dp))
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(TravelBlueLight.copy(alpha = 0.4f))
                                        .padding(horizontal = 12.dp, vertical = 8.dp)
                                ) {
                                    Text(data.codigo, color = TravelBlue, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.home_checkin_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Text(data.fecha_checkin, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                                    }
                                    Icon(Icons.AutoMirrored.Filled.ArrowForward, null, tint = TravelGray)
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.home_checkout_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Text(data.fecha_checkout, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.detail_guests_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Text(
                                            "${data.num_huespedes} ${if (data.num_huespedes == 1) stringResource(R.string.adult_singular) else stringResource(R.string.adult_plural)}",
                                            fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827)
                                        )
                                    }
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.detail_nights_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Text("$nights ${stringResource(R.string.night_plural)}", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.detail_currency_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Text(data.moneda, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
                                    }
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.detail_created_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Text(data.fecha_creacion.take(10), fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF111827))
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
                                Text(stringResource(R.string.payment_summary_title), fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(stringResource(R.string.payment_total_nights, nights.toInt()), fontSize = 14.sp, color = TravelGray)
                                    Text("${"%.0f".format(data.monto_total)}", fontSize = 14.sp, color = Color(0xFF111827))
                                }
                                HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = TravelGrayLight)
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Bottom
                                ) {
                                    Text(stringResource(R.string.payment_total), fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827))
                                    Column(horizontalAlignment = Alignment.End) {
                                        Text(
                                            "${"%.0f".format(data.monto_total)}",
                                            fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF111827)
                                        )
                                        Text("${data.moneda} - ${stringResource(R.string.currency_cop)}", fontSize = 11.sp, color = TravelGray)
                                    }
                                }
                            }
                        }

                        if (cancelError != null) {
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(cancelError!!, color = TravelRed, fontSize = 13.sp)
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        if (isConfirmed) {
                            OutlinedButton(
                                onClick = { showCancelDialog = true },
                                modifier = Modifier.fillMaxWidth().height(52.dp),
                                enabled = !isCancelling,
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = TravelRed),
                                border = androidx.compose.foundation.BorderStroke(1.5.dp, TravelRed)
                            ) {
                                if (isCancelling) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(20.dp),
                                        color = TravelRed,
                                        strokeWidth = 2.dp
                                    )
                                } else {
                                    Text(stringResource(R.string.res_cancel_btn), fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(32.dp))
                    }
                }
            }
        }
    }
}
