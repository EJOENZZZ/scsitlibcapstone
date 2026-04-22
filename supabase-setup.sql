-- BOOKS TABLE
create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  genre text not null,
  copies int default 1,
  available boolean default true,
  image text,
  created_at timestamp default now()
);

-- BORROW RECORDS TABLE
create table if not exists borrow_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text,
  book_id uuid references books(id) on delete cascade,
  book_title text,
  book_author text,
  borrow_date date default current_date,
  due_date date default (current_date + interval '14 days'),
  status text default 'Active',
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table books enable row level security;
alter table borrow_records enable row level security;

-- POLICIES: Anyone can read books
create policy "Anyone can view books" on books for select using (true);

-- POLICIES: Only authenticated users can read their own borrow records
create policy "Users can view own records" on borrow_records for select using (auth.uid() = user_id);
create policy "Users can insert own records" on borrow_records for insert with check (auth.uid() = user_id);

-- POLICIES: Allow admin full access to books
create policy "Admin can insert books" on books for insert with check (true);
create policy "Admin can update books" on books for update using (true);
create policy "Admin can delete books" on books for delete using (true);

-- SEED: Insert initial books
insert into books (title, author, genre, copies, available, image) values
('Introduction to Algorithms', 'Cormen, Leiserson, Rivest, Stein', 'Computer Science', 5, true, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'),
('Clean Code', 'Robert C. Martin', 'Software Engineering', 3, true, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop'),
('Design Patterns', 'Gang of Four', 'Computer Science', 4, true, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'),
('You Don''t Know JS', 'Kyle Simpson', 'Web Development', 6, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'),
('Operating System Concepts', 'Silberschatz, Galvin, Gagne', 'Computer Science', 4, true, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop'),
('Computer Networks', 'Andrew S. Tanenbaum', 'Networking', 2, true, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop'),
('Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', 'Artificial Intelligence', 3, true, 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=300&h=400&fit=crop'),
('Machine Learning', 'Tom M. Mitchell', 'Machine Learning', 2, true, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop'),
('The Pragmatic Programmer', 'Hunt & Thomas', 'Software Engineering', 2, false, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop'),
('Database System Concepts', 'Silberschatz et al.', 'Database', 3, false, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'),
('JavaScript: The Good Parts', 'Douglas Crockford', 'Web Development', 4, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'),
('Python Crash Course', 'Eric Matthes', 'Programming', 5, true, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop'),
('Deep Learning', 'Ian Goodfellow, Yoshua Bengio', 'Machine Learning', 2, true, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop'),
('Cracking the Coding Interview', 'Gayle Laakmann McDowell', 'Programming', 4, true, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'),
('System Design Interview', 'Alex Xu', 'Software Engineering', 3, false, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop');
