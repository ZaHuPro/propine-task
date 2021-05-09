import _colors from 'colors';
import CliTable from 'cli-table';

/**
 * To log the error in the console with red color and exiting the process
 * @param  {string|object} message Message to be logged in the console
 */
export const errorLogger = (message) => {
  console.log(_colors.red(message));
  process.exit(1);
};

/**
 * Validates the date of cli option
 * @param  {string|number} input Date string or the Unix epoch
 * @returns  {number} Valid unix epoch integer
 */
export const validateDate = (input) => {
  if (!Number.isNaN(Number(input))) {
    input = Number(input);
  }
  const dateIs = new Date(input).getTime();
  if (Number.isNaN(dateIs)) {
    return errorLogger("option '-d, --date <Date>' value for argument 'Date' is not a valid date");
  }
  return dateIs;
};

/**
 * Validates the token of cli option
 * @param  {string} input The token symbol
 * @returns  {number} Valid string in upper case
 */
export const validateToken = (input) => {
  if (!typeof input === 'string' && !(input instanceof String)) {
    return errorLogger("option '-t, --token <symbol>' value for argument 'symbol' is not a valid string");
  }
  return input.toUpperCase();
};

/**
 * To log the data in table view on the console 
 * @param  {object} transformedData Modified final data from the CSV
 * @param  {object} options Extracted options defined in commands line
 */
export const logDataInTableView = (transformedData, options) => {
  const head = ['Symbol', 'Overall Deposit', 'Overall Withdraw', 'Balance', 'Balance in USD Price'];
  if (options.date) {
    head.push('Unix time');
    head.push('GMT time');
  }
  const table = new CliTable({ head });
  table.push(...transformedData.TABLE_VIEW);
  console.log(table.toString());
};
