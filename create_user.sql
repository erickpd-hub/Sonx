-- Script to manually create a user in auth.users
-- Run this in the Supabase SQL Editor to bypass API rate limits

-- 1. Enable pgcrypto extension if not enabled (needed for password hashing)
create extension if not exists pgcrypto;

-- 2. Insert the user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@sonx.com',
  crypt('admin123', gen_salt('bf')), -- Password is 'admin123'
  now(), -- Auto-confirm email
  NULL,
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"AdminUser"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Note: The 'on_auth_user_created' trigger will automatically create the profile in public.profiles
