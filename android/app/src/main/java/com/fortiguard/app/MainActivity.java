package com.fortiguard.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

// This is the main entry point for the Android part of your application.
// It extends Capacitor's BridgeActivity, which hosts the web view.
public class MainActivity extends BridgeActivity {

  // The onCreate method is called when the app's main activity is first created.
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // This is the most critical part.
    // It initializes the Capacitor bridge and registers all custom native plugins.
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // By adding EmergencyPlugin.class here, we are telling Capacitor:
      // "When the JavaScript code calls for a plugin named 'Emergency',
      // use the code found in our EmergencyPlugin.java file."
      // Without this line, the app would crash, saying the plugin is not implemented.
      add(EmergencyPlugin.class);
    }});
  }
}
