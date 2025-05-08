// Rubrik
addMdToPage(`
  # **Diskussion**
  ## *Resultaten visar att:*
  ## Samband mellan sömn och välbefinnande
  Diagrammet visar CGPA, ekonomisk stress och depression per sömngrupp.
`);

// Funktion för att normalisera sömntid till grupper
function normalizeSleepDuration(sleep) {
  const lower = sleep.toLowerCase();
  if (lower.includes('less')) return '4h';
  if (lower.includes('5-6')) return '6h';
  if (lower.includes('6-7')) return '7h';
  if (lower.includes('7-8')) return '8h';
  if (lower.includes('8-9') || lower.includes('more')) return '9h';
  return 'Övrigt';
}

// Hämta data
let results = await dbQuery('SELECT * FROM students');

// Gruppera data med kontroll
let grouped = {};

results.forEach(r => {
  if (!r.sleep_Duration || r.CGPA == null) return;

  const group = normalizeSleepDuration(r.sleep_Duration);
  const cgpa = Number(r.CGPA);
  const stress = Number(r.Financial_stress);
  const depression = Number(r.depression);

  if (isNaN(cgpa) || isNaN(stress) || isNaN(depression)) return;

  if (!grouped[group]) {
    grouped[group] = {
      totalCGPA: 0,
      totalStress: 0,
      totalDepression: 0,
      count: 0
    };
  }

  grouped[group].totalCGPA += cgpa;
  grouped[group].totalStress += stress;
  grouped[group].totalDepression += depression;
  grouped[group].count += 1;
});

// Skapa rader för diagram
let chartRows = Object.entries(grouped).map(([group, v]) => [
  group,
  +(v.totalCGPA / v.count).toFixed(2),
  +(v.totalStress / v.count).toFixed(2),
  +(v.totalDepression / v.count).toFixed(2)
]);

if (chartRows.length === 0) {
  console.error('Inget giltigt data att visa i diagrammet.');
} else {
  // Skapa data-array för Google Charts
  const chartData = [
    ['Sömngrupp', 'CGPA', 'Ekonomisk stress', 'Depression'],
    ...chartRows
  ];

  console.log('ChartData till Google Charts:', chartData);

  // Visa datatabell
  tableFromData({
    data: Object.entries(grouped).map(([group, v]) => ({
      'Sömngrupp': group,
      'CGPA': +(v.totalCGPA / v.count).toFixed(2),
      'Ekonomisk stress': +(v.totalStress / v.count).toFixed(2),
      'Depression': +(v.totalDepression / v.count).toFixed(2),
      'Antal studenter': v.count
    })),
    columnNames: ['Sömngrupp', 'CGPA', 'Ekonomisk stress', 'Depression', 'Antal studenter']
  });

  // Rita stapeldiagrammet
  drawGoogleChart({
    type: 'ColumnChart',
    data: chartData,
    options: {
      title: 'Sömnmönster kontra CGPA, stress och depression',
      height: 500,
      chartArea: { left: 60, right: 20 },
      hAxis: { title: 'Sömngrupper' },
      vAxis: { title: 'Värde (0–10)', minValue: 0, maxValue: 10 },
      colors: ['#4CAF50', '#FF9800', '#F44336'],
      isStacked: false
    }
  });
}
