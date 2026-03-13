package com.uniandes.travelhub_android.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.uniandes.travelhub_android.ui.screens.HomeScreen
import com.uniandes.travelhub_android.ui.screens.HotelDetailScreen
import com.uniandes.travelhub_android.ui.screens.LoginScreen
import com.uniandes.travelhub_android.ui.screens.NotificationsScreen
import com.uniandes.travelhub_android.ui.screens.ReservationDetailScreen
import com.uniandes.travelhub_android.ui.screens.ReservationsScreen

@Composable
fun NavGraph() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.LOGIN
    ) {
        composable(Routes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.HOME) {
            HomeScreen(
                onHotelClick = { hotelId ->
                    navController.navigate(Routes.hotelDetail(hotelId))
                },
                onReservationsClick = {
                    navController.navigate(Routes.RESERVATIONS)
                },
                onNotificationsClick = {
                    navController.navigate(Routes.NOTIFICATIONS)
                }
            )
        }

        composable(
            route = Routes.HOTEL_DETAIL,
            arguments = listOf(navArgument("hotelId") { type = NavType.IntType })
        ) { backStackEntry ->
            val hotelId = backStackEntry.arguments?.getInt("hotelId") ?: return@composable
            HotelDetailScreen(
                hotelId = hotelId,
                onBack = { navController.popBackStack() },
                onReserve = {
                    navController.navigate(Routes.RESERVATIONS)
                }
            )
        }

        composable(Routes.RESERVATIONS) {
            ReservationsScreen(
                onReservationClick = { reservationId ->
                    navController.navigate(Routes.reservationDetail(reservationId))
                },
                onHomeClick = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.HOME) { inclusive = true }
                    }
                },
                onNotificationsClick = {
                    navController.navigate(Routes.NOTIFICATIONS)
                }
            )
        }

        composable(
            route = Routes.RESERVATION_DETAIL,
            arguments = listOf(navArgument("reservationId") { type = NavType.StringType })
        ) { backStackEntry ->
            val reservationId = backStackEntry.arguments?.getString("reservationId") ?: return@composable
            ReservationDetailScreen(
                reservationId = reservationId,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Routes.NOTIFICATIONS) {
            NotificationsScreen(
                onBack = { navController.popBackStack() },
                onHomeClick = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.HOME) { inclusive = true }
                    }
                },
                onReservationsClick = {
                    navController.navigate(Routes.RESERVATIONS)
                }
            )
        }
    }
}
