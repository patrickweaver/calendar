const monthLengths = [
  null,
  31, // January
  28, // February (Non Leap Year)
  31, // March
  30, // April
  31, // May
  30, // June
  31, // July
  31, // August
  30, // September
  31, // October
  30, // November
  31  // December
]

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

function yearStartsOn(year) {

  // Lowest year is 1923, which started on a Monday
  const baseYear = 1923;
  const baseStart = 1;

  const intYear = parseInt(year);

  if (
    Number.isNaN(intYear)
    || intYear < baseYear
  ) {
    console.log("Please provide a year after 1922");
    return null;
  }

  const yearsBetween = intYear - 1923;
  const remainderYears = yearsBetween % 28;
  let start = baseStart + Math.floor(yearsBetween / 28) * 35;
  for (let i = remainderYears; i > 0; i--) {
    start += 1;
    if (isLeapYear(year - i)) {
      start += 1;
    }
  }

  return start % 7;
}

const months = [
  null,
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const dotw = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

function printMonth(month, year) {
  let adjMonthLengths = [...monthLengths];
  if (isLeapYear(year)) {
    adjMonthLengths[2] += 1;
  }
  let daysCount = yearStartsOn(year);
  for (let i = 1; i < month; i++) {
    daysCount += adjMonthLengths[i];
  }
  const monthStartsOn = daysCount % 7;

  console.log(months[month] + " " + year + " started on " + dotw[monthStartsOn]);

  let monthString = "";
  
  let week = "";
  for (let i = 0; i < monthStartsOn; i++) {
    week += "   ";
  }

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
  monthString += week;

  console.log(months[month] + " " + year + ":")
  console.log("S  M  T  W  T  F  S  ");
  console.log(monthString);

}

printMonth(1, 1976);
console.log("Thursday");
console.log("")
printMonth(2, 1976);
console.log("Sunday");
console.log("")
printMonth(3, 1976);
console.log("Monday");
console.log("")
printMonth(5, 1976);
console.log("Saturday");
console.log("")
printMonth(11, 1985);
console.log("Friday");
console.log("")
printMonth(3, 2000);
console.log("Wednesday");
console.log("")