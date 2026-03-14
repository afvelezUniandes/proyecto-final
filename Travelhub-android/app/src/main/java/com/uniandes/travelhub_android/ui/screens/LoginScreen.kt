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
import com.uniandes.travelhub_android.data.SignInRequest
import com.uniandes.travelhub_android.data.TokenStore
import com.uniandes.travelhub_android.ui.theme.TravelBlue
import com.uniandes.travelhub_android.ui.theme.TravelGray
import com.uniandes.travelhub_android.ui.theme.TravelGrayLight
import com.uniandes.travelhub_android.ui.theme.TravelOrange
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(onLoginSuccess: () -> Unit) {
    val context = LocalContext.current
    val activity = context as android.app.Activity
    val currentLang = remember { LangStore.get(context) }
    val scope = rememberCoroutineScope()

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        // Header azul con logo
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(TravelBlue)
                .padding(top = 64.dp, bottom = 40.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
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
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "TravelHub",
                    color = Color.White,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = stringResource(R.string.login_tagline),
                    color = Color.White.copy(alpha = 0.85f),
                    fontSize = 14.sp
                )
            }
        }

        // Card blanca con formulario
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = stringResource(R.string.login_title),
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
                Text(
                    text = stringResource(R.string.login_subtitle),
                    fontSize = 14.sp,
                    color = TravelGray,
                    modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
                )

                // Campo email
                Text(
                    text = stringResource(R.string.login_email_label),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF111827),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it; errorMessage = null },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text(stringResource(R.string.login_email_placeholder), color = TravelGray) },
                    leadingIcon = { Icon(Icons.Default.Email, contentDescription = null, tint = TravelGray) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TravelBlue,
                        unfocusedBorderColor = TravelGrayLight,
                        focusedContainerColor = Color(0xFFF9FAFB),
                        unfocusedContainerColor = Color(0xFFF9FAFB)
                    )
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Campo contraseña
                Text(
                    text = stringResource(R.string.login_password_label),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF111827),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it; errorMessage = null },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("••••••••", color = TravelGray) },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = TravelGray) },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                contentDescription = null,
                                tint = TravelGray
                            )
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = TravelBlue,
                        unfocusedBorderColor = TravelGrayLight,
                        focusedContainerColor = Color(0xFFF9FAFB),
                        unfocusedContainerColor = Color(0xFFF9FAFB)
                    )
                )

                // ¿Olvidaste tu contraseña?
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
                    TextButton(onClick = {}) {
                        Text(
                            text = stringResource(R.string.login_forgot_password),
                            color = TravelBlue,
                            fontSize = 13.sp
                        )
                    }
                }

                // Error
                errorMessage?.let {
                    Text(
                        text = it,
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                // Botón Iniciar Sesión
                Button(
                    onClick = {
                        val emailRegex = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
                        if (email.isBlank() || password.isBlank()) {
                            errorMessage = context.getString(R.string.err_empty_fields)
                            return@Button
                        }
                        if (!emailRegex.matches(email.trim())) {
                            errorMessage = context.getString(R.string.err_invalid_email)
                            return@Button
                        }
                        scope.launch {
                            isLoading = true
                            errorMessage = null
                            try {
                                val response = ApiClient.api.signIn(SignInRequest(email.trim(), password))
                                if (response.isSuccessful) {
                                    val token = response.body()?.token
                                    if (token != null) {
                                        TokenStore.save(context, token)
                                        onLoginSuccess()
                                    } else {
                                        errorMessage = context.getString(R.string.err_getting_token)
                                    }
                                } else {
                                    errorMessage = context.getString(R.string.err_invalid_credentials)
                                }
                            } catch (e: Exception) {
                                errorMessage = context.getString(R.string.err_no_server)
                            } finally {
                                isLoading = false
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = TravelBlue),
                    enabled = !isLoading
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = Color.White,
                            strokeWidth = 2.dp
                        )
                    } else {
                        Text(
                            text = stringResource(R.string.login_btn),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                // Crear cuenta
                Row(
                    modifier = Modifier.padding(top = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = stringResource(R.string.login_no_account),
                        color = TravelGray,
                        fontSize = 14.sp
                    )
                    TextButton(
                        onClick = {},
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = stringResource(R.string.login_create_account),
                            color = TravelBlue,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        // Selector de idioma
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(TravelGrayLight)
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                listOf("es" to "Español", "en" to "English").forEach { (code, label) ->
                    val isSelected = currentLang == code
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSelected) TravelBlue else Color.Transparent)
                            .clickable(enabled = !isSelected) {
                                LangStore.save(context, code)
                                activity.recreate()
                            }
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            color = if (isSelected) Color.White else TravelGray,
                            fontSize = 13.sp,
                            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                        )
                    }
                }
            }
        }
    }
}
