/**
 * Environment variable validation and configuration
 */

interface EnvironmentConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  NEXT_PUBLIC_APP_URL: string;
}

export function validateEnvironmentVariables(): EnvironmentConfig {
  const requiredEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }

  const optionalEnvVars = {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  // Check for missing required environment variables
  const missingVars: string[] = []
  const invalidVars: string[] = []

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key)
    } else if (value.includes('placeholder') || value.includes('your_')) {
      invalidVars.push(key)
    }
  }

  if (missingVars.length > 0 || invalidVars.length > 0) {
    const errorMessage = []
    
    if (missingVars.length > 0) {
      errorMessage.push(`Missing required environment variables: ${missingVars.join(', ')}`)
    }
    
    if (invalidVars.length > 0) {
      errorMessage.push(`Invalid placeholder values for: ${invalidVars.join(', ')}`)
    }

    errorMessage.push('\nPlease check your .env.local file and ensure all Supabase credentials are properly configured.')
    
    throw new Error(errorMessage.join('\n'))
  }

  return {
    ...requiredEnvVars,
    ...optionalEnvVars,
  } as EnvironmentConfig
}

export function getEnvironmentConfig(): EnvironmentConfig {
  try {
    return validateEnvironmentVariables()
  } catch (error) {
    // In development or build time, log the error but don't crash the app
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
      console.warn('Environment validation warning:', error)
      
      // Return placeholder values for development/build
      return {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    }
    
    // In production, re-throw the error
    throw error
  }
}

export function isSupabaseConfigured(): boolean {
  try {
    const config = validateEnvironmentVariables()
    return !!(config.NEXT_PUBLIC_SUPABASE_URL && 
              config.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
              !config.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
              !config.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder'))
  } catch {
    return false
  }
}