import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jrxxemchkytvqqsvloso.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyeHhlbWNoa3l0dnFxc3Zsb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwOTMyNjMsImV4cCI6MjA0ODY2OTI2M30.rQegO5QBiNn-NztTcvFynHZ5yxvtdIcTVDXohaRQxbg';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('خطأ: لم يتم العثور على متغيرات البيئة الخاصة بـ Supabase');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sky-aqaar-auth',
  },
});

export default supabase;