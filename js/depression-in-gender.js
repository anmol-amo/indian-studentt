let data = await dbQuery("SELECT * FROM students");
console.log("Raw data from DB:", data);
// 1. RUBRIK
addMdToPage(`## Psykisk ohälsa bland studerande `);


// 2. LADDA DATA
//let data = await dbQuery("SELECT * FROM students");
let antalKvinnor = data.filter(x => x.Gender == "Female").length;
let antalMan = data.filter(x => x.Gender == "Male").length;
let antalDepression = data.filter(x => x.Depression == 1).length;
let prosentDepression = ((antalDepression * 100) / (data.length)).toFixed(1);

let allCities = await dbQuery(`
  SELECT city AS City, COUNT(*) AS antal_personer
  FROM students
  GROUP BY city
`);
console.log("AllCities raw data:", allCities);
console.table(allCities);

// 3. SAMMANFATTNING (visas före diagram)
addToPage(`<pre>
  I undersökningen deltog: ${ antalKvinnor } kvinnor och ${ antalMan } män
  i ålder mellan ${ s.min(data.map(x => x.Age)) } till ${ s.max(data.map(x => x.Age)) } från olika städer,
  ${ prosentDepression }% av dem känner sig deprimerad
</pre>`);


// 4. PIE DIAGRAM ÖVER STÄDER
drawGoogleChart({
  type: 'PieChart',
  data: makeChartFriendly(allCities, 'City', 'antal_personer'),
  options: {
    title: 'Städer i undersökning',
    responsive: true,
    height: 400,
    is3D: true,
    chartArea: { left: "0%" },
    pieSliceText: 'percentage-and-label',
    tooltip: { trigger: 'focus' }
  }
});


// 5a. Numeriska kolumner – medelvärde
let numericColumns = [
  "Age", "Academic_Pressure", "CGPA",
  "Study_Satisfaction", "Work/Study_Hours", "Financial_Stress"
];

let numericResults = numericColumns.map(col => {
  let femaleValues = data.filter(x => x.Gender === "Female").map(x => x[col]).filter(x => !isNaN(x));
  let maleValues = data.filter(x => x.Gender === "Male").map(x => x[col]).filter(x => !isNaN(x));

  let kvinnorsResult = s.mean(femaleValues);
  let mansResult = s.mean(maleValues);

  return {
    kolumnnamn: col,
    kvinnor: Number(kvinnorsResult.toFixed(1)),
    man: Number(mansResult.toFixed(1))
  };
});

tableFromData({
  data: numericResults,
  columnNames: ['kolumnnamn', 'Meddelvärde för kvinnor', 'Meddelvärde för man']
});


// 5b. Icke-numeriska kolumner – typvärde
let nonNumericColumns = [
  "Sleep_Duration", "Dietary_Habits", "Degree",
  "Have_You_Ever_Had_Suicidal_Thoughts", "Family_History_Mental_Illness", "Depression"
];

let nonNumericResults = nonNumericColumns.map(col => {
  let femaleValues = data.filter(x => x.Gender === "Female").map(x => x[col]).filter(x => x != null && x !== "");
  let maleValues = data.filter(x => x.Gender === "Male").map(x => x[col]).filter(x => x != null && x !== "");

  let kvinnorsResult = femaleValues.length > 0 ? s.mode(femaleValues) : "Ingen data";
  let mansResult = maleValues.length > 0 ? s.mode(maleValues) : "Ingen data";

  return {
    kolumnnamn: col,
    kvinnor: kvinnorsResult,
    man: mansResult
  };
});

tableFromData({
  data: nonNumericResults,
  columnNames: ['kolumnnamn', 'Typvärde för kvinnor', 'Typvärde för man']
});
