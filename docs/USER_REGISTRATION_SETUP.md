# User Registration Flow - Setup Instructions

## Database Migration

Before using the updated registration system, run the migration to ensure your database structure is correct:

```sql
-- Run this in your Supabase SQL editor or psql
\i db/migrations/001_ensure_user_profiles_active_column.sql
```

### What the Migration Does

1. **Adds `active` column** if missing from `user_profiles` table (default: `true`)
2. **Ensures `role` column** is properly constrained as NOT NULL
3. **Updates existing records** to have `active = true` if they were NULL
4. **Safe to run multiple times** - uses conditional checks

## Registration Flow Features

### ✅ Working Features

- **Password Validation**: 8+ characters, uppercase letter, number required
- **Role Selection**: Student, Influencer, Consumer, Brand Representative, School Administrator
- **Automatic Profile Creation**: Creates user_profiles record with selected role
- **Active Status**: All new users get `active = true` by default
- **Role-based Redirects**: After login, users are redirected to appropriate dashboards

### User Registration Process

1. User fills signup form at `/signup`
2. Form validates password requirements in real-time
3. User selects their role from dropdown
4. Backend creates Supabase auth user
5. Backend creates user_profiles record with:
   - Selected role (e.g., "student")
   - `active = true`
   - `verified = false`
   - User's name and email

### Dashboard Redirects

After successful login, users are automatically redirected based on their role:

- **Student/Influencer** → `/dashboard/student`  
- **Brand Representative** → `/dashboard/brand`
- **School Administrator** → `/dashboard/school`
- **Super Admin** → `/dashboard/admin`
- **Others** → `/dashboard` (general dashboard)

## Testing the Registration

### Manual Testing Steps

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to signup page**: http://localhost:3000/signup

3. **Fill the form with test data**:
   - First Name: Mario
   - Last Name: Rossi  
   - Email: mario.rossi@student.test
   - Password: TestPassword123
   - Role: Student

4. **Submit the form** - should show success message

5. **Check database** - verify user_profiles record was created with:
   - `role = 'student'`
   - `active = true`
   - `verified = false`

### Database Verification

Run this query in Supabase to verify the user was created correctly:

```sql
SELECT 
  up.role,
  up.active,
  up.verified,
  up.first_name,
  up.last_name,
  au.email
FROM user_profiles up
JOIN auth.users au ON up.user_id = au.id
ORDER BY up.created_at DESC
LIMIT 5;
```

## Environment Setup

### Required Environment Variables

Create `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Supabase Setup

1. **Create project** in Supabase dashboard
2. **Run the schema**: Copy content from `db/schema.sql` to SQL editor
3. **Run the migration**: Copy content from `db/migrations/001_ensure_user_profiles_active_column.sql`
4. **Set up RLS policies**: Copy content from `db/policies.sql`

## Troubleshooting

### Common Issues

**Error: "column 'active' does not exist"**
- Solution: Run the migration `db/migrations/001_ensure_user_profiles_active_column.sql`

**Error: "role cannot be null"**  
- Solution: Check that the signup form is passing the role correctly
- Verify the migration has run to make role NOT NULL

**User created but no profile record**
- Solution: Check Supabase service role key is correct
- Verify user_profiles table exists and has proper permissions

**Dashboard redirect not working**
- Solution: Verify user has valid role in user_profiles table
- Check authentication middleware is working

### Development Commands

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npx tsc --noEmit --skipLibCheck
```

## What's Fixed

### Previously Broken
- ❌ Syntax errors in signup API route
- ❌ TypeScript compilation errors
- ❌ Missing active field in TypeScript types
- ❌ UI showing copilot markers
- ❌ Duplicate form attributes

### Now Working
- ✅ Clean signup form UI
- ✅ Proper role saving during registration  
- ✅ Active status automatically set to true
- ✅ Role-based dashboard redirects
- ✅ Password validation with requirements
- ✅ TypeScript compilation without errors
- ✅ Database migration for safe structure updates

The registration flow is now fully functional for non-technical users who just need to set up their Supabase credentials and run the migration.