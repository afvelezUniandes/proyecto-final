package com.uniandes.travelhub_android

import android.content.Context
import android.content.res.Configuration
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.uniandes.travelhub_android.data.LangStore
import com.uniandes.travelhub_android.ui.navigation.NavGraph
import com.uniandes.travelhub_android.ui.theme.TravelhubandroidTheme
import java.util.Locale

class MainActivity : ComponentActivity() {

    override fun attachBaseContext(newBase: Context) {
        val lang = LangStore.get(newBase)
        val locale = Locale.forLanguageTag(lang)
        val config = Configuration(newBase.resources.configuration)
        config.setLocale(locale)
        super.attachBaseContext(newBase.createConfigurationContext(config))
    }

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

