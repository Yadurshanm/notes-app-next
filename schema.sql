-- Create notes table
create table notes (
  id uuid default gen_random_uuid() primary key,
  title text not null default 'Untitled',
  content text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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