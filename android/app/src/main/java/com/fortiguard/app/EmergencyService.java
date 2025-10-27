package com.fortiguard.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

public class EmergencyService extends Service implements SensorEventListener {

    // A unique string to identify the shake event when we broadcast it.
    // This MUST match the string used in EmergencyPlugin.java.
    public static final String ACTION_SHAKE_DETECTED = "com.fortiguard.app.SHAKE_DETECTED";
    
    private static final int NOTIFICATION_ID = 1;
    private static final String CHANNEL_ID = "EmergencyServiceChannel";

    private SensorManager sensorManager;
    private Sensor accelerometer;

    // Shake detection algorithm parameters
    private static final float SHAKE_THRESHOLD_GRAVITY = 2.7F; // How hard the shake must be
    private static final int SHAKE_SLOP_TIME_MS = 500; // Time between shakes to count as one event
    private static final int SHAKE_COUNT_RESET_TIME_MS = 3000; // Time after which the shake counter resets
    private long mShakeTimestamp;
    private int mShakeCount;

    // This method is called when the service is first created.
    @Override
    public void onCreate() {
        super.onCreate();
        // Get the phone's sensor system and the accelerometer.
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        // Start listening for accelerometer events.
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_UI);
    }

    // This method is called every time the service is started.
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();
        
        // A Foreground Service requires a persistent notification to be shown to the user.
        // This tells the user that your app is running in the background.
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("FortiGuard Active")
                .setContentText("Emergency monitoring service is running.")
                .setSmallIcon(R.mipmap.ic_launcher) // This uses your app's main icon.
                .build();

        startForeground(NOTIFICATION_ID, notification);
        
        // If the system kills the service, it should try to restart it.
        return START_STICKY;
    }

    // This method is called when the service is destroyed.
    @Override
    public void onDestroy() {
        super.onDestroy();
        // Stop listening for sensor events to save battery.
        sensorManager.unregisterListener(this);
    }

    // This must be implemented, but we don't use it, so we return null.
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    // Required for Android 8.0 (Oreo) and higher for notifications.
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Emergency Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    // This method is called every time the accelerometer detects movement.
    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            float x = event.values[0];
            float y = event.values[1];
            float z = event.values[2];

            float gX = x / SensorManager.GRAVITY_EARTH;
            float gY = y / SensorManager.GRAVITY_EARTH;
            float gZ = z / SensorManager.GRAVITY_EARTH;

            // Calculate the total force of movement.
            float gForce = (float) Math.sqrt(gX * gX + gY * gY + gZ * gZ);

            // If the force is greater than our threshold, it's a potential shake.
            if (gForce > SHAKE_THRESHOLD_GRAVITY) {
                final long now = System.currentTimeMillis();
                
                // Ignore multiple events from the same shake.
                if (mShakeTimestamp + SHAKE_SLOP_TIME_MS > now) {
                    return;
                }

                // Reset the shake count if there has been a long pause.
                if (mShakeTimestamp + SHAKE_COUNT_RESET_TIME_MS < now) {
                    mShakeCount = 0;
                }

                mShakeTimestamp = now;
                mShakeCount++;

                // If we detect 3 or more shakes in a short period, trigger the alert.
                if (mShakeCount >= 3) {
                    sendShakeBroadcast();
                    mShakeCount = 0; // Reset the counter after triggering.
                }
            }
        }
    }
    
    // We don't need this, but it must be implemented.
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Not used
    }
    
    // This sends a private message from this background service back to our main app (EmergencyPlugin).
    private void sendShakeBroadcast() {
        Intent intent = new Intent(ACTION_SHAKE_DETECTED);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }
}
