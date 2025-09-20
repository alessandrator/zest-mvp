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
- The new `access_requests` table for form submissions
- Row Level Security (RLS) policies
- Required indexes and triggers

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

### 3. Enhanced Signup Form with Password Validation

**Features** (Implemented in PR #25):
- Advanced password validation with real-time feedback
- Role-based conditional form fields
- Comprehensive form validation using Zod schemas
- Supabase Auth integration for user registration
- Clear error messaging and success feedback

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one number (0-9)
- Real-time validation with specific error messages

**Role-Based Fields**:
- Company field appears only for "Brand" and "School Admin" roles
- Dynamic form behavior based on user selection
- Proper form state management

### 4. Environment Variable Validation

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

### Test Signup API with Enhanced Validation

```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Password123",
    "first_name": "New",
    "last_name": "User",
    "role": "student",
    "company": ""
  }'
```

**Expected Responses**:

✅ **Success (201)**:
```json
{
  "message": "Account created successfully! Please check your email to verify your account.",
  "user": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "profile": { ... }
  }
}
```

❌ **Password Validation Error (400)**:
```json
{
  "error": "Invalid request data",
  "details": [
    {
      "path": ["password"],
      "message": "Password must contain at least one uppercase letter"
    }
  ]
}
```

❌ **Duplicate Email (409)**:
```json
{
  "error": "An account with this email already exists. Please sign in instead."
}
```

## UI Testing & User Feedback Validation

### Password Validation Testing (PR #25 Features)

The signup form includes sophisticated password validation that provides real-time feedback. Here's how to test it:

#### 1. **Access the Signup Form**
- **Local**: `http://localhost:3000/signup`
- **Vercel Preview**: `https://your-preview-url.vercel.app/signup`

#### 2. **Test Password Validation Scenarios**

| Test Case | Input | Expected Error Message |
|-----------|-------|------------------------|
| Too Short | `Pass1` | "Password must be at least 8 characters" |
| No Uppercase | `password123` | "Password must contain at least one uppercase letter" |
| No Number | `Password` | "Password must contain at least one number" |
| Valid | `Password123` | ✅ No error (green indicator) |

#### 3. **Test Role-Based Form Behavior**

| Role | Company Field Visibility | Expected Behavior |
|------|-------------------------|-------------------|
| Student | Hidden | Form shows only basic fields |
| Influencer | Hidden | Form shows only basic fields |
| Consumer | Hidden | Form shows only basic fields |
| Brand | Visible | Company field appears with proper label |
| School Admin | Visible | Company field appears with proper label |

#### 4. **Visual Feedback Validation**

**Error States**:
- Input field border turns red (`border-red-500`)
- Error message appears below field in red text
- Specific, helpful error messages (not generic)

**Success States**:
- Error messages disappear when typing valid input
- Form submission shows loading spinner
- Success toast notification on completion

**Screenshots Reference** (from PR #25):
- `docs/screenshots/signup-form-initial.png` - Initial form state
- `docs/screenshots/signup-form-validation-working.png` - Validation errors
- `docs/screenshots/signup-form-brand-company-field.png` - Brand role selected
- `docs/screenshots/login-page-with-signup-links.png` - Updated login links

### Vercel Preview Testing Instructions

#### 1. **Accessing Preview Deployments**
When you create a pull request, Vercel automatically generates a preview deployment:

1. Go to your GitHub pull request
2. Look for Vercel bot comment with deployment links
3. Click on the preview URL (format: `https://zest-mvp-{hash}.vercel.app`)

#### 2. **Testing in Preview Environment**
- Test all signup form functionality
- Verify password validation works in production environment
- Check that role-based fields behave correctly
- Confirm API endpoints respond properly

#### 3. **Performance Testing**
- Measure form submission response time
- Check for any console errors in production build
- Verify all assets (images, fonts) load correctly

### Common UI Testing Issues & Solutions

#### Issue: Password validation not working
**Solution**: Check browser console for JavaScript errors and verify validation schema in `lib/validations/index.ts`

#### Issue: Company field not showing/hiding
**Solution**: Verify role state management in form component and check conditional rendering logic

#### Issue: Form submission errors
**Solution**: Check Network tab in DevTools, verify API endpoint `/api/signup` is accessible

#### Issue: Toast notifications not appearing
**Solution**: Ensure Sonner toast provider is properly configured in app layout

### Accessibility Testing Checklist

- [ ] Form can be navigated using keyboard only (Tab order)
- [ ] Error messages are announced by screen readers
- [ ] Form labels are properly associated with inputs
- [ ] Color contrast meets WCAG guidelines
- [ ] Focus indicators are visible and clear

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

### UI/UX Specific Issues

4. **Password Validation Not Working**:
   ```bash
   # Check if validation schema is correct
   grep -A 5 "signUpSchema" lib/validations/index.ts
   
   # Expected output should include regex patterns:
   # .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
   # .regex(/[0-9]/, 'Password must contain at least one number')
   ```

5. **Company Field Visibility Issues**:
   - Verify role selection triggers state update
   - Check conditional rendering logic in signup form
   - Test with browser DevTools to inspect form state

6. **API Integration Issues**:
   ```bash
   # Test signup API endpoint
   curl -X POST http://localhost:3000/api/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123","first_name":"Test","last_name":"User","role":"student"}'
   ```

7. **Toast Notifications Not Showing**:
   - Check if Sonner is properly imported and configured
   - Verify toast provider is in app layout
   - Check for JavaScript console errors

### Testing Environment Setup

8. **Setting up Complete Testing Environment**:
   
   ```bash
   # 1. Install dependencies
   npm install
   
   # 2. Copy environment file
   cp .env.example .env.local
   
   # 3. Start development server
   npm run dev
   
   # 4. Test signup form at http://localhost:3000/signup
   ```

9. **Supabase Configuration for Testing**:
   - Create test Supabase project
   - Run schema.sql in Supabase SQL editor
   - Update .env.local with test credentials
   - Test complete signup flow with real database

### Debug Mode Testing

10. **Enable Debug Mode**:
    ```typescript
    // Add to signup form for debugging
    console.log('Form state:', formData);
    console.log('Validation errors:', validationErrors);
    ```

11. **Network Request Debugging**:
    - Open Chrome DevTools → Network tab
    - Submit form and check API requests
    - Verify request payload and response
    - Check for proper error handling

---

*Last updated: December 2024*