-- Optional future Supabase schema sketch. Review and enable RLS before real use.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);
create table if not exists public.ingredients (
  id bigint generated always as identity primary key,
  name text not null,
  source_name text,
  source_url text,
  source_checked_on date,
  kcal_per_100g numeric,
  protein_g_per_100g numeric,
  carbs_g_per_100g numeric,
  fat_g_per_100g numeric,
  sodium_mg_per_100g numeric,
  preparation_state text,
  verified boolean default false
);
create table if not exists public.recipes (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  prep_minutes integer,
  vegetarian boolean default false,
  instructions jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);
create table if not exists public.recipe_ingredients (
  recipe_id bigint references public.recipes(id) on delete cascade,
  ingredient_id bigint references public.ingredients(id),
  grams numeric not null,
  primary key (recipe_id, ingredient_id)
);
create table if not exists public.meal_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id bigint references public.recipes(id),
  servings numeric default 1,
  logged_at timestamptz default now()
);
create table if not exists public.recommendation_feedback (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id bigint references public.recipes(id),
  rating smallint check (rating between 1 and 5),
  feedback text,
  created_at timestamptz default now()
);
-- Before production: enable RLS and write policies so users can access only their own profile,
-- meal logs and feedback. Public read policies for verified recipe/ingredient data can be separate.
