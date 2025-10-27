-- Migration: Ensure user_profiles table has all required columns
-- This migration ensures the user_profiles table structure is correct

-- Add active column if it doesn't exist (safe operation)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'active'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN active BOOLEAN DEFAULT true NOT NULL;
    END IF;
END $$;

-- Add company column if it doesn't exist (safe operation)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'company'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN company VARCHAR(255);
    END IF;
END $$;

-- Add verified column if it doesn't exist (safe operation)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'verified'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN verified BOOLEAN DEFAULT false NOT NULL;
    END IF;
END $$;

-- Add email column if it doesn't exist (safe operation)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'email'
    ) THEN
        -- Add email column first as nullable
        ALTER TABLE user_profiles ADD COLUMN email VARCHAR(255);
        
        -- Update existing records with email from auth.users
        UPDATE user_profiles 
        SET email = au.email 
        FROM auth.users au 
        WHERE user_profiles.user_id = au.id 
        AND user_profiles.email IS NULL;
        
        -- Now make it NOT NULL
        ALTER TABLE user_profiles ALTER COLUMN email SET NOT NULL;
    END IF;
END $$;

-- Ensure any existing users have correct default values
UPDATE user_profiles SET active = true WHERE active IS NULL;
UPDATE user_profiles SET verified = false WHERE verified IS NULL;

-- Ensure role column is NOT NULL (it should already be, but for safety)
DO $$
BEGIN
    -- Check if role column allows NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'role' 
        AND is_nullable = 'YES'
    ) THEN
        -- Update any NULL roles to 'student' as default
        UPDATE user_profiles SET role = 'student' WHERE role IS NULL;
        
        -- Make role NOT NULL
        ALTER TABLE user_profiles ALTER COLUMN role SET NOT NULL;
    END IF;
END $$;

-- Add comments to document the purpose
COMMENT ON COLUMN user_profiles.active IS 'Indicates if the user profile is active. Default: true';
COMMENT ON COLUMN user_profiles.company IS 'Company or organization name for the user';
COMMENT ON COLUMN user_profiles.verified IS 'Indicates if the user profile is verified. Default: false';
COMMENT ON COLUMN user_profiles.email IS 'User email address, required for all profiles';
COMMENT ON COLUMN user_profiles.role IS 'User role in the system. Required field for all profiles';