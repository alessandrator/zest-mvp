-- Migration: Ensure user_profiles table has active column
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

-- Ensure any existing users have active = true
UPDATE user_profiles SET active = true WHERE active IS NULL;

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

-- Add comment to document the purpose
COMMENT ON COLUMN user_profiles.active IS 'Indicates if the user profile is active. Default: true';
COMMENT ON COLUMN user_profiles.role IS 'User role in the system. Required field for all profiles';