import ora from 'ora';
import csv from 'csv-parser';
import { Command } from 'commander';
import { createReadStream } from 'fs';
import { get, set } from 'lodash';
import { filePath } from './config';
import fetchTokenPriceInUSD from './service';
import { errorLogger, validateDate, validateToken, logDataInTableView } from './utils';

const program = new Command();
const spinner = ora({ text: '0', prefixText : "Processing CSV...", spinner: 'balloon'});
const transformedData = {
  WITHDRAWAL: {}, // token => withdrawal amount mapping
  DEPOSIT: {}, // token => deposit amount mapping
  BALANCE: {}, // token => balance amount mapping
  BALANCE_USD: {}, // token => balance USD amount mapping
  COLUMN_COUNT: 0, // Number of columns processed from CSV
  TOKENS: new Set() // Set of token symbols
};

// Handling the command-line interfaces options
const options = program
  .helpOption('-h, --help', 'help message')
  .option('-d, --date <date>', 'integer of unix epoch date to filter the data', validateDate)
  .option('-t, --token <symbol>', 'token symbol to filter the data', validateToken)
  .option('-p, --path <path>', 'full path of the CSV file')
  .parse(process.argv)
  .opts();

/**
 * Transforms and updates the data in 'transformedData' variable
 * @param  {object} tokenPriceInUSD Extracted data from the external API
 */
const dataTransformer = (tokenPriceInUSD) => {
  const { WITHDRAWAL, DEPOSIT, TOKENS } = transformedData;
  // for each deposit, transforming and updating the data
  const tableData = Array.from(TOKENS).map(key => {
    const deposit = get(DEPOSIT, key, 0);
    const withdrawal = get(WITHDRAWAL, key, 0);
    // Calculating the balance from subtraction of overall deposit and withdrawal
    const balance = deposit - withdrawal;
    // Calculating USD price of the balance
    const balanceUSD = (balance * tokenPriceInUSD[key]).toFixed(2);
    transformedData.BALANCE[key] = balance;
    transformedData.BALANCE_USD[key] = balanceUSD;
    // Transforming the data to log in table view
    return [key, deposit, withdrawal, balance, balanceUSD];
  })
  // Logging the data in table view
  logDataInTableView(tableData);
};

/**
 * Extracts the data as per the cli option by each column for the CSV
 * @param  {number} timestamp Integer number of seconds since the Epoch
 * @param  {string} transaction_type Either a DEPOSIT or a WITHDRAWAL
 * @param  {string} token The token symbol
 * @param  {number} amount The amount transacted
 */
const handleOnData = ({ timestamp, transaction_type, token, amount }) => {
  transformedData.COLUMN_COUNT++
  spinner.text = transformedData.COLUMN_COUNT.toString()
  // If cli options has token and it's different from current one, skip processing
  if (options.token && options.token !== token) {
    return;
  }
  // If cli options has date and it's before this transaction time, skip processing
  if (options.date && options.date < new Date(+timestamp)) {
    return;
  }
  transformedData.TOKENS.add(token)
  // Adds the transaction amount to the specified transaction_type and token in transformedData variable
  const existingVal = get(transformedData, `${transaction_type}.${token}`, 0)
  set(transformedData, `${transaction_type}.${token}`, existingVal + Number(amount));
};

/**
 * Handles the final data after from "createReadStream"
 */
const handleOnEnd = async () => {
  spinner.succeed()
  // Calls the service to get the USD price of the all tokens
  const tokenPriceInUSD = await fetchTokenPriceInUSD(Array.from(transformedData.TOKENS));
  // Calls the dataTransformer to process the transformation and updates
  dataTransformer(tokenPriceInUSD);
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
  .on('headers', () => spinner.start())
  .on('data', handleOnData)
  .on('end', handleOnEnd);
