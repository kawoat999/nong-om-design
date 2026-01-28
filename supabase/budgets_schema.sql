-- Create the budgets table
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime for this table
alter publication supabase_realtime add table public.budgets;

-- Insert default values
insert into public.budgets (category, amount) values
('food', 5000),
('transport', 2000),
('entertainment', 2000),
('healthcare', 1500),
('utilities', 3000),
('shopping', 3000),
('investment', 5000),
('other', 2000);
