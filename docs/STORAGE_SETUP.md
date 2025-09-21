# Supabase Storage Configuration

This document outlines the required storage buckets for the ZEST MVP platform.

## Required Storage Buckets

### 1. Profile Images (`profile-images`)
- **Purpose**: User profile pictures and avatars
- **Access**: Public read, authenticated write
- **File types**: JPEG, PNG, WebP
- **Size limit**: 5MB per file
- **Path structure**: `{user_id}/{timestamp}_{random}.{ext}`

### 2. Campaign Assets (`campaign-assets`)
- **Purpose**: Campaign briefs, reference images, and promotional materials
- **Access**: Public read, brand/school admin write
- **File types**: JPEG, PNG, WebP, PDF
- **Size limit**: 10MB per file
- **Path structure**: `{brand_id}/{campaign_id}/{timestamp}_{random}.{ext}`

### 3. Project Files (`project-files`)
- **Purpose**: Student/creator project submissions
- **Access**: Authenticated read, project owner write
- **File types**: JPEG, PNG, WebP, PDF, DOC, DOCX
- **Size limit**: 10MB per file
- **Path structure**: `{user_id}/{project_id}/{timestamp}_{random}.{ext}`

### 4. Market Test Assets (`market-test-assets`)
- **Purpose**: Market test images and documents
- **Access**: Public read (for active tests), brand/school admin write
- **File types**: JPEG, PNG, WebP, PDF
- **Size limit**: 10MB per file
- **Path structure**: `{brand_id}/{market_test_id}/{timestamp}_{random}.{ext}`

## SQL Commands to Create Buckets

Run these commands in your Supabase SQL editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-images', 'profile-images', true),
  ('campaign-assets', 'campaign-assets', true),
  ('project-files', 'project-files', false),
  ('market-test-assets', 'market-test-assets', true);
```

## Storage Policies

```sql
-- Profile Images Policies
CREATE POLICY "Public read access for profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Campaign Assets Policies
CREATE POLICY "Public read access for campaign assets" ON storage.objects
FOR SELECT USING (bucket_id = 'campaign-assets');

CREATE POLICY "Brand/School admins can upload campaign assets" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'campaign-assets' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('brand', 'school_admin', 'super_admin')
  )
);

-- Project Files Policies
CREATE POLICY "Users can read their own project files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own project files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Market Test Assets Policies
CREATE POLICY "Public read access for market test assets" ON storage.objects
FOR SELECT USING (bucket_id = 'market-test-assets');

CREATE POLICY "Brand/School admins can upload market test assets" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'market-test-assets' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('brand', 'school_admin', 'super_admin')
  )
);
```

## Usage Examples

### Upload a profile image
```typescript
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData, // FormData with file, bucket='profile-images', folder=userId
});
```

### Upload a project file
```typescript
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData, // FormData with file, bucket='project-files', folder=`${userId}/${projectId}`
});
```

## File Size Limits

All file uploads are limited to 10MB. This is enforced at the API level in `/api/upload/route.ts`.

## Security Considerations

1. **File Type Validation**: Only specific file types are allowed per bucket
2. **Size Limits**: 10MB maximum file size
3. **Path Structure**: Files must be organized in user/project specific folders
4. **RLS Policies**: Database-level security ensures proper access control
5. **Authentication**: All uploads require authentication
6. **Ownership**: Users can only upload to their own folders (except admins)