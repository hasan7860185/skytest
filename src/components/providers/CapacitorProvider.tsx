import { useEffect } from "react";
import { toast } from "sonner";

// Import Capacitor dynamically to avoid build issues
let CapacitorApp: any;
if (typeof window !== 'undefined') {
  import('@capacitor/app').then(module => {
    CapacitorApp = module.App;
  }).catch(err => {
    console.warn('Capacitor import error:', err);
  });
}

interface CapacitorProviderProps {
  children: React.ReactNode;
}

export function CapacitorProvider({ children }: CapacitorProviderProps) {
  useEffect(() => {
    const setupBackButton = async () => {
      try {
        if (window.Capacitor?.isNative && CapacitorApp) {
          console.log('Setting up Capacitor back button handler');
          await CapacitorApp.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
            if (canGoBack) {
              window.history.back();
            } else {
              CapacitorApp.exitApp();
            }
          });
        }
      } catch (error) {
        console.warn('Capacitor setup error:', error);
        if (window.Capacitor?.isNative) {
          toast.error('خطأ في إعداد التطبيق');
        }
      }
    };

    setupBackButton();

    return () => {
      if (window.Capacitor?.isNative && CapacitorApp) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);

  return <>{children}</>;
}