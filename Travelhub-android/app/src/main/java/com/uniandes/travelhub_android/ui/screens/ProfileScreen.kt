package com.uniandes.travelhub_android.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.uniandes.travelhub_android.R
import com.uniandes.travelhub_android.data.ApiClient
import com.uniandes.travelhub_android.data.LangStore
import com.uniandes.travelhub_android.data.TokenStore
import com.uniandes.travelhub_android.data.UpdateProfileRequest
import com.uniandes.travelhub_android.ui.components.BottomNavBar
import com.uniandes.travelhub_android.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    onHomeClick: () -> Unit,
    onSearchClick: () -> Unit,
    onReservationsClick: () -> Unit,
    onLogoutClick: () -> Unit
) {
    val context = LocalContext.current
    val activity = context as android.app.Activity
    val scope = rememberCoroutineScope()

    // Campos del formulario
    var nombre by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var telefono by remember { mutableStateOf("") }
    var pais by remember { mutableStateOf("") }
    var idioma by remember { mutableStateOf("es") }
    var idiomaExpanded by remember { mutableStateOf(false) }
    val idiomaOpciones = listOf("es" to "Español (CO)", "en" to "English")
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }

    var isEditing by remember { mutableStateOf(false) }
    var loadKey by remember { mutableStateOf(0) }
    var emailError by remember { mutableStateOf(false) }

    var isLoading by remember { mutableStateOf(true) }
    var isSaving by remember { mutableStateOf(false) }
    var successMsg by remember { mutableStateOf<String?>(null) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    // Cargar perfil al entrar
    LaunchedEffect(loadKey) {
        val token = TokenStore.get(context) ?: return@LaunchedEffect
        try {
            val resp = ApiClient.api.getProfile("Bearer $token")
            if (resp.isSuccessful) {
                resp.body()?.let { p ->
                    nombre = p.nombre
                    email = p.email
                    telefono = p.telefono
                    pais = p.pais
                    idioma = p.idioma_preferido
                }
            }
        } catch (_: Exception) { }
        isLoading = false
    }

    val emailRegex = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")

    fun save() {
        val trimmedEmail = email.trim()
        if (!emailRegex.matches(trimmedEmail)) {
            emailError = true
            errorMsg = context.getString(R.string.err_invalid_email)
            return
        }
        emailError = false
        if (password.isNotBlank() && password != confirmPassword) {
            errorMsg = context.getString(R.string.err_passwords_mismatch)
            return
        }
        scope.launch {
            isSaving = true
            errorMsg = null
            successMsg = null
            val token = TokenStore.get(context) ?: run {
                errorMsg = context.getString(R.string.err_no_session)
                isSaving = false
                return@launch
            }
            try {
                val req = UpdateProfileRequest(
                    nombre = nombre.ifBlank { null },
                    email = email.ifBlank { null },
                    telefono = telefono.ifBlank { null },
                    pais = pais.ifBlank { null },
                    idioma_preferido = idioma.ifBlank { null },
                    password = password.ifBlank { null }
                )
                val resp = ApiClient.api.updateProfile("Bearer $token", req)
                if (resp.isSuccessful) {
                    password = ""
                    confirmPassword = ""
                    successMsg = context.getString(R.string.profile_updated)
                    isEditing = false
                    val prevLang = LangStore.get(context)
                    if (idioma != prevLang) {
                        LangStore.save(context, idioma)
                        delay(600)
                        activity.recreate()
                    }
                } else {
                    errorMsg = context.getString(R.string.err_save, resp.code().toString())
                }
            } catch (e: Exception) {
                errorMsg = context.getString(R.string.err_no_connection)
            }
            isSaving = false
        }
    }

    Scaffold(
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        bottomBar = {
            BottomNavBar(
                selected = "Perfil",
                onHomeClick = onHomeClick,
                onSearchClick = onSearchClick,
                onReservationsClick = onReservationsClick,
                onNotificationsClick = {}
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(TravelBackground)
                .padding(bottom = padding.calculateBottomPadding())
                .verticalScroll(rememberScrollState())
        ) {
            // Header azul
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(TravelBlue)
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 24.dp)
            ) {
                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.Person,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(40.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    if (nombre.isNotBlank()) {
                        Text(nombre, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    }
                    if (email.isNotBlank()) {
                        Text(email, color = Color.White.copy(alpha = 0.85f), fontSize = 13.sp)
                    }
                }
                IconButton(
                    onClick = {
                        if (isEditing) {
                            loadKey++
                            isEditing = false
                            errorMsg = null
                            successMsg = null
                            emailError = false
                        } else {
                            isEditing = true
                            successMsg = null
                        }
                    },
                    modifier = Modifier.align(Alignment.TopEnd)
                ) {
                    Icon(
                        if (isEditing) Icons.Default.Close else Icons.Default.Edit,
                        contentDescription = if (isEditing) stringResource(R.string.profile_cancel_edit) else stringResource(R.string.profile_edit),
                        tint = Color.White
                    )
                }
            }

            if (isLoading) {
                Box(modifier = Modifier.fillMaxWidth().padding(40.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = TravelBlue)
                }
            } else {
                ProfileSection(title = stringResource(R.string.profile_section_personal)) {
                    ProfileField(
                        label = stringResource(R.string.profile_full_name),
                        value = nombre,
                        onValueChange = { nombre = it },
                        icon = Icons.Default.Person,
                        enabled = isEditing
                    )
                    ProfileField(
                        label = stringResource(R.string.profile_email),
                        value = email,
                        onValueChange = { email = it; emailError = false },
                        icon = Icons.Default.Email,
                        keyboardType = KeyboardType.Email,
                        enabled = isEditing,
                        isError = emailError
                    )
                    ProfileField(
                        label = stringResource(R.string.profile_phone),
                        value = telefono,
                        onValueChange = { telefono = it },
                        icon = Icons.Default.Phone,
                        keyboardType = KeyboardType.Phone,
                        enabled = isEditing
                    )
                    ProfileField(
                        label = stringResource(R.string.profile_country),
                        value = pais,
                        onValueChange = { pais = it },
                        icon = Icons.Default.Public,
                        enabled = isEditing
                    )
                    // Selector de idioma
                    Box(modifier = Modifier.fillMaxWidth()) {
                        OutlinedTextField(
                            value = idiomaOpciones.firstOrNull { it.first == idioma }?.second ?: idioma,
                            onValueChange = {},
                            readOnly = true,
                            modifier = Modifier.fillMaxWidth(),
                            label = { Text(stringResource(R.string.profile_language)) },
                            leadingIcon = { Icon(Icons.Default.Language, null, tint = if (isEditing) TravelGray else TravelGrayLight) },
                            trailingIcon = {
                                Icon(
                                    if (idiomaExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                    contentDescription = null,
                                    tint = if (isEditing) TravelGray else TravelGrayLight
                                )
                            },
                            enabled = false,
                            singleLine = true,
                            shape = RoundedCornerShape(10.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                disabledBorderColor = if (isEditing) TravelBlue else TravelGrayLight,
                                disabledTextColor = Color(0xFF111827),
                                disabledLabelColor = TravelGray,
                                disabledLeadingIconColor = if (isEditing) TravelGray else TravelGrayLight,
                                disabledTrailingIconColor = if (isEditing) TravelGray else TravelGrayLight
                            )
                        )
                        // Invisible overlay to capture clicks (enabled = false blocks touch)
                        if (isEditing) {
                            Box(modifier = Modifier.matchParentSize().clickable { idiomaExpanded = true })
                        }
                        DropdownMenu(
                            expanded = idiomaExpanded,
                            onDismissRequest = { idiomaExpanded = false },
                            modifier = Modifier.fillMaxWidth(0.9f)
                        ) {
                            idiomaOpciones.forEach { (codigo, etiqueta) ->
                                DropdownMenuItem(
                                    text = { Text(etiqueta) },
                                    onClick = {
                                        idioma = codigo
                                        idiomaExpanded = false
                                    },
                                    leadingIcon = if (idioma == codigo) {
                                        { Icon(Icons.Default.Check, null, tint = TravelBlue) }
                                    } else null
                                )
                            }
                        }
                    }
                }

                // Sección cambio de contraseña — solo visible en modo edición
                if (isEditing) ProfileSection(title = stringResource(R.string.profile_section_password)) {
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text(stringResource(R.string.profile_new_password)) },
                        leadingIcon = { Icon(Icons.Default.Lock, null, tint = TravelGray) },
                        trailingIcon = {
                            IconButton(onClick = { showPassword = !showPassword }) {
                                Icon(
                                    if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    null, tint = TravelGray
                                )
                            }
                        },
                        visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TravelBlue,
                            unfocusedBorderColor = TravelGrayLight
                        )
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text(stringResource(R.string.profile_confirm_password)) },
                        leadingIcon = { Icon(Icons.Default.Lock, null, tint = TravelGray) },
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TravelBlue,
                            unfocusedBorderColor = TravelGrayLight
                        ),
                        isError = confirmPassword.isNotBlank() && confirmPassword != password
                    )
                }

                // Mensajes de estado
                if (errorMsg != null) {
                    Text(
                        errorMsg!!,
                        color = TravelRed,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(horizontal = 20.dp)
                    )
                }
                if (successMsg != null) {
                    Text(
                        successMsg!!,
                        color = TravelGreen,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 20.dp)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Botón guardar — solo visible en modo edición
                if (isEditing) Button(
                    onClick = { save() },
                    enabled = !isSaving,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp)
                        .height(52.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = TravelBlue)
                ) {
                    if (isSaving) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                    } else {
                        Icon(Icons.Default.Save, null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(stringResource(R.string.profile_save_btn), fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Botón cerrar sesión — solo visible cuando no se está editando
                if (!isEditing) OutlinedButton(
                    onClick = {
                        scope.launch {
                            TokenStore.clear(context)
                            onLogoutClick()
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp)
                        .height(52.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = TravelRed),
                    border = androidx.compose.foundation.BorderStroke(1.dp, TravelRed)
                ) {
                    Icon(Icons.Default.Logout, null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(stringResource(R.string.profile_logout_btn), fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun ProfileSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 12.dp)) {
        Text(
            title.uppercase(),
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = TravelGray,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                content()
            }
        }
    }
}

@Composable
private fun ProfileField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    icon: ImageVector,
    keyboardType: KeyboardType = KeyboardType.Text,
    placeholder: String = "",
    enabled: Boolean = true,
    isError: Boolean = false
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
        label = { Text(label) },
        placeholder = if (placeholder.isNotBlank()) { { Text(placeholder, color = TravelGray) } } else null,
        leadingIcon = { Icon(icon, null, tint = if (enabled) TravelGray else TravelGrayLight) },
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        singleLine = true,
        shape = RoundedCornerShape(10.dp),
        enabled = enabled,
        isError = isError,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = TravelBlue,
            unfocusedBorderColor = TravelGrayLight,
            disabledBorderColor = TravelGrayLight,
            disabledTextColor = Color(0xFF111827),
            disabledLabelColor = TravelGray,
            disabledLeadingIconColor = TravelGrayLight,
            errorBorderColor = Color(0xFFDC2626)
        )
    )
}
