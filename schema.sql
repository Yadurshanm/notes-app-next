-- Drop existing tables if they exist
drop table if exists notes;
drop table if exists categories;

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

-- Create policy to allow all operations for all users
create policy "Allow all operations for all users" on categories
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Create trigger for categories updated_at
create trigger update_categories_updated_at
  before update on categories
  for each row
  execute function update_updated_at_column();

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

-- Create policy to allow all operations for all users
create policy "Allow all operations for all users" on notes
  for all
  to anon, authenticated
  using (true)
  with check (true);

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