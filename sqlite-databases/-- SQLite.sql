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
--how many students have unhealthy eating habits and related to depresion
SELECT Dietary_Habits,
  COUNT(*) AS total_students,
  ROUND(AVG(Depression)) AS avg_depression
FROM students
WHERE Depression IS NOT NULL
  AND Dietary_Habits IS NOT NULL
GROUP BY Dietary_Habits
ORDER BY avg_depression DESC;
-- financial stress is directly proportional to depression
SELECT Financial_Stress,
  COUNT(*) AS total_students,
  ROUND(AVG(Depression)) AS avg_depression
FROM students
WHERE Depression IS NOT NULL
  AND Financial_Stress IS NOT NULL
GROUP BY Financial_Stress
ORDER BY avg_depression DESC;
