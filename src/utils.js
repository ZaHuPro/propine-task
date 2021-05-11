import _colors from 'colors';
import CliTable from 'cli-table';

/**
 * To log the error in the console with red color and exiting the process
 * @param  {string|object} message Error message to be logged in the console
 */
export const errorLogger = (message) => {
  console.log(_colors.red(message));
  process.exit(1);
};

/**
 * Validates the date of cli option
 * @param  {number} input The Unix epoch seconds
 * @returns  {object} Valid date object
 */
export const validateDate = (input) => {
  const dateIs = new Date(+input);
  if (Number.isNaN(dateIs.valueOf())) {
    return errorLogger("option '-d, --date <Date>' value for argument 'Date' is not a valid integer of unix epoch");
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
 * @param  {object} tableData Modified data for the table view
 */
export const logDataInTableView = (tableData) => {
  const head = ['Symbol', 'Overall Deposit', 'Overall Withdraw', 'Balance', 'Balance in USD Price'];
  const table = new CliTable({ head });
  table.push(...tableData);
  console.log(table.toString());
};
