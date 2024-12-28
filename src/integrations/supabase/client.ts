import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('خطأ: لم يتم العثور على متغيرات البيئة الخاصة بـ Supabase');
}

// إنشاء نسخة واحدة من العميل
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

// تكوين خيارات العميل
const clientOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sky-aqaar-auth',
  },
  global: {
    headers: {
      'x-application-name': 'sky-aqaar',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};

// دالة لإعادة المحاولة في حالة فشل الطلب
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

// دالة للتحقق من حالة الاتصال
async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('clients').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// تصدير كائن العميل مع وظائف إضافية
export const supabase = (() => {
  if (supabaseInstance) return supabaseInstance;

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, clientOptions);

  // إضافة دوال مساعدة للعميل
  const enhancedClient = {
    ...supabaseInstance,
    
    // دالة للتحقق من الاتصال
    checkConnection,
    
    // دالة لإعادة المحاولة
    async retryQuery<T>(query: () => Promise<T>): Promise<T> {
      return retryOperation(query);
    },
    
    // دالة للتحقق من الجلسة
    async validateSession() {
      const { data: { session }, error } = await this.auth.getSession();
      if (error) throw error;
      return session;
    },
    
    // دالة لإعادة الاتصال
    async reconnect() {
      try {
        await this.removeAllChannels();
        await this.removeAllSubscriptions();
        supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey, clientOptions);
        return true;
      } catch (error) {
        console.error('فشل في إعادة الاتصال:', error);
        return false;
      }
    }
  };

  return enhancedClient;
})();

// التحقق من الاتصال عند بدء التطبيق
checkConnection().then(isConnected => {
  if (!isConnected) {
    console.warn('تحذير: فشل الاتصال بـ Supabase');
  }
});

export default supabase;