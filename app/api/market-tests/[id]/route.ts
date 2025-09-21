import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { marketTestSchema } from '@/lib/validations'
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

    const { data: marketTest, error } = await supabase
      .from('market_tests')
      .select(`
        *,
        brands(name),
        schools(name)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching market test:', error)
      return NextResponse.json({ error: 'Market test not found' }, { status: 404 })
    }

    return NextResponse.json({ marketTest })
  } catch (error) {
    console.error('Error in market test GET:', error)
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
    
    // Get current market test to check ownership
    const { data: currentTest, error: fetchError } = await supabase
      .from('market_tests')
      .select('brand_id, status')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentTest) {
      return NextResponse.json({ error: 'Market test not found' }, { status: 404 })
    }

    // Get user profile to check permissions
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role, brand_id')
      .eq('user_id', user.id)
      .single()

    const isOwner = userProfile?.brand_id === currentTest.brand_id
    const isSuperAdmin = userProfile?.role === 'super_admin'

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // For super admin operations (approval/activation)
    if (isSuperAdmin && body.status) {
      const updateData: {
        status: string;
        approved_by?: string;
        approved_at?: string;
      } = { status: body.status }
      
      if (body.status === 'active') {
        updateData.approved_by = user.id
        updateData.approved_at = new Date().toISOString()
      }

      const { data: marketTest, error } = await supabase
        .from('market_tests')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating market test status:', error)
        return NextResponse.json({ error: 'Failed to update market test' }, { status: 500 })
      }

      return NextResponse.json({ marketTest })
    }

    // For owner updates (only if draft)
    if (isOwner && currentTest.status === 'draft') {
      const validatedData = marketTestSchema.partial().parse(body)

      const { data: marketTest, error } = await supabase
        .from('market_tests')
        .update(validatedData)
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating market test:', error)
        return NextResponse.json({ error: 'Failed to update market test' }, { status: 500 })
      }

      return NextResponse.json({ marketTest })
    }

    return NextResponse.json({ error: 'Cannot modify active or completed market tests' }, { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }

    console.error('Error in market test PUT:', error)
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

    // Get current market test to check ownership
    const { data: currentTest, error: fetchError } = await supabase
      .from('market_tests')
      .select('brand_id, status')
      .eq('id', params.id)
      .single()

    if (fetchError || !currentTest) {
      return NextResponse.json({ error: 'Market test not found' }, { status: 404 })
    }

    // Get user profile to check permissions
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role, brand_id')
      .eq('user_id', user.id)
      .single()

    const isOwner = userProfile?.brand_id === currentTest.brand_id
    
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (currentTest.status !== 'draft') {
      return NextResponse.json({ error: 'Can only delete draft market tests' }, { status: 400 })
    }

    const { error } = await supabase
      .from('market_tests')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting market test:', error)
      return NextResponse.json({ error: 'Failed to delete market test' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Market test deleted successfully' })
  } catch (error) {
    console.error('Error in market test DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}