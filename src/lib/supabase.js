import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/* ─── SUPABASE SQL — run this in your Supabase SQL editor ───────────────────

-- PROFILES (extended user data)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  plan text default 'free' check (plan in ('free','pro')),
  carousel_count integer default 0,
  caption_count integer default 0,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- BRANDS (each user can have one brand profile)
create table public.brands (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  specialty text,
  niche text,
  handle text,
  client_ideal text,
  client_pain text,
  client_result text,
  tone text,
  avoid_words text,
  voice_description text,
  updated_at timestamptz default now()
);
alter table public.brands enable row level security;
create policy "Users manage own brand"
  on public.brands for all using (auth.uid() = user_id);

-- CREATIONS (history of all generated content)
create table public.creations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type text check (type in ('carousel','caption','reel','plan','sequence')),
  title text,
  content jsonb,
  created_at timestamptz default now()
);
alter table public.creations enable row level security;
create policy "Users manage own creations"
  on public.creations for all using (auth.uid() = user_id);

───────────────────────────────────────────────────────────────────────────── */
