package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import com.uniandes.travelhub_android.data.Hotel
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import com.uniandes.travelhub_android.R
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.PopupProperties
import com.uniandes.travelhub_android.data.ApiClient
import com.uniandes.travelhub_android.data.LangStore
import com.uniandes.travelhub_android.ui.components.BottomNavBar
import com.uniandes.travelhub_android.ui.theme.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

@OptIn(ExperimentalMaterial3Api::class)
private val ISO = DateTimeFormatter.ISO_LOCAL_DATE        // "yyyy-MM-dd"
private val DISPLAY = DateTimeFormatter.ofPattern("dd MMM yyyy")  // "14 Mar 2026"

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onSearchClick: (ciudad: String, checkIn: String, checkOut: String, adultos: Int, ninos: Int) -> Unit,
    onReservationsClick: () -> Unit,
    onNotificationsClick: () -> Unit
) {
    val context = LocalContext.current
    val activity = context as android.app.Activity
    val currentLang = remember { LangStore.get(context) }
    val scope = rememberCoroutineScope()
    val today = remember { LocalDate.now() }
    val tomorrow = remember { today.plusDays(1) }

    var ciudad by remember { mutableStateOf("") }
    var allCities by remember { mutableStateOf<List<String>>(emptyList()) }
    var checkInDate by remember { mutableStateOf(today) }
    var checkOutDate by remember { mutableStateOf(tomorrow) }
    var adultos by remember { mutableStateOf(2) }
    var ninos by remember { mutableStateOf(0) }

    var showCheckInPicker by remember { mutableStateOf(false) }
    var showCheckOutPicker by remember { mutableStateOf(false) }

    val checkIn = checkInDate.format(ISO)
    val checkOut = checkOutDate.format(ISO)

    // DatePickerDialog para Check-In
    if (showCheckInPicker) {
        val pickerState = rememberDatePickerState(
            initialSelectedDateMillis = checkInDate.toEpochDay() * 86_400_000L,
            selectableDates = object : SelectableDates {
                override fun isSelectableDate(utcTimeMillis: Long): Boolean {
                    val day = LocalDate.ofEpochDay(utcTimeMillis / 86_400_000L)
                    return !day.isBefore(today)
                }
            }
        )
        DatePickerDialog(
            onDismissRequest = { showCheckInPicker = false },
            confirmButton = {
                TextButton(onClick = {
                    pickerState.selectedDateMillis?.let { ms ->
                        val selected = LocalDate.ofEpochDay(ms / 86_400_000L)
                        checkInDate = selected
                        // Si checkout es igual o anterior, moverlo al día siguiente
                        if (!checkOutDate.isAfter(selected)) {
                            checkOutDate = selected.plusDays(1)
                        }
                    }
                    showCheckInPicker = false
                }) { Text(stringResource(R.string.btn_accept)) }
            },
            dismissButton = { TextButton(onClick = { showCheckInPicker = false }) { Text(stringResource(R.string.btn_cancel)) } }
        ) { DatePicker(state = pickerState) }
    }

    // DatePickerDialog para Check-Out
    if (showCheckOutPicker) {
        val minCheckOut = checkInDate.plusDays(1)  // siempre al menos un día después del checkin
        val pickerState = rememberDatePickerState(
            initialSelectedDateMillis = checkOutDate.toEpochDay() * 86_400_000L,
            selectableDates = object : SelectableDates {
                override fun isSelectableDate(utcTimeMillis: Long): Boolean {
                    val day = LocalDate.ofEpochDay(utcTimeMillis / 86_400_000L)
                    return !day.isBefore(minCheckOut)
                }
            }
        )
        DatePickerDialog(
            onDismissRequest = { showCheckOutPicker = false },
            confirmButton = {
                TextButton(onClick = {
                    pickerState.selectedDateMillis?.let { ms ->
                        checkOutDate = LocalDate.ofEpochDay(ms / 86_400_000L)
                    }
                    showCheckOutPicker = false
                }) { Text(stringResource(R.string.btn_accept)) }
            },
            dismissButton = { TextButton(onClick = { showCheckOutPicker = false }) { Text(stringResource(R.string.btn_cancel)) } }
        ) { DatePicker(state = pickerState) }
    }

    // Cargar ciudades disponibles al iniciar
    LaunchedEffect(Unit) {
        try {
            val resp = ApiClient.api.getCities()
            if (resp.isSuccessful) allCities = resp.body() ?: emptyList()
        } catch (_: Exception) { }
    }

    Scaffold(
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            BottomNavBar(
                selected = "Inicio",
                onHomeClick = {},
                onSearchClick = {},
                onReservationsClick = onReservationsClick,
                onNotificationsClick = onNotificationsClick
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(TravelBackground)
                .padding(bottom = padding.calculateBottomPadding())
        ) {
            // Header azul con formulario de búsqueda
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(TravelBlue)
                        .statusBarsPadding()
                        .padding(horizontal = 20.dp, vertical = 24.dp)
                ) {
                    Column {
                        // Fila título + chip idioma
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = stringResource(R.string.home_greeting),
                                    color = Color.White,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = stringResource(R.string.home_subtitle),
                                    color = Color.White.copy(alpha = 0.85f),
                                    fontSize = 14.sp,
                                    modifier = Modifier.padding(bottom = 16.dp)
                                )
                            }
                            // Chip selector de idioma
                            Row(
                                modifier = Modifier
                                    .padding(top = 4.dp)
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(Color.White.copy(alpha = 0.15f))
                                    .padding(3.dp),
                                horizontalArrangement = Arrangement.spacedBy(2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                listOf("es" to "🇨🇴 ES", "en" to "🇺🇸 EN").forEach { (code, label) ->
                                    val isSelected = currentLang == code
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(if (isSelected) Color.White else Color.Transparent)
                                            .clickable(enabled = !isSelected) {
                                                LangStore.save(context, code)
                                                activity.recreate()
                                            }
                                            .padding(horizontal = 10.dp, vertical = 4.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = label,
                                            color = if (isSelected) TravelBlue else Color.White,
                                            fontSize = 12.sp,
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                        )
                                    }
                                }
                            }
                        }

                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(4.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                // Ciudad
                                Text(stringResource(R.string.home_city_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                Spacer(modifier = Modifier.height(4.dp))
                                CityAutocompleteField(
                                    value = ciudad,
                                    onValueChange = { ciudad = it },
                                    cities = allCities
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Fechas
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.home_checkin_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(10.dp))
                                                .background(Color(0xFFF9FAFB))
                                                .clickable { showCheckInPicker = true }
                                                .padding(horizontal = 12.dp, vertical = 14.dp)
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(Icons.Default.CalendarMonth, null, tint = TravelBlue, modifier = Modifier.size(16.dp))
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Text(checkInDate.format(DISPLAY), fontSize = 13.sp, color = Color(0xFF111827))
                                            }
                                        }
                                    }
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(stringResource(R.string.home_checkout_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(10.dp))
                                                .background(Color(0xFFF9FAFB))
                                                .clickable { showCheckOutPicker = true }
                                                .padding(horizontal = 12.dp, vertical = 14.dp)
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(Icons.Default.CalendarMonth, null, tint = TravelBlue, modifier = Modifier.size(16.dp))
                                                Spacer(modifier = Modifier.width(6.dp))
                                                Text(checkOutDate.format(DISPLAY), fontSize = 13.sp, color = Color(0xFF111827))
                                            }
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                // Huéspedes
                                Text(stringResource(R.string.home_guests_label), fontSize = 11.sp, color = TravelGray, fontWeight = FontWeight.Medium)
                                Spacer(modifier = Modifier.height(8.dp))
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(Color(0xFFF9FAFB))
                                ) {
                                    Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)) {
                                        GuestStepper(
                                            label = stringResource(R.string.home_adults),
                                            subtitle = stringResource(R.string.home_adults_age),
                                            value = adultos,
                                            min = 1,
                                            onDecrement = { adultos-- },
                                            onIncrement = { adultos++ }
                                        )
                                        HorizontalDivider(
                                            modifier = Modifier.padding(vertical = 8.dp),
                                            color = TravelGrayLight
                                        )
                                        GuestStepper(
                                            label = stringResource(R.string.home_children),
                                            subtitle = stringResource(R.string.home_children_age),
                                            value = ninos,
                                            min = 0,
                                            onDecrement = { ninos-- },
                                            onIncrement = { ninos++ }
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                Button(
                                    onClick = { onSearchClick(ciudad, checkIn, checkOut, adultos, ninos) },
                                    modifier = Modifier.fillMaxWidth().height(52.dp),
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = TravelOrange)
                                ) {
                                    Icon(Icons.Default.Search, contentDescription = null)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    val nights = ChronoUnit.DAYS.between(checkInDate, checkOutDate)
                                    val nightLabel = if (nights == 1L) stringResource(R.string.night_singular) else stringResource(R.string.night_plural)
                                    Text(
                                        stringResource(R.string.home_search_btn, nights, nightLabel),
                                        fontWeight = FontWeight.SemiBold, fontSize = 16.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CityAutocompleteField(
    value: String,
    onValueChange: (String) -> Unit,
    cities: List<String>
) {
    var isFocused by remember { mutableStateOf(false) }
    var fieldSize by remember { mutableStateOf(IntSize.Zero) }
    val suggestions = remember(value, cities) {
        if (value.isBlank()) cities
        else cities.filter { it.contains(value, ignoreCase = true) }
    }
    val showDropdown = isFocused && suggestions.isNotEmpty() &&
            !cities.any { it.equals(value, ignoreCase = true) }
    val density = LocalDensity.current

    Box {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .onFocusChanged { isFocused = it.isFocused }
                .onGloballyPositioned { fieldSize = it.size },
            placeholder = { Text("📍 Bogotá, Colombia", color = TravelGray) },
            singleLine = true,
            shape = RoundedCornerShape(10.dp),
            trailingIcon = {
                if (value.isNotBlank()) {
                    IconButton(onClick = { onValueChange("") }) {
                        Icon(Icons.Default.Close, null, tint = TravelGray, modifier = Modifier.size(16.dp))
                    }
                } else {
                    Icon(Icons.Default.Search, null, tint = TravelGray, modifier = Modifier.size(18.dp))
                }
            },
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = TravelBlue,
                unfocusedBorderColor = TravelGrayLight,
                focusedContainerColor = Color(0xFFF9FAFB),
                unfocusedContainerColor = Color(0xFFF9FAFB)
            )
        )
        DropdownMenu(
            expanded = showDropdown,
            onDismissRequest = { isFocused = false },
            properties = PopupProperties(focusable = false),
            modifier = Modifier
                .width(with(density) { fieldSize.width.toDp() })
                .background(Color.White)
        ) {
            suggestions.take(6).forEach { city ->
                DropdownMenuItem(
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.LocationOn,
                                null,
                                tint = TravelBlue,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(city, fontSize = 14.sp, color = Color(0xFF111827))
                        }
                    },
                    onClick = { onValueChange(city) }
                )
            }
        }
    }
}

@Composable
private fun GuestStepper(
    label: String,
    subtitle: String,
    value: Int,
    min: Int,
    onDecrement: () -> Unit,
    onIncrement: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(label, fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF111827))
            Text(subtitle, fontSize = 11.sp, color = TravelGray)
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(
                onClick = onDecrement,
                enabled = value > min,
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(if (value > min) TravelBlue.copy(alpha = 0.12f) else TravelGrayLight)
            ) {
                Icon(
                    Icons.Default.Remove, null,
                    tint = if (value > min) TravelBlue else TravelGray,
                    modifier = Modifier.size(16.dp)
                )
            }
            Text(
                value.toString(),
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = Color(0xFF111827),
                textAlign = TextAlign.Center,
                modifier = Modifier.width(36.dp)
            )
            IconButton(
                onClick = onIncrement,
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(TravelBlue.copy(alpha = 0.12f))
            ) {
                Icon(Icons.Default.Add, null, tint = TravelBlue, modifier = Modifier.size(16.dp))
            }
        }
    }
}

@Composable
fun HotelCard(hotel: Hotel, onClick: () -> Unit) {
    val hotelColors = listOf(
        Color(0xFFDBEAFE), Color(0xFFFEF3C7), Color(0xFFDCFCE7),
        Color(0xFFEDE9FE), Color(0xFFFFE4E6)
    )
    val hotelColor = hotelColors[hotel.id % hotelColors.size]

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 6.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.Top) {
            // Logo hotel
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(hotelColor),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.Hotel,
                        contentDescription = null,
                        tint = TravelBlue,
                        modifier = Modifier.size(32.dp)
                    )
                    Text(
                        text = hotel.nombre.take(10),
                        fontSize = 9.sp,
                        color = TravelBlue,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Text(
                        text = hotel.nombre,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827),
                        modifier = Modifier.weight(1f)
                    )
                    IconButton(
                        onClick = {},
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            Icons.Default.FavoriteBorder,
                            contentDescription = null,
                            tint = TravelGray,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                // Ubicación
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = TravelRed, modifier = Modifier.size(14.dp))
                    Text(" ${hotel.ciudad}, ${hotel.pais}", fontSize = 12.sp, color = TravelGray)
                }

                // Estrellas
                Row(modifier = Modifier.padding(vertical = 4.dp)) {
                    repeat(hotel.estrellas) {
                        Text("★", color = Color(0xFFF59E0B), fontSize = 12.sp)
                    }
                    repeat(5 - hotel.estrellas) {
                        Text("★", color = TravelGrayLight, fontSize = 12.sp)
                    }
                    Text(
                        text = " " + stringResource(R.string.hotel_stars_label, hotel.estrellas),
                        fontSize = 12.sp, color = TravelGray
                    )
                }

                // Amenidades chip (mock)
                LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    items(listOf("WiFi", "Piscina", "Gym").take(3)) { amenity ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(TravelBlueLight.copy(alpha = 0.5f))
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        ) {
                            Text(amenity, fontSize = 11.sp, color = TravelBlue)
                        }
                    }
                }
            }
        }
    }
}
