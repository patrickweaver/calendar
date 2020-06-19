# CLI CALENDAR

This is a simple CLI calendar tool that takes 2 parameters. The first parameter is the month in either 1-indexed integer format (1, 4), 3 letter abbreviation format ("Jan", "Apr"...), or full name ("January", "April"). The second parameter is the full 4 digit year.

The tool will print a text representation of the specified month's calendar from that year. Weeks start on Sunday.

## Features

- The current day will be highlighted if the current month is printed.
- If no command line arguments are given the current month will be printed
- If only a month command line argument is given the month from the current year will be printed.

## Limitations

- The tool will only print calendars after the year 1923 CE. I did some quick reading on when the current calendar was adopted, and it seems like that was the last change. This limitation is to avoid printing incorrect calendar months by working backwards through historical calendar inconsistencies.
