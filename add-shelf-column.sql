-- Add shelf column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS shelf text;

-- Update existing books with default shelf locations
UPDATE books SET shelf = 'A1' WHERE genre = 'Computer Science';
UPDATE books SET shelf = 'A2' WHERE genre = 'Software Engineering';
UPDATE books SET shelf = 'B1' WHERE genre = 'Web Development';
UPDATE books SET shelf = 'B2' WHERE genre = 'Database';
UPDATE books SET shelf = 'C1' WHERE genre = 'Networking';
UPDATE books SET shelf = 'C2' WHERE genre = 'Machine Learning';
UPDATE books SET shelf = 'D1' WHERE genre = 'Artificial Intelligence';
UPDATE books SET shelf = 'D2' WHERE genre = 'Programming';
