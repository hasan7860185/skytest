import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw } from "lucide-react";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
  onAuthError: () => void;
}

export function QueryProvider({ children, onAuthError }: QueryProviderProps) {
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__REDUX_DEVTOOLS_EXTENSION__) {
      const warn = console.warn;
      console.warn = (...args: any[]) => {
        if (args[0]?.includes?.('Redux DevTools')) return;
        warn.apply(console, args);
      };
      return () => {
        console.warn = warn;
      };
    }
  }, []);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          console.log('Query retry attempt:', failureCount, error);
          
          if (error?.status === 401 || error?.status === 403) {
            onAuthError();
            return false;
          }

          if (error?.message?.includes('Failed to fetch')) {
            console.log('Network error detected:', error);
            
            if (error?.stack?.includes('kaspersky-labs') || 
                error?.stack?.includes('kis.v2.scr.kaspersky')) {
              setShowSecurityAlert(true);
              toast.error(
                'يبدو أن برنامج الحماية يمنع الاتصال. الرجاء:' + 
                '\n1. تعطيل برامج الحماية مؤقتاً' +
                '\n2. إضافة النطاق jrxxemchkytvqqsvloso.supabase.co إلى القائمة البيضاء'
              );
              return false;
            }

            if (failureCount === 0) {
              toast.warning('جاري محاولة إعادة الاتصال بالخادم...');
            }
            return failureCount < 3;
          }

          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 30000,
        gcTime: 60000, // Replace cacheTime with gcTime
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {showSecurityAlert && (
        <Alert variant="destructive" className="mb-4">
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              يبدو أن برنامج الحماية (Kaspersky) يمنع الاتصال بالخادم. الرجاء:
              <ul className="list-disc list-inside mt-2">
                <li>تعطيل برامج الحماية مؤقتاً</li>
                <li>إضافة النطاق jrxxemchkytvqqsvloso.supabase.co إلى القائمة البيضاء</li>
              </ul>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowSecurityAlert(false);
                window.location.reload();
              }}
              className="mr-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة المحاولة
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {children}
    </QueryClientProvider>
  );
}