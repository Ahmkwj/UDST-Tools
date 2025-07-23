# UDST Tools Authentication Setup

This document provides instructions for setting up authentication for the UDST Tools platform using Supabase.

## Environment Configuration


````

## Database Setup

Run the following SQL queries in your Supabase SQL Editor to set up the database:

```sql
-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configure Supabase Auth to store user metadata
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create a public user profiles table that references auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies to control access to the profiles table
-- Policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'name',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update user profiles when auth.users is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET
        name = NEW.raw_user_meta_data->>'name',
        email = NEW.email,
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user is updated
CREATE OR REPLACE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
```

## Supabase Configuration

1. Sign in to your Supabase account and access your project dashboard.
2. Go to the "Authentication" section and configure the following settings:

   - Set "Site URL" to your production URL
   - Enable "Email" provider under "Authentication Providers"
   - Set the "Confirm email" setting according to your preference
   - Configure password strength requirements
   - Set the "JWT expiry time" to 3600 seconds (or your preferred duration)

## Features Included

The authentication system provides the following features:

1. **Sign Up**: Users can create a new account with their name, email, and password.
2. **Log In**: Users can sign in with their email and password.
3. **Profile Management**: Users can view and update their profile information.
4. **Password Management**: Users can change their password.
5. **Automatic Session Handling**: Sessions are automatically managed and restored on page reload.

## Protected Routes

The application includes protection for routes that require authentication:

- `/profile` - Accessible only to authenticated users
- Login and signup pages redirect authenticated users to the home page
