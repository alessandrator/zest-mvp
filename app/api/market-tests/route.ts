import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { marketTestSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brand_id')
    const schoolId = searchParams.get('school_id')
    const status = searchParams.get('status')

    let query = supabase
      .from('market_tests')
      .select(`
        *,
        brands(name),
        schools(name)
      `)

    if (brandId) {
      query = query.eq('brand_id', brandId)
    }

    if (schoolId) {
      query = query.eq('school_id', schoolId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: marketTests, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching market tests:', error)
      return NextResponse.json({ error: 'Failed to fetch market tests' }, { status: 500 })
    }

    return NextResponse.json({ marketTests })
  } catch (error) {
    console.error('Error in market tests GET:', error)
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
    const validatedData = marketTestSchema.parse(body)

    // Get user profile to check role and get brand_id
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, brand_id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Only brands and school admins can create market tests
    if (!['brand', 'school_admin'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Forbidden: Only brands and schools can create market tests' }, { status: 403 })
    }

    if (userProfile.role === 'brand' && !userProfile.brand_id) {
      return NextResponse.json({ error: 'Brand profile required' }, { status: 400 })
    }

    const { data: marketTest, error } = await supabase
      .from('market_tests')
      .insert({
        ...validatedData,
        brand_id: userProfile.brand_id,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating market test:', error)
      return NextResponse.json({ error: 'Failed to create market test' }, { status: 500 })
    }

    return NextResponse.json({ marketTest }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }

    console.error('Error in market tests POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}