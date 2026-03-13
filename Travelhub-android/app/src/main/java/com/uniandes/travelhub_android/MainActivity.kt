package com.uniandes.travelhub_android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.uniandes.travelhub_android.ui.navigation.NavGraph
import com.uniandes.travelhub_android.ui.theme.TravelhubandroidTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TravelhubandroidTheme {
                NavGraph()
            }
        }
    }
}
