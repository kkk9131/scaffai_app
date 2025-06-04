# Mobile Authentication Implementation

## Overview

This document describes the complete authentication system implementation for the ScaffAI mobile application, including Phase 1 (basic auth) and Phase 2 (email features and avatar upload) functionality.

## Architecture

### Core Components

1. **Authentication Service** (`src/services/auth.ts`)
   - Wrapper around `@scaffai/database` AuthService
   - Mobile-specific features (session persistence, error handling)
   - TypeScript interfaces for mobile auth

2. **Storage Service** (`src/services/storage.ts`)
   - Avatar upload functionality using Supabase Storage
   - Image picker integration with proper permissions
   - File management and cleanup

3. **Authentication Context** (`context/AuthContext.tsx`)
   - React Context for global auth state
   - Authentication methods (signIn, signUp, signOut)
   - Profile management
   - Session persistence with AsyncStorage

4. **Authentication Guards** (`components/AuthGuard.tsx`)
   - Route protection component
   - Automatic redirects for unauthenticated users
   - Loading states during auth checks

## Features Implemented

### Phase 1: Basic Authentication
- ✅ User registration with email/password
- ✅ User login with email/password  
- ✅ Session management with persistence
- ✅ Logout functionality
- ✅ Profile management
- ✅ Authentication state management

### Phase 2: Extended Features
- ✅ Password reset via email (Supabase handled)
- ✅ Avatar upload with image picker
- ✅ Profile image management
- ✅ Real-time auth state changes
- ✅ Comprehensive error handling

## Screen Implementation

### 1. Authentication Screen (`app/(tabs)/auth.tsx`)
- Combined login/registration form
- Client-side validation
- Real-time error display
- Loading states
- Form switching between login/register modes

### 2. Registration Screen (`app/(tabs)/register.tsx`) 
- Dedicated registration form
- Password strength validation
- Terms acceptance
- Comprehensive validation

### 3. Password Reset Screen (`app/(tabs)/forgot-password.tsx`)
- Email-based password reset
- Two-stage UI (send email → confirmation)
- Resend functionality
- Clear user guidance

### 4. Profile Management Screen (`app/(tabs)/profile.tsx`)
- User profile viewing/editing
- Avatar upload functionality
- Profile data management
- Account management actions

### 5. Settings Screen (`app/(tabs)/settings.tsx`)
- App preferences management
- Account-related settings
- Enhanced UI with sections
- Logout and account deletion

## Setup Requirements

### Environment Variables
```bash
# .env file
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_SITE_URL=http://localhost:8081
```

### Dependencies Added
```json
{
  "@react-native-async-storage/async-storage": "^2.1.0",
  "expo-image-picker": "~15.0.7", 
  "base64-arraybuffer": "^1.0.2"
}
```

### Supabase Setup Required

1. **Authentication Configuration**
   - Enable email/password auth
   - Configure email templates
   - Set up redirect URLs

2. **Storage Bucket**
   - Create 'avatars' bucket
   - Configure public access policies
   - Set up file size/type restrictions

3. **Database Schema**
   - Users table with profile fields
   - RLS policies for user data
   - Avatar URL field

## Usage Examples

### Authentication
```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  const handleLogin = async () => {
    const result = await signIn(email, password);
    if (result.error) {
      // Handle error
    }
  };
}
```

### Protected Routes
```tsx
import { AuthGuard } from '@/components/AuthGuard';

function ProtectedScreen() {
  return (
    <AuthGuard>
      <YourContent />
    </AuthGuard>
  );
}
```

### Avatar Upload
```tsx
import { storageService } from '@/src/services/storage';

const uploadAvatar = async () => {
  const result = await storageService.uploadAvatar(userId);
  if (result.url) {
    // Update profile with new avatar URL
  }
};
```

## Security Considerations

1. **Session Management**
   - JWT tokens handled by Supabase
   - Automatic token refresh
   - Secure storage with AsyncStorage

2. **Data Validation**
   - Client-side validation for UX
   - Server-side validation via Supabase
   - Input sanitization

3. **File Upload Security**
   - File type restrictions
   - Size limitations
   - Secure storage bucket policies

## Testing

### Manual Testing Checklist
- [ ] User registration flow
- [ ] User login flow
- [ ] Password reset flow
- [ ] Profile editing
- [ ] Avatar upload
- [ ] Session persistence
- [ ] Logout functionality
- [ ] Error handling

### Test Accounts
Set up test accounts in Supabase for development testing.

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Supabase URL/key configuration
   - Verify environment variables
   - Check network connectivity

2. **Image Upload Issues**
   - Verify storage bucket permissions
   - Check file size/type restrictions
   - Ensure proper device permissions

3. **Session Persistence**
   - Clear AsyncStorage if needed
   - Check auth state listeners
   - Verify token refresh logic

## Future Enhancements

### Phase 3 (Future)
- [ ] Biometric authentication
- [ ] Social login (Google, Apple)
- [ ] Multi-factor authentication
- [ ] Advanced profile management
- [ ] Account linking
- [ ] Enhanced security features

## API Reference

### Authentication Service Methods
- `signUp(email, password, userData)` - Register new user
- `signIn(email, password)` - Login user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current user
- `updateProfile(updates)` - Update user profile
- `resetPassword(email)` - Send password reset email

### Storage Service Methods
- `uploadAvatar(userId)` - Upload avatar image
- `deleteAvatar(filePath)` - Delete avatar image
- `getAvatarUrl(filePath)` - Get avatar public URL

## Support

For issues or questions regarding the authentication implementation, refer to:
- Supabase documentation
- Expo documentation
- React Native documentation
- Project-specific troubleshooting guides