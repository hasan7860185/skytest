import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting list-users function execution')

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user making the request has permission
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Authentication error:', authError)
      throw new Error('Not authenticated')
    }

    // Verify admin role
    const { data: profile, error: profileError } = await supabaseAdmin
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

    // Fetch all users
    const { data: { users: allUsers }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw new Error('Error fetching users')
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw new Error('Error fetching profiles')
    }

    // Create a map of profiles by user ID
    const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]))

    // Create missing profiles
    for (const user of allUsers) {
      if (!profilesMap.has(user.id)) {
        console.log(`Creating profile for user ${user.id}`)
        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.email?.split('@')[0] || 'Unknown',
            role: 'employee',
            status: 'active'
          })
        
        if (insertError) {
          console.error('Error creating profile for user:', user.id, insertError)
        }
      }
    }

    // Get updated profiles after creating missing ones
    const { data: updatedProfiles } = await supabaseAdmin
      .from('profiles')
      .select('*')

    // Create updated map
    const updatedProfilesMap = new Map(updatedProfiles?.map(profile => [profile.id, profile]))

    // Combine users with their profiles
    const combinedUsers = allUsers.map(user => ({
      id: user.id,
      email: user.email,
      full_name: updatedProfilesMap.get(user.id)?.full_name || user.email?.split('@')[0] || 'Unknown',
      role: updatedProfilesMap.get(user.id)?.role || 'employee',
      status: updatedProfilesMap.get(user.id)?.status || 'active',
      avatar: updatedProfilesMap.get(user.id)?.avatar || null,
      created_at: updatedProfilesMap.get(user.id)?.created_at || user.created_at,
      updated_at: updatedProfilesMap.get(user.id)?.updated_at || user.updated_at,
      company_id: updatedProfilesMap.get(user.id)?.company_id || null,
      notification_settings: updatedProfilesMap.get(user.id)?.notification_settings || null
    }))

    console.log('Successfully processed users data')

    return new Response(
      JSON.stringify(combinedUsers),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in list-users function:', error)
    
    const status = error.message?.includes('Not authenticated') ? 401 
      : error.message?.includes('Unauthorized') ? 403 
      : 500

    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
        type: error.name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status
      }
    )
  }
})