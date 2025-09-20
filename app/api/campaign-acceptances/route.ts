import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { campaignAcceptanceSchema } from '@/lib/validations'
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
      .from('campaign_acceptances')
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

    const { data: acceptances, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching campaign acceptances:', error)
      return NextResponse.json({ error: 'Failed to fetch campaign acceptances' }, { status: 500 })
    }

    return NextResponse.json({ acceptances })
  } catch (error) {
    console.error('Error in campaign acceptances GET:', error)
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
    const validatedData = campaignAcceptanceSchema.parse(body)

    // Check if user already accepted this campaign
    const { data: existingAcceptance } = await supabase
      .from('campaign_acceptances')
      .select('id')
      .eq('campaign_id', validatedData.campaign_id)
      .eq('user_id', user.id)
      .single()

    if (existingAcceptance) {
      return NextResponse.json(
        { error: 'You have already accepted this campaign' },
        { status: 400 }
      )
    }

    // Verify campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, status, public')
      .eq('id', validatedData.campaign_id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.status !== 'active') {
      return NextResponse.json({ error: 'Campaign is not active' }, { status: 400 })
    }

    if (!campaign.public) {
      return NextResponse.json({ error: 'Campaign is not public' }, { status: 400 })
    }

    // Check user role (only students and influencers can accept campaigns)
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!userProfile || !['student', 'influencer'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Only students and influencers can accept campaigns' }, { status: 403 })
    }

    const { data: acceptance, error } = await supabase
      .from('campaign_acceptances')
      .insert({
        campaign_id: validatedData.campaign_id,
        user_id: user.id,
        status: 'accepted',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating campaign acceptance:', error)
      return NextResponse.json({ error: 'Failed to accept campaign' }, { status: 500 })
    }

    return NextResponse.json({ acceptance }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }

    console.error('Error in campaign acceptances POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}