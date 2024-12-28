import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Received request to get-user-sessions")
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    const { userId } = await req.json()
    console.log("Getting sessions for user:", userId)

    if (!userId) {
      throw new Error('User ID is required')
    }

    // Get the user's active sessions
    const { data: sessions, error } = await supabaseClient.auth.admin.listUserSessions(userId)

    if (error) {
      console.error("Error fetching sessions:", error)
      throw error
    }

    // Map sessions to a more friendly format
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      userId: session.user_id,
      lastActiveAt: session.updated_at || session.created_at,
      ip: session.ip || '0.0.0.0',
      userAgent: session.user_agent || 'Unknown',
      isMobile: session.user_agent?.toLowerCase().includes('mobile') || false,
      browser: getBrowserInfo(session.user_agent),
      os: getOSInfo(session.user_agent)
    }))

    console.log(`Found ${formattedSessions.length} active sessions for user ${userId}`)

    return new Response(
      JSON.stringify(formattedSessions),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )

  } catch (error) {
    console.error("Error in get-user-sessions function:", error)
    
    // Check if error is from security software
    const isSecurityBlock = error.message?.includes('Failed to fetch') && 
                          error.stack?.includes('gpteng.co')
    
    const errorResponse = {
      error: error.message,
      details: error.stack,
      isSecurityBlock
    }

    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: isSecurityBlock ? 403 : 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

// Helper functions to parse user agent string
function getBrowserInfo(userAgent?: string): string {
  if (!userAgent) return 'Unknown'
  
  const browsers = {
    'Chrome': /Chrome\/(\d+)/,
    'Firefox': /Firefox\/(\d+)/,
    'Safari': /Safari\/(\d+)/,
    'Edge': /Edge\/(\d+)/,
    'Opera': /Opera\/(\d+)/
  }

  for (const [name, regex] of Object.entries(browsers)) {
    if (regex.test(userAgent)) {
      return name
    }
  }
  
  return 'Unknown'
}

function getOSInfo(userAgent?: string): string {
  if (!userAgent) return 'Unknown'
  
  const os = {
    'Windows': /Windows NT/,
    'Mac': /Mac OS X/,
    'iOS': /iPhone|iPad|iPod/,
    'Android': /Android/,
    'Linux': /Linux/
  }

  for (const [name, regex] of Object.entries(os)) {
    if (regex.test(userAgent)) {
      return name
    }
  }
  
  return 'Unknown'
}