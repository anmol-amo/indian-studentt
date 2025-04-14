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
