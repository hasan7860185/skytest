/// <reference types="vite/client" />

interface Window {
  Capacitor?: {
    isNative: boolean;
    platform?: string;
  };
}

declare namespace Capacitor {
  interface PluginRegistry {
    App: AppPlugin;
  }
}

interface AppPlugin {
  addListener(eventName: string, callback: (data: any) => void): void;
  exitApp(): void;
}