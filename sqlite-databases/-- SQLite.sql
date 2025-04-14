-- SQLite
SELECT *
from students;
SELECT *
from students
WHERE Depression = 1,
  SELECT *
FROM students
WHERE City = 'Visakhapatnam'
  AND Depression = 1;
ALTER TABLE students
  RENAME COLUMN 'Have_you_ever_had_suicidal_thoughts?' TO suicidal_thoughts;
