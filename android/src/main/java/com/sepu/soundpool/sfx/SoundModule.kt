package com.sepu.soundpool.sfx

import android.media.SoundPool
import android.media.AudioAttributes
import com.facebook.react.bridge.*

// https://developer.android.com/reference/android/media/SoundPool#public-methods_1

class SoundModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var soundPool: SoundPool? = null

    private val soundMap = HashMap<Int, Int>()            // jsId - poolId
    private val pendingLoads = HashMap<Int, Promise>()    // poolId - promise
    private var nextId = 1

    override fun getName() = "SoundPoolSFX"

    private fun resetState() {
        soundPool?.release()
        soundPool = null

        soundMap.clear()
        pendingLoads.clear()
        nextId = 1
    }

    @ReactMethod
    fun initialize(maxStreams: Int, promise: Promise) {
        try {
            resetState()

            val attrs = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_GAME)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()

            val pool = SoundPool.Builder()
                .setMaxStreams(maxStreams.coerceAtLeast(1))
                .setAudioAttributes(attrs)
                .build()

            pool.setOnLoadCompleteListener { _, sampleId, status ->
                val p = pendingLoads.remove(sampleId) ?: return@setOnLoadCompleteListener

                if (status == 0) {
                    val jsId = nextId++
                    soundMap[jsId] = sampleId
                    p.resolve(jsId)
                } else {
                    p.reject("LOAD_FAILED", "SoundPool load failed")
                }
            }

            soundPool = pool
            promise.resolve(null)

        } catch (e: Exception) {
            promise.reject("INIT_ERROR", e)
        }
    }

    @ReactMethod
    fun loadFile(path: String, promise: Promise) {
        val pool = soundPool ?: run {
            promise.reject("NOT_INITIALIZED", "SoundPool not initialized")
            return
        }

        try {
            val cleanPath =
                if (path.startsWith("file://")) path.removePrefix("file://") else path

            val poolId = pool.load(cleanPath, 1)
            pendingLoads[poolId] = promise
        } catch (e: Exception) {
            promise.reject("LOAD_FILE_ERROR", e)
        }
    }

    @ReactMethod
    fun loadResource(resourceName: String, promise: Promise) {
        val pool = soundPool ?: run {
            promise.reject("NOT_INITIALIZED", "SoundPool not initialized")
            return
        }

        try {
            val context = reactContext.applicationContext
            val resId = context.resources.getIdentifier(
                resourceName,
                "raw",
                context.packageName
            )

            if (resId == 0) {
                promise.reject("RESOURCE_NOT_FOUND", resourceName)
                return
            }

            val poolId = pool.load(context, resId, 1)
            pendingLoads[poolId] = promise
        } catch (e: Exception) {
            promise.reject("LOAD_RESOURCE_ERROR", e)
        }
    }

    @ReactMethod
    fun play(id: Int, volume: Double) {
        val pool = soundPool ?: return
        val poolId = soundMap[id] ?: return

        val v = volume.toFloat().coerceIn(0f, 1f)

        pool.play(poolId, v, v, 1, 0, 1f)
    }

    @ReactMethod
    fun unload(id: Int) {
        val pool = soundPool ?: return
        soundMap.remove(id)?.let { pool.unload(it) }
    }

    @ReactMethod
    fun release() {
        resetState()
    }
}
