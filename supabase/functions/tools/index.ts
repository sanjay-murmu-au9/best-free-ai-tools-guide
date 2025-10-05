import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const toolId = pathParts[pathParts.length - 1]

    // GET /tools/:id
    if (req.method === 'GET' && toolId && toolId !== 'tools') {
      const { data, error } = await supabase
        .from('tools')
        .select(`*, category:categories(*)`)
        .eq('id', toolId)
        .single()

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // GET /tools
    if (req.method === 'GET') {
      const category = url.searchParams.get('category')
      const search = url.searchParams.get('search')
      const limit = url.searchParams.get('limit') || '50'

      let query = supabase
        .from('tools')
        .select(`*, category:categories(*)`)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit))

      if (category) {
        query = query.eq('category_id', category)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data, error } = await query
      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})