import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { voteSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const campaignId = searchParams.get('campaign_id')
    const userId = searchParams.get('user_id')

    let query = supabase
      .from('votes')
      .select(`
        *,
        projects(title, campaign_id),
        campaigns(title),
        user_profiles(first_name, last_name)
      `)

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: votes, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching votes:', error)
      return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 })
    }

    return NextResponse.json({ votes })
  } catch (error) {
    console.error('Error in votes GET:', error)
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
    const validatedData = voteSchema.parse(body)

    // Check if user already voted on this project/campaign
    let existingVoteQuery = supabase
      .from('votes')
      .select('id')
      .eq('user_id', user.id)

    if (validatedData.project_id) {
      existingVoteQuery = existingVoteQuery.eq('project_id', validatedData.project_id)
    } else {
      existingVoteQuery = existingVoteQuery.eq('campaign_id', validatedData.campaign_id)
    }

    const { data: existingVote } = await existingVoteQuery.single()

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this item' },
        { status: 400 }
      )
    }

    // Verify the target (project or campaign) exists
    if (validatedData.project_id) {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, status')
        .eq('id', validatedData.project_id)
        .single()

      if (projectError || !project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      if (project.status !== 'approved') {
        return NextResponse.json({ error: 'Can only vote on approved projects' }, { status: 400 })
      }
    } else if (validatedData.campaign_id) {
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('id, status')
        .eq('id', validatedData.campaign_id)
        .single()

      if (campaignError || !campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }

      if (campaign.status !== 'active') {
        return NextResponse.json({ error: 'Can only vote on active campaigns' }, { status: 400 })
      }
    }

    const { data: vote, error } = await supabase
      .from('votes')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating vote:', error)
      return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
    }

    return NextResponse.json({ vote }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }

    console.error('Error in votes POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}