-- Make media_url optional in posts table
ALTER TABLE public.posts ALTER COLUMN media_url DROP NOT NULL;
