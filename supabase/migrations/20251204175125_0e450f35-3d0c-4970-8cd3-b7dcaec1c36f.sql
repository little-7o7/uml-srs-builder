-- Add 'viewer' role to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- Update RLS policy to allow viewers to view products (already covered by existing policy)
-- No changes needed as current policy allows all authenticated users to view