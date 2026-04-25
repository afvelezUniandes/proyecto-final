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
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.uniandes.travelhub_android.R
import com.uniandes.travelhub_android.data.ApiClient
import com.uniandes.travelhub_android.data.LangStore
import com.uniandes.travelhub_android.data.SignUpRequest
import com.uniandes.travelhub_android.ui.components.LanguageSelector
import com.uniandes.travelhub_android.ui.components.LanguageSelectorStyle
import com.uniandes.travelhub_android.ui.theme.TravelBlue
import com.uniandes.travelhub_android.ui.theme.TravelGray
import com.uniandes.travelhub_android.ui.theme.TravelGrayLight
import com.uniandes.travelhub_android.ui.theme.TravelOrange
import com.uniandes.travelhub_android.util.ValidationUtils
import kotlinx.coroutines.launch

@Composable
fun RegisterScreen(
    onRegisterSuccess: () -> Unit,
    onBackToLogin: () -> Unit
) {
    val context = LocalContext.current
    val activity = context as android.app.Activity
    val currentLang = remember { LangStore.get(context) }
    val scope = rememberCoroutineScope()

    var nombre by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var successMsg by remember { mutableStateOf<String?>(null) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(TravelBlue)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .statusBarsPadding(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(40.dp))

            // Icono
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(TravelOrange),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "T",
                    color = Color.White,
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = stringResource(R.string.register_title),
                color = Color.White,
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = stringResource(R.string.register_subtitle),
                color = Color.White.copy(alpha = 0.8f),
                fontSize = 14.sp,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // Card del formulario
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {

                    // Nombre
                    OutlinedTextField(
                        value = nombre,
                        onValueChange = { nombre = it; errorMsg = null },
                        label = { Text(stringResource(R.string.register_name_label)) },
                        leadingIcon = { Icon(Icons.Default.Person, null, tint = TravelBlue) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TravelBlue,
                            unfocusedBorderColor = TravelGrayLight
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Email
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it; errorMsg = null },
                        label = { Text(stringResource(R.string.login_email_label)) },
                        placeholder = { Text(stringResource(R.string.login_email_placeholder), color = TravelGray) },
                        leadingIcon = { Icon(Icons.Default.Email, null, tint = TravelBlue) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TravelBlue,
                            unfocusedBorderColor = TravelGrayLight
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Contraseña
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it; errorMsg = null },
                        label = { Text(stringResource(R.string.login_password_label)) },
                        leadingIcon = { Icon(Icons.Default.Lock, null, tint = TravelBlue) },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    null, tint = TravelGray
                                )
                            }
                        },
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TravelBlue,
                            unfocusedBorderColor = TravelGrayLight
                        )
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Confirmar contraseña
                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it; errorMsg = null },
                        label = { Text(stringResource(R.string.profile_confirm_password)) },
                        leadingIcon = { Icon(Icons.Default.Lock, null, tint = TravelBlue) },
                        trailingIcon = {
                            IconButton(onClick = { confirmVisible = !confirmVisible }) {
                                Icon(
                                    if (confirmVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    null, tint = TravelGray
                                )
                            }
                        },
                        visualTransformation = if (confirmVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = TravelBlue,
                            unfocusedBorderColor = TravelGrayLight
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Error
                    if (errorMsg != null) {
                        Text(
                            errorMsg!!,
                            color = MaterialTheme.colorScheme.error,
                            fontSize = 13.sp,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                    }
                    // Éxito
                    if (successMsg != null) {
                        Text(
                            successMsg!!,
                            color = Color(0xFF16A34A),
                            fontSize = 13.sp,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                    }

                    // Botón registrar
                    Button(
                        onClick = {
                            errorMsg = null
                            if (ValidationUtils.isEmptyFields(nombre, email, password)) {
                                errorMsg = context.getString(R.string.err_empty_fields)
                                return@Button
                            }
                            if (!ValidationUtils.isValidEmail(email)) {
                                errorMsg = context.getString(R.string.err_invalid_email)
                                return@Button
                            }
                            if (!ValidationUtils.isValidPassword(password)) {
                                errorMsg = context.getString(R.string.err_weak_password)
                                return@Button
                            }
                            if (!ValidationUtils.passwordsMatch(password, confirmPassword)) {
                                errorMsg = context.getString(R.string.err_passwords_mismatch)
                                return@Button
                            }
                            isLoading = true
                            scope.launch {
                                try {
                                    val resp = ApiClient.api.signUp(
                                        SignUpRequest(nombre = nombre.trim(), email = email.trim(), password = password)
                                    )
                                    when {
                                        resp.isSuccessful -> {
                                            successMsg = context.getString(R.string.register_success)
                                            kotlinx.coroutines.delay(1500)
                                            onRegisterSuccess()
                                        }
                                        resp.code() == 400 -> errorMsg = context.getString(R.string.err_email_exists)
                                        else -> errorMsg = context.getString(R.string.err_register_failed, resp.code().toString())
                                    }
                                } catch (e: Exception) {
                                    errorMsg = context.getString(R.string.err_no_connection)
                                }
                                isLoading = false
                            }
                        },
                        enabled = !isLoading,
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = TravelOrange)
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(modifier = Modifier.size(22.dp), color = Color.White, strokeWidth = 2.dp)
                        } else {
                            Text(stringResource(R.string.register_btn), fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Link a login
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    stringResource(R.string.register_have_account),
                    color = Color.White.copy(alpha = 0.8f),
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    stringResource(R.string.register_login_link),
                    color = Color.White,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { onBackToLogin() }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Chip selector de idioma
            LanguageSelector(style = LanguageSelectorStyle.DARK)

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
