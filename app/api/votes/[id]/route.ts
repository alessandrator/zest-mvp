import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { voteSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: vote, error } = await supabase
      .from('votes')
      .select(`
        *,
        projects(title, campaign_id),
        campaigns(title),
        user_profiles(first_name, last_name)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching vote:', error)
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 })
    }

    return NextResponse.json({ vote })
  } catch (error) {
    console.error('Error in vote GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Get current vote to check ownership
    const { data: currentVote, error: fetchError } = await supabase
      .from('votes')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentVote) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 })
    }

    // Only the voter can update their vote
    if (currentVote.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const validatedData = voteSchema.partial().parse(body)
    
    const { data: vote, error } = await supabase
      .from('votes')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating vote:', error)
      return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 })
    }

    return NextResponse.json({ vote })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }

    console.error('Error in vote PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current vote to check ownership
    const { data: currentVote, error: fetchError } = await supabase
      .from('votes')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentVote) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 })
    }

    // Only the voter can delete their vote
    if (currentVote.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting vote:', error)
      return NextResponse.json({ error: 'Failed to delete vote' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Vote deleted successfully' })
  } catch (error) {
    console.error('Error in vote DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}