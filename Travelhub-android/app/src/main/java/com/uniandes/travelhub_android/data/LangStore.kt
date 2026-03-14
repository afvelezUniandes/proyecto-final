package com.uniandes.travelhub_android.data

import android.content.Context

object LangStore {
    private const val PREFS = "lang_prefs"
    private const val KEY = "lang"

    fun get(context: Context): String =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString(KEY, "es") ?: "es"

    fun save(context: Context, lang: String) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString(KEY, lang).apply()
    }
}
