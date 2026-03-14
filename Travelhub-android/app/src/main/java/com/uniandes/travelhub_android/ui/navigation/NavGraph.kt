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
import com.uniandes.travelhub_android.ui.screens.ProfileScreen
import com.uniandes.travelhub_android.ui.screens.ReservationDetailScreen
import com.uniandes.travelhub_android.ui.screens.ReservationsScreen
import com.uniandes.travelhub_android.ui.screens.SearchScreen

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
                onSearchClick = { ciudad, checkIn, checkOut, adultos, ninos ->
                    navController.navigate(Routes.search(ciudad, checkIn, checkOut, adultos, ninos))
                },
                onReservationsClick = {
                    navController.navigate(Routes.RESERVATIONS)
                },
                onNotificationsClick = {
                    navController.navigate(Routes.PROFILE)
                }
            )
        }

        composable(
            route = Routes.SEARCH,
            arguments = listOf(
                navArgument("ciudad") { type = NavType.StringType; defaultValue = "" },
                navArgument("checkIn") { type = NavType.StringType; defaultValue = "" },
                navArgument("checkOut") { type = NavType.StringType; defaultValue = "" },
                navArgument("adultos") { type = NavType.IntType; defaultValue = 2 },
                navArgument("ninos") { type = NavType.IntType; defaultValue = 0 }
            )
        ) { backStackEntry ->
            val ciudad = backStackEntry.arguments?.getString("ciudad") ?: ""
            val checkIn = backStackEntry.arguments?.getString("checkIn") ?: ""
            val checkOut = backStackEntry.arguments?.getString("checkOut") ?: ""
            val adultos = backStackEntry.arguments?.getInt("adultos") ?: 2
            val ninos = backStackEntry.arguments?.getInt("ninos") ?: 0
            SearchScreen(
                ciudad = ciudad,
                checkIn = checkIn,
                checkOut = checkOut,
                adultos = adultos,
                ninos = ninos,
                onBack = { navController.popBackStack() },
                onHotelClick = { hotelId, ci, co, ad, ni ->
                    navController.navigate(Routes.hotelDetail(hotelId, ci, co, ad, ni))
                },
                onHomeClick = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.HOME) { inclusive = true }
                    }
                },
                onReservationsClick = { navController.navigate(Routes.RESERVATIONS) },
                onNotificationsClick = { navController.navigate(Routes.PROFILE) }
            )
        }

        composable(
            route = Routes.HOTEL_DETAIL,
            arguments = listOf(
                navArgument("hotelId") { type = NavType.IntType },
                navArgument("checkIn") { type = NavType.StringType; defaultValue = "" },
                navArgument("checkOut") { type = NavType.StringType; defaultValue = "" },
                navArgument("adultos") { type = NavType.IntType; defaultValue = 2 },
                navArgument("ninos") { type = NavType.IntType; defaultValue = 0 }
            )
        ) { backStackEntry ->
            val hotelId = backStackEntry.arguments?.getInt("hotelId") ?: return@composable
            val checkIn = backStackEntry.arguments?.getString("checkIn") ?: ""
            val checkOut = backStackEntry.arguments?.getString("checkOut") ?: ""
            val adultos = backStackEntry.arguments?.getInt("adultos") ?: 2
            val ninos = backStackEntry.arguments?.getInt("ninos") ?: 0
            HotelDetailScreen(
                hotelId = hotelId,
                checkIn = checkIn,
                checkOut = checkOut,
                numHuespedes = adultos + ninos,
                onBack = { navController.popBackStack() },
                onReserveDone = {
                    navController.navigate(Routes.RESERVATIONS) {
                        popUpTo(Routes.HOME)
                    }
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
                    navController.navigate(Routes.PROFILE)
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

        composable(Routes.PROFILE) {
            ProfileScreen(
                onHomeClick = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.HOME) { inclusive = true }
                    }
                },
                onSearchClick = { navController.navigate(Routes.HOME) },
                onReservationsClick = { navController.navigate(Routes.RESERVATIONS) },
                onLogoutClick = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}
