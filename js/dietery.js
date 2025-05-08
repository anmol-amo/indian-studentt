// Step 1: Query dietary habits and depression
let dataForChart = await dbQuery(`
  SELECT
    dietaryHabit AS habit,
    COUNT(*) AS total_students,
    ROUND(AVG(depression), 2) AS avg_depression
  FROM students
  WHERE
    depression IS NOT NULL
    AND dietaryHabit IS NOT NULL
    AND dietaryHabit != ''
  GROUP BY dietaryHabit
  ORDER BY avg_depression DESC;
`);

console.log("Data till diagram och tabell:", dataForChart);

// Step 2: Check for data
if (!dataForChart || dataForChart.length === 0) {
  console.error("Inget giltigt data att visa.");
} else {
  // Step 3: Format for chart
  const chartData = makeChartFriendly({
    columns: ['Kostvana', 'Genomsnittlig depression'],
    rows: dataForChart.map(row => [row.habit, row.avg_depression])
  });

  // Step 4: Draw the chart
  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      title: 'Genomsnittlig depression per kostvana',
      height: 500,
      chartArea: { left: 50, right: 20 },
      hAxis: { title: 'Kostvanor' },
      vAxis: { title: 'Depressionsnivå', minValue: 0 },
      colors: ['#FF9800']
    }
  });

  // Step 5: Create table data
  const dataForTable = dataForChart.map(row => ({
    'Kostvana': row.habit,
    'Antal studenter': row.total_students,
    'Genomsnittlig depression': row.avg_depression
  }));

  // Step 6: Render table
  tableFromData({
    data: dataForTable,
    columnNames: ['Kostvana', 'Antal studenter', 'Genomsnittlig depression']
  });
}
