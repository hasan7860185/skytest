import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const fetchUsers = async (supabaseClient: SupabaseClient) => {
  const { data: { users }, error: usersError } = await supabaseClient.auth.admin.listUsers()
  
  if (usersError) {
    console.error('Error fetching users:', usersError)
    throw new Error('Error fetching users')
  }

  console.log(`Found ${users?.length || 0} users`)
  return users
}

export const fetchProfiles = async (supabaseClient: SupabaseClient) => {
  const { data: profiles, error: profilesError } = await supabaseClient
    .from('profiles')
    .select('*')
  
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
    throw new Error('Error fetching profiles')
  }

  console.log(`Found ${profiles?.length || 0} profiles`)
  return profiles
}

export const createMissingProfiles = async (
  supabaseClient: SupabaseClient,
  users: any[],
  profilesMap: Map<string, any>
) => {
  for (const user of users) {
    if (!profilesMap.has(user.id)) {
      console.log(`Creating profile for user ${user.id}`)
      const { error: insertError } = await supabaseClient
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
}