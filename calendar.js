const months = [
  [null, null], // Make months not zero indexed
  [31, "January"],
  [28, "February"], //(Non Leap Year)
  [31, "March"],
  [30, "April"],
  [31, "May"],
  [30, "June"],
  [31, "July"],
  [31, "August"],
  [30, "September"],
  [31, "October"],
  [30, "November"],
  [31, "December"]
];

const dotw = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// Takes a year and returns a boolean that
// represents whether or not the year is a
// leap year.
function isLeapYear(year) {
  if (year % 400 === 0) {
    return true;
  } else if (year % 100 === 0) {
    return false;
  } else if (year % 4 === 0) {
    return true;
  }
  return false;
}

// Takes a year and returns the zero indexed
// day of the week that the year starts on.
// Sunday is index 0, Saturday is index 6.
function yearStartsOn(year) {
  // Lowest valid year is 1923, which started on a Monday
  const baseYear = 1923;
  const baseStart = 1;

  const intYear = parseInt(year);

  // Check that year param is at least baseYear:
  if (
    Number.isNaN(intYear)
    || intYear < baseYear
  ) {
    console.log("Please provide a year after 1922");
    return null;
  }

  // Increment day of the week movement for each year from base year
  // Normal years increment one day of the week from the previous
  // year, leap years increment two days of the week from the previous
  // year. We can save time by incrementing 35 days per 28 years because
  // 28 is divisible by both 4 (leap year interval) and 7 (days of the
  // week)
  const yearsBetween = intYear - 1923;
  const remainderYears = yearsBetween % 28;
  let start = baseStart + Math.floor(yearsBetween / 28) * 35;

  // Increment individually for years that can't be shortcutted
  // with 28 year intervals
  for (let i = remainderYears; i > 0; i--) {
    start += 1;
    if (isLeapYear(year - i)) {
      start += 1;
    }
  }
  // Reduce total increment by number of days in the week:
  return start % 7;
}

function printMonth(month, year) {
  // Get correct count of month lengths for year:
  let adjMonthLengths = [...months.map(i => i[0])];
  if (isLeapYear(year)) {
    adjMonthLengths[2] += 1;
  }
  // Find what day of the week the month starts on, start by
  // finding the day of the week the year starts on, and increment
  // by the lenght of each month:
  let daysCount = yearStartsOn(year);
  for (let i = 1; i < month; i++) {
    daysCount += adjMonthLengths[i];
  }
  const monthStartsOn = daysCount % 7;

  // Create string to store printable month calendar
  // and placeholder string for each week as it is built
  let monthString = "";
  let week = "";
  // Pad initial week for months that start in the middle
  // of the week
  for (let i = 0; i < monthStartsOn; i++) {
    week += "   ";
  }

  // Loop through days of the month, adding to monthString at
  // the end of each week.
  let weekDay = monthStartsOn;
  for (let monthDay = 1; monthDay <= adjMonthLengths[month]; monthDay++) {
    if (weekDay === 7) {
      monthString += week + "\n";
      weekDay = 0;
      week = "";
    }

    let pad = String(monthDay).length === 1 ? "  " : " ";
    week += monthDay + pad;
    weekDay += 1;

  }
  // Add final week to monthString
  monthString += week + "\n";

  // Highlight today if in month:
  const today = new Date()
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  if (
    year === todayYear
    && (month - 1) === todayMonth  
  ) {
    // Add reverse escape string to monthString
    // on today's date if present
    monthString = monthString.replace(todayDate, `\x1b[7m${todayDate}\x1b[0m`);
  }

  // Print month and day of the week labels:
  console.log(`\x1b[4m${months[month][1]} ${year}:\x1b[0m`); // Underscore label
  console.log("\x1b[2mS  M  T  W  T  F  S  \x1b[0m"); // Dim days of the week label
  console.log(monthString);
}


printMonth(5, 2020);
printMonth(6, 2020);
printMonth(7, 2020);
printMonth(8, 2020);
