
import csv from 'csv-parser';
import { Command } from 'commander';
import { createReadStream } from 'fs';
import cliProgress from 'cli-progress';
import { get, set, mapKeys, keys } from 'lodash';
import fetchTokenPriceInUSD from './service';
import { filePath, progressBarOptions } from './config';
import { errorLogger, validateDate, validateToken, logDataInTableView } from './utils';

const program = new Command();
const progressBar = new cliProgress.SingleBar(progressBarOptions);
const transformedData = {
  WITHDRAWAL: {},
  DEPOSIT: {},
  BALANCE: {},
  BALANCE_USD: {},
  TABLE_VIEW: [],
};


/**
 * Handling command-line interfaces
 * @param  {object} options extracted options defined in commands line
 */
const options = program
  .command('clone <source> [destination]')
  .helpOption('-h, --help', 'help message')
  .option('-d, --date <date>', 'date to filter the data', validateDate)
  .option('-t, --token <symbol>', 'token symbol to filter the data', validateToken)
  .option('-p, --path <path>', 'full path of the CSV file')
  .parse(process.argv)
  .opts();

/**
 * Transforming and updating the data in 'transformedData' variable
 * @param  {object} tokenPriceInUSD Extracted data from the external API
 */
const dataTransformer = (tokenPriceInUSD) => {
  const dateInView = options.date ? [options.date, new Date(options.date).toGMTString()] : [];
  const { WITHDRAWAL, DEPOSIT } = transformedData;
  mapKeys(DEPOSIT, (value, key) => {
    const withdrawal = (WITHDRAWAL[key] || 0);
    const balance = value - withdrawal;
    const balanceUSD = (balance * tokenPriceInUSD[key]).toFixed(2);
    transformedData.BALANCE[key] = balance;
    transformedData.BALANCE_USD[key] = balanceUSD;
    transformedData.TABLE_VIEW.push([key, value, withdrawal, balance, balanceUSD, ...dateInView]);
    return value;
  });
};

/**
 * Extracting the data as per the cli option by each column for the CSV
 * @param  {number} timestamp Integer number of seconds since the Epoch
 * @param  {string} transaction_type Either a DEPOSIT or a WITHDRAWAL
 * @param  {string} token The token symbol
 * @param  {number} amount The amount transacted
 */
const handleOnData = ({ timestamp, transaction_type, token, amount }) => {
  progressBar.increment();
  if (options.token && options.token !== token) {
    return;
  }
  if (!get(transformedData, `${transaction_type}.${token}`)) {
    set(transformedData, `${transaction_type}.${token}`, 0);
  }
  if (options.date && options.date <= Number(timestamp)) {
    return;
  }
  transformedData[transaction_type][token] += Number(amount);
};

/**
 * Final handle of the data after the "createReadStream" completed
 */
const handleOnEnd = async () => {
  progressBar.stop();
  const tokensDeposited = keys(transformedData.DEPOSIT);
  const tokenPriceInUSD = await fetchTokenPriceInUSD(tokensDeposited);
  dataTransformer(tokenPriceInUSD);
  logDataInTableView(transformedData, options);
  process.exit(0);
};

const path = options.path || filePath

/**
 * Opens the file as a readable stream and response passed to csv-parser
 * @param  {string} path cli option path or filepath from the config
 */
createReadStream(path)
  .on('error', errorLogger)
  .pipe(csv())
  .on('headers', () => progressBar.start(progressBarOptions.max, 0))
  .on('data', handleOnData)
  .on('end', handleOnEnd);