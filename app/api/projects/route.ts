import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { projectSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaign_id')
    const userId = searchParams.get('user_id')

    let query = supabase
      .from('projects')
      .select(`
        *,
        campaigns(title, brand_id),
        user_profiles(first_name, last_name, role)
      `)

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: projects, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error in projects GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    // Check if user already has a project for this campaign
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('campaign_id', validatedData.campaign_id)
      .eq('user_id', user.id)
      .single()

    if (existingProject) {
      return NextResponse.json(
        { error: 'You already have a project for this campaign' },
        { status: 400 }
      )
    }

    // Verify campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, status')
      .eq('id', validatedData.campaign_id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.status !== 'active') {
      return NextResponse.json({ error: 'Campaign is not active' }, { status: 400 })
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        ...validatedData,
        user_id: user.id,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }

    console.error('Error in projects POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}