import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface EmergencyPlugin {
  startMonitoring(): Promise<void>;
  stopMonitoring(): Promise<void>;
  sendSms(options: { recipients: string[]; message: string }): Promise<void>;
  makeCall(options: { number: string }): Promise<void>;
  sendSosAndCall(options: { recipient: string; message: string }): Promise<void>;

  addListener(
    eventName: 'shakeDetected',
    listenerFunc: () => void,
  ): Promise<PluginListenerHandle>;
}

const Emergency = registerPlugin<EmergencyPlugin>('Emergency', {
  web: () => import('./emergency-plugin.web').then(m => new m.EmergencyWeb()),
});

export default Emergency;
