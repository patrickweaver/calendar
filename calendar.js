/*
----------------------
CLI CALENDAR
----------------------

This is a simple CLI calendar tool that takes 2 parameters. The first 
parameter is the month in either 1-indexed integer format (1, 4), 3 
letter abbreviation format ("Jan", "Apr"...), or full name ("January", 
"April"). The second parameter is the full 4 digit year.

The tool will print a text representation of the specified month's 
calendar from that year. Weeks start on Sunday.

Features:
 - The current day will be highlighted if the current month is printed.
 - If no command line arguments are given the current month will be 
   printed
 - If only a month command line argument is given the month from the 
   current year will be printed.

Limitations:
The tool will only print calendars after the year 1923 CE. I did some 
quick reading on when the current calendar was adopted, and it seems 
like that was the last change. This limitation is to avoid printing 
incorrect calendar months by working backwards through historical 
calendar inconsistencies.
*/

function main() {
  try {
    // Read command line arguments to find month and year to print:
    let monthArg = process.argv[2];
    let yearArg = process.argv[3];

    // Set defaults:
    if (!monthArg && !yearArg) {
      monthArg = String(todayMonth + 1); // Make 1 indexed
      yearArg = String(todayYear);
    }

    if (!yearArg) {
      yearArg = String(todayYear);
    }

    let yearInt;
    // Check that arg strings are valid:
    if (yearArg.length != 4) {
      throw "Invalid year";
    } else {
      yearInt = parseInt(yearArg);
    }

    // Check that year is after 1922:
    if (yearInt < 1923) {
      throw "Year too early"
    }

    if (monthArg.length > 0) {

      // Convert month name or short name ("Jan" or "January"
      // should both work) into month int (1 indexed):
      let monthInt;
      // If length is greater than 2 it is a name:
      if (monthArg.length > 2) {
        // Find month name in months array, then find the index of
        // that month:
        monthInt = months.map(i => {
          if (i[1] && i[1].substring(0, 3) === monthArg.substring(0, 3)) {
            return true;
          } else {
            return false;
          }
        }).indexOf(true);
        if (!monthInt) {
          throw "Invalid month";
        }
      // else it is a number:
      } else {
        monthInt = parseInt(monthArg);
        if (monthInt > 12 || monthInt < 1) {
          throw "Invalid month";
        }
      }

      if (!monthInt || Number.isNaN(monthInt)) {
        throw "Invalid month";
      }

      // * * * * * * * * * * * * * * * 
      // Print the month!
      // * * * * * * * * * * * * * * * 
      printMonth(monthInt, yearInt);


    } else {
      throw "Invalid month";
    }
  } catch (error) {
    if (error === "Invalid month" || error === "Invalid year") {
      console.log("Please enter valid month and year in one of the following formats:");
      console.log(" - June 2020");
      console.log(" - Jun 2020");
      console.log(" - 6 2020")
    } else if (error === "Year too early") {
      console.log("Please provide a year after 1922");
    } else {
      console.log("Undefined error:", error);
    }
  }
}

const today = new Date()
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayDate = today.getDate();

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
    // This should no longer happen because I check
    // in the command line arguments, but leaving in in
    // case the function is used elsewhere in the future.
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


// Run main function:
main();