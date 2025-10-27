package com.fortiguard.app;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.telephony.SmsManager;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.PermissionState;

@CapacitorPlugin(
    name = "Emergency",
    permissions = {
        @Permission(
            alias = "sms",
            strings = { Manifest.permission.SEND_SMS }
        ),
        @Permission(
            alias = "call",
            strings = { Manifest.permission.CALL_PHONE }
        )
    }
)
public class EmergencyPlugin extends Plugin {

    private BroadcastReceiver shakeReceiver;

    @Override
    public void load() {
        super.load();
        // This receiver listens for the 'shakeDetected' event that the background service sends.
        shakeReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // When a shake is detected, notify the JavaScript front-end.
                notifyListeners("shakeDetected", new JSObject());
            }
        };
        LocalBroadcastManager.getInstance(getContext()).registerReceiver(
            shakeReceiver, new IntentFilter(EmergencyService.ACTION_SHAKE_DETECTED)
        );
    }

    @Override
    protected void handleOnDestroy() {
        // Clean up the receiver when the app is closed to prevent memory leaks.
        LocalBroadcastManager.getInstance(getContext()).unregisterReceiver(shakeReceiver);
        super.handleOnDestroy();
    }

    @PluginMethod
    public void startMonitoring(PluginCall call) {
        // This command from JavaScript starts our persistent background service.
        Intent serviceIntent = new Intent(getContext(), EmergencyService.class);
        getContext().startForegroundService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void stopMonitoring(PluginCall call) {
        // This command from JavaScript stops our persistent background service.
        Intent serviceIntent = new Intent(getContext(), EmergencyService.class);
        getContext().stopService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void sendSms(PluginCall call) {
        // First, check if we have permission to send SMS.
        if (getPermissionState("sms") != PermissionState.GRANTED) {
            // If not, request it. Capacitor will handle the pop-up and call us back.
            requestPermissionForAlias("sms", call, "sendSmsCallback");
        } else {
            // If we already have permission, send the SMS immediately.
            sendSmsAction(call);
        }
    }
    
    @PluginMethod
    public void makeCall(PluginCall call) {
        // First, check if we have permission to make calls.
        if (getPermissionState("call") != PermissionState.GRANTED) {
            // If not, request it.
            requestPermissionForAlias("call", call, "makeCallCallback");
        } else {
            // If we already have permission, make the call immediately.
            makeCallAction(call);
        }
    }
    
    @PluginMethod
    public void sendSosAndCall(PluginCall call) {
        // Check for both permissions at once for a smoother user experience.
        if (getPermissionState("sms") != PermissionState.GRANTED || getPermissionState("call") != PermissionState.GRANTED) {
             requestPermissionsForAliases(new String[]{"sms", "call"}, call, "sendSosAndCallCallback");
        } else {
            // If we have both, perform the combined action.
            sendSosAndCallAction(call);
        }
    }
    
    // This method is automatically called by Capacitor after the user responds to a permission request.
    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.handleRequestPermissionsResult(requestCode, permissions, grantResults);

        PluginCall savedCall = getSavedCall();
        if (savedCall == null) {
            return;
        }

        // Check if the user denied any of the requested permissions.
        for (int result : grantResults) {
            if (result == PackageManager.PERMISSION_DENIED) {
                savedCall.reject("Permission denied by user.");
                return;
            }
        }

        // If all permissions were granted, figure out which action to perform now.
        String callbackName = savedCall.getCallbackId();
        if ("sendSmsCallback".equals(callbackName)) {
            sendSmsAction(savedCall);
        } else if ("makeCallCallback".equals(callbackName)) {
            makeCallAction(savedCall);
        } else if ("sendSosAndCallCallback".equals(callbackName)) {
            sendSosAndCallAction(savedCall);
        }
    }


    // This is the actual native code that sends an SMS.
    private void sendSmsAction(PluginCall call) {
        try {
            String[] recipients = call.getArray("recipients").toList().toArray(new String[0]);
            String message = call.getString("message");
            
            SmsManager smsManager = SmsManager.getDefault();
            for (String recipient : recipients) {
                smsManager.sendTextMessage(recipient, null, message, null, null);
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to send SMS.", e);
        }
    }

    // This is the actual native code that makes a phone call.
    private void makeCallAction(PluginCall call) {
        try {
            String number = call.getString("number");
            Intent callIntent = new Intent(Intent.ACTION_CALL);
            callIntent.setData(Uri.parse("tel:" + number));
            // This flag is needed to start an activity from a non-activity context like a plugin.
            callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(callIntent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to make call.", e);
        }
    }
    
    // This is the actual native code that sends an SMS and then immediately makes a call.
    private void sendSosAndCallAction(PluginCall call) {
        try {
            String recipient = call.getString("recipient");
            String message = call.getString("message");
            
            // Step 1: Send the SMS in the background.
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(recipient, null, message, null, null);
            
            // Step 2: Immediately initiate the phone call.
            Intent callIntent = new Intent(Intent.ACTION_CALL);
            callIntent.setData(Uri.parse("tel:" + recipient));
            callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(callIntent);

            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to send SOS and call.", e);
        }
    }
}
