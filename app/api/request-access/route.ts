import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requestAccessSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validazione dati (Zod)
    let validatedData
    try {
      validatedData = requestAccessSchema.parse(body)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { 
            error: 'Dati non validi',
            details: error.issues
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Signup Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      console.error('Errore signup Supabase:', authError)
      return NextResponse.json(
        { error: authError.message || 'Errore durante la creazione dell\'account.' },
        { status: 400 }
      )
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: 'Utente non creato, riprova.' },
        { status: 500 }
      )
    }

    // Crea profilo utente (inserisce anche il ruolo)
    const userProfile = {
  user_id: authData.user.id,
  email: validatedData.email, // 
  role: validatedData.role,
  first_name: validatedData.first_name,
  last_name: validatedData.last_name,
  company: validatedData.company || null,
  verified: false,
  active: true,
    };

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([userProfile])
      .select()
      .single()

    if (profileError) {
      console.error('Errore creazione profilo:', profileError)
      // Prova a cancellare l'utente se la creazione profilo fallisce (richiede service role key)
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (deleteError) {
        console.warn('Errore cancellazione utente dopo fallimento profilo:', deleteError)
      }
      return NextResponse.json(
        { error: profileError.message || 'Errore durante la creazione del profilo utente.' },
        { status: 500 }
      )
    }

    // (Facoltativo) Salva la richiesta di accesso per tracking admin
    try {
      await supabase
        .from('access_requests')
        .insert([{
          email: validatedData.email,
          role: validatedData.role,
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          company: validatedData.company || null,
          message: validatedData.message,
          user_id: authData.user.id,
          status: 'approved',
          password: '[REDACTED]', // Non salvare la password!
        }])
    } catch (error) {
      console.log('Tabella access_requests non trovata o errore scrittura:', error)
      // Non bloccare la registrazione per questo errore
    }

    // Tutto OK!
    return NextResponse.json(
      { 
        message: 'Account creato con successo! Controlla la tua email per la verifica.',
        data: {
          user: authData.user,
          profile: profileData
        }
      },
      { status: 201 }
    )

  } catch (error: unknown) {
    console.error('Errore generico API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: errorMessage || 'Errore interno del server.' },
      { status: 500 }
    )
  }
}