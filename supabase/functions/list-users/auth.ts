import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const verifyAdmin = async (authHeader: string) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { Authorization: authHeader }
      }
    }
  )

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
  if (authError || !user) {
    console.error('Authentication error:', authError)
    throw new Error('Not authenticated')
  }

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    throw new Error('Error fetching user profile')
  }

  if (profile?.role !== 'admin') {
    console.error('Unauthorized access attempt by non-admin user:', user.id)
    throw new Error('Unauthorized - Admin access required')
  }

  return { supabaseClient, userId: user.id }
}