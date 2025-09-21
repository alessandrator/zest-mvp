# ZEST MVP - Supabase Integration Setup Guide

This document provides instructions for setting up Supabase integration with the ZEST MVP application.

## Required Environment Variables

The following environment variables must be configured in your `.env.local` file:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

## Database Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key from the project settings
3. Update your `.env.local` file with the credentials

### 2. Run Database Schema

Execute the SQL scripts in order:

1. **Schema**: Run `/db/schema.sql` in the Supabase SQL editor
2. **Policies**: Run `/db/policies.sql` in the Supabase SQL editor

This will create:
- All core tables (users, brands, schools, campaigns, etc.)
- The `user_profiles` table for user profile data
- The new `access_requests` table for form submissions
- Row Level Security (RLS) policies
- Required indexes and triggers

### 3. Troubleshooting Registration Issues

If you encounter the error "Could not find the table 'public.user_profiles' in the schema cache" during user registration:

1. **Check if user_profiles table exists**: In your Supabase SQL editor, run:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'user_profiles';
   ```

2. **If the table doesn't exist or has issues**: Run the migration script:
   ```sql
   -- Run the contents of /db/migrations/001_create_user_profiles_table.sql
   ```

3. **Verify the table was created**: Check that the table exists and has the correct structure:
   ```sql
   \d user_profiles
   ```

### 3. Enable Row Level Security

The following tables have RLS enabled with appropriate policies:

- `schools` - Super admins can manage, others read-only access
- `brands` - Brand users can manage their own brand, super admins all
- `user_profiles` - Users can manage their own profile, admins can view
- `campaigns` - Brand users manage their campaigns, others read active campaigns
- `campaign_applications` - Users manage their applications, brands read theirs
- `notifications` - Users read/update their notifications
- `access_requests` - Anyone can insert, only super admins can read/manage

## New Features Implemented

### 1. Access Request API (`/api/request-access`)

**Endpoint**: `POST /api/request-access`

**Request Body**:
```json
{
  "email": "user@example.com",
  "role": "student",
  "first_name": "John",
  "last_name": "Doe",
  "company": "Optional Company Name",
  "message": "Why I want to join ZEST..."
}
```

**Response**:
- **Success (201)**: `{ "message": "Access request submitted successfully!", "data": {...} }`
- **Duplicate (409)**: `{ "error": "An access request with this email already exists..." }`
- **Validation Error (400)**: `{ "error": "Invalid request data", "details": [...] }`
- **Server Error (500)**: `{ "error": "Failed to submit access request. Please try again." }`

### 2. Forgot Password Page (`/forgot-password`)

**Features**:
- Email validation with Zod schema
- Supabase auth integration (`resetPasswordForEmail`)
- Environment variable validation
- User feedback with success/error states
- Responsive design matching existing UI

**Error Handling**:
- Invalid email format
- User not found
- Rate limiting
- Supabase configuration issues

### 3. Environment Variable Validation

**Runtime Checks**:
- Validates required Supabase environment variables
- Provides helpful error messages for missing/invalid values
- Graceful fallbacks for development/build environments
- Mock clients when Supabase is not configured

## API Testing

### Test Access Request Submission

```bash
curl -X POST http://localhost:3000/api/request-access \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "role": "student",
    "first_name": "Test",
    "last_name": "User",
    "company": "",
    "message": "I want to join ZEST to create content."
  }'
```

## Security Features

### Row Level Security (RLS) Policies

1. **Access Requests**:
   - `INSERT`: Anyone can submit access requests
   - `SELECT/UPDATE/DELETE`: Only super admins

2. **Authentication**:
   - Forgot password flow uses Supabase Auth
   - Password reset links expire automatically
   - Rate limiting on reset attempts

### Data Validation
- Email format validation
- Required field validation
- Role enum validation
- Message length limits (500 chars)
- XSS protection through input sanitization

## Error Handling

### Client-Side
- Form validation with Zod schemas
- Toast notifications for success/error states
- Loading states during API calls
- Input sanitization and validation

### Server-Side
- Comprehensive error catching and logging
- Proper HTTP status codes
- Detailed error messages for debugging
- Supabase error handling (duplicates, constraints, etc.)

## Troubleshooting

### Common Issues

1. **"Invalid supabaseUrl" Error**:
   - Check `.env.local` file exists
   - Verify environment variable names
   - Ensure no placeholder values

2. **RLS Policy Denials**:
   - Check user authentication status
   - Verify policy conditions
   - Test with super admin account

3. **Form Submission Failures**:
   - Check API endpoint accessibility
   - Verify request payload format
   - Check Supabase connection status

---

*Last updated: December 2024*