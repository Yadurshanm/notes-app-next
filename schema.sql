-- Create categories table
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  parent_id uuid references categories(id),
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security for categories
alter table categories enable row level security;

-- Create policy to allow all operations for authenticated users
create policy "Allow all operations for authenticated users" on categories
  for all
  to authenticated
  using (true)
  with check (true);

-- Create policy to allow read-only access for anonymous users
create policy "Allow read-only access for anonymous users" on categories
  for select
  to anon
  using (true);

-- Create notes table
create table notes (
  id uuid default gen_random_uuid() primary key,
  title text not null default 'Untitled',
  content text not null default '',
  category_id uuid references categories(id),
  tags text[] not null default '{}',
  is_starred boolean not null default false,
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index notes_title_content_idx on notes using gin(to_tsvector('english', title || ' ' || content));
create index notes_tags_idx on notes using gin(tags);
create index notes_order_idx on notes("order");
create index notes_is_starred_idx on notes(is_starred);

-- Enable Row Level Security
alter table notes enable row level security;

-- Create policy to allow all operations for authenticated users
create policy "Allow all operations for authenticated users" on notes
  for all
  to authenticated
  using (true)
  with check (true);

-- Create policy to allow read-only access for anonymous users
create policy "Allow read-only access for anonymous users" on notes
  for select
  to anon
  using (true);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_notes_updated_at
  before update on notes
  for each row
  execute function update_updated_at_column();