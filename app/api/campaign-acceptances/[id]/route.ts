import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

    // Get current acceptance to check ownership
    const { data: currentAcceptance, error: fetchError } = await supabase
      .from('campaign_acceptances')
      .select('user_id, campaign_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentAcceptance) {
      return NextResponse.json({ error: 'Campaign acceptance not found' }, { status: 404 })
    }

    // Only the user who accepted can withdraw the acceptance
    if (currentAcceptance.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if user has already submitted a project for this campaign
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id, status')
      .eq('campaign_id', currentAcceptance.campaign_id)
      .eq('user_id', user.id)
      .single()

    if (existingProject && existingProject.status !== 'draft') {
      return NextResponse.json(
        { error: 'Cannot withdraw acceptance after submitting a project' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('campaign_acceptances')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting campaign acceptance:', error)
      return NextResponse.json({ error: 'Failed to withdraw campaign acceptance' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Campaign acceptance withdrawn successfully' })
  } catch (error) {
    console.error('Error in campaign acceptance DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}