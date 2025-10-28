import { WebPlugin, PluginListenerHandle, ListenerCallback } from '@capacitor/core';
import type { EmergencyPlugin } from './emergency-plugin';

export class EmergencyWeb extends WebPlugin implements EmergencyPlugin {
  private shakeListener: ((event: DeviceMotionEvent) => void) | null = null;
  private lastShakeTime = 0;
  private readonly SHAKE_THRESHOLD = 25; // m/s^2

  // Using overloads to satisfy both the specific EmergencyPlugin interface
  // and the generic WebPlugin base class.
  addListener(
    eventName: 'shakeDetected',
    listenerFunc: () => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: string,
    listenerFunc: ListenerCallback,
  ): Promise<PluginListenerHandle>;
  // FIX: Implement `addListener` with a concrete type instead of `any` to avoid
  // confusing the TypeScript compiler, which was causing it to lose type
  // information for `this` in other methods.
  async addListener(
    eventName: string,
    listenerFunc: ListenerCallback,
  ): Promise<PluginListenerHandle> {
    // A function of type `() => void` is assignable to `ListenerCallback` (`(data: any) => void`).
    // Therefore, we don't need the previous complex logic with a wrapper.
    // We can just pass the listener to the super method.
    return super.addListener(eventName, listenerFunc);
  }

  async startMonitoring(): Promise<void> {
    console.log('WEB: Starting motion monitoring');
    if (this.shakeListener) {
      this.stopMonitoring();
    }
    this.shakeListener = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - this.lastShakeTime < 10000) return; // Cooldown of 10 seconds

      if (event.acceleration) {
        const { x, y, z } = event.acceleration;
        if (x === null || y === null || z === null) return;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        if (acceleration > this.SHAKE_THRESHOLD) {
          this.lastShakeTime = now;
          this.notifyListeners('shakeDetected', {});
        }
      }
    };
    window.addEventListener('devicemotion', this.shakeListener);
  }

  async stopMonitoring(): Promise<void> {
    console.log('WEB: Stopping motion monitoring');
    if (this.shakeListener) {
      window.removeEventListener('devicemotion', this.shakeListener);
      this.shakeListener = null;
    }
  }

  async sendSms(options: { recipients: string[]; message: string }): Promise<void> {
    const numbers = options.recipients.join(',');
    const url = `sms:${numbers}?body=${encodeURIComponent(options.message)}`;
    window.location.href = url;
  }

  async makeCall(options: { number: string }): Promise<void> {
    window.location.href = `tel:${options.number}`;
  }

  async sendSosAndCall(options: { recipient: string; message: string }): Promise<void> {
    const smsUrl = `sms:${options.recipient}?body=${encodeURIComponent(options.message)}`;
    window.location.href = smsUrl;
    // In a web environment, we cannot reliably chain the call after sending an SMS.
    // We can prompt the user as a fallback.
    setTimeout(() => {
        if (confirm(`SOS message prepared for ${options.recipient}. Do you want to call them now?`)) {
            this.makeCall({ number: options.recipient });
        }
    }, 1500); // Give the user time to switch to the SMS app
  }
}
