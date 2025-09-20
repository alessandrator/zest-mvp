import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { projectSchema } from '@/lib/validations'
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

    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        campaigns(title, brand_id),
        user_profiles(first_name, last_name, role)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error in project GET:', error)
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
    
    // Get current project to check ownership and status
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('user_id, status')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if user owns the project or is super admin
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const isOwner = currentProject.user_id === user.id
    const isSuperAdmin = userProfile?.role === 'super_admin'

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // For super admin operations (approval/rejection)
    if (isSuperAdmin && body.status) {
      const updateData: {
        status: string;
        approved_by?: string;
        approved_at?: string;
        rejection_reason?: string;
      } = { status: body.status }
      
      if (body.status === 'approved') {
        updateData.approved_by = user.id
        updateData.approved_at = new Date().toISOString()
      } else if (body.status === 'rejected') {
        updateData.rejection_reason = body.rejection_reason
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating project status:', error)
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
      }

      return NextResponse.json({ project })
    }

    // For project owner updates (only if draft or rejected)
    if (isOwner && ['draft', 'rejected'].includes(currentProject.status)) {
      const validatedData = projectSchema.partial().parse(body)
      
      const updateData = {
        ...validatedData,
        ...(body.submit && { status: 'submitted', submitted_at: new Date().toISOString() })
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating project:', error)
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
      }

      return NextResponse.json({ project })
    }

    return NextResponse.json({ error: 'Cannot modify submitted or approved projects' }, { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }

    console.error('Error in project PUT:', error)
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

    // Get current project to check ownership
    const { data: currentProject, error: fetchError } = await supabase
      .from('projects')
      .select('user_id, status')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Only project owner can delete, and only if draft
    if (currentProject.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (currentProject.status !== 'draft') {
      return NextResponse.json({ error: 'Can only delete draft projects' }, { status: 400 })
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error in project DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}