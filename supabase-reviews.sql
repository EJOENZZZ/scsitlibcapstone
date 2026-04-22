-- REVIEWS TABLE
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  username text not null,
  course text default 'BSIT',
  comment text not null,
  rating int default 5,
  created_at timestamp default now()
);

alter table reviews enable row level security;

-- Anyone can read reviews
create policy "Anyone can view reviews" on reviews for select using (true);

-- Only logged in users can insert their own review
create policy "Users can insert own review" on reviews for insert with check (auth.uid() = user_id);

-- Users can delete their own review
create policy "Users can delete own review" on reviews for delete using (auth.uid() = user_id);
