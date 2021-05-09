import _colors from 'colors';
import CliTable from 'cli-table';

const errorLogger = (message) => {
  console.log(_colors.red(message));
  process.exit(1);
};

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

export const validateToken = (input) => {
  if (!typeof input === 'string' && !(input instanceof String)) {
    return errorLogger("option '-t, --token <symbol>' value for argument 'symbol' is not a valid string of token symbol");
  }
  return input.toUpperCase();
};

export const logDataInTableView = (calculatedData, options) => {
  const head = ['Symbol', 'Overall Deposit', 'Overall Withdraw', 'Balance', 'Balance in USD Price'];
  if (options.date) {
    head.push('Unix time');
    head.push('GMT time');
  }
  const table = new CliTable({ head });
  table.push(...calculatedData.TABLE_VIEW);
  console.log(table.toString());
};
