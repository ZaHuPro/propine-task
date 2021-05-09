
import csv from 'csv-parser';
import { resolve } from 'path';
import { Command } from 'commander';
import { createReadStream } from 'fs';
import cliProgress from 'cli-progress';
import { get, set, mapKeys, keys } from 'lodash';
import fetchTokenPriceInUSD from './service';
import { filePath, progressBarOptions } from './config';
import { validateDate, validateToken, logDataInTableView } from './utils';

const program = new Command();
const progressBar = new cliProgress.SingleBar(progressBarOptions);
const calculatedData = {
  WITHDRAWAL: {},
  DEPOSIT: {},
  BALANCE: {},
  BALANCE_USD: {},
  TABLE_VIEW: [],
};

const options = program
  .helpOption('-h, --help', 'Help message')
  .option('-d, --date <seconds>', 'Date to filter the data', validateDate)
  .option('-t, --token <symbol>', 'Token symbol to filter the data', validateToken)
  .parse(process.argv)
  .opts();

const dataTransformer = (tokenPriceInUSD) => {
  const dateInView = options.date ? [options.date, new Date(options.date).toGMTString()] : [];
  const { WITHDRAWAL, DEPOSIT } = calculatedData;
  mapKeys(DEPOSIT, (value, key) => {
    const withdrawal = (WITHDRAWAL[key] || 0);
    const balance = value - withdrawal;
    const balanceUSD = (balance * tokenPriceInUSD[key]).toFixed(2);
    calculatedData.BALANCE[key] = balance;
    calculatedData.BALANCE_USD[key] = balanceUSD;
    calculatedData.TABLE_VIEW.push([key, value, withdrawal, balance, balanceUSD, ...dateInView]);
    return value;
  });
};

const handleOnData = ({
  timestamp, transaction_type, token, amount,
}) => {
  progressBar.increment();
  if (options.token && options.token !== token) {
    return;
  }
  if (!get(calculatedData, `${transaction_type}.${token}`)) {
    set(calculatedData, `${transaction_type}.${token}`, 0);
  }
  if (options.date && options.date <= Number(timestamp)) {
    return;
  }
  calculatedData[transaction_type][token] += Number(amount);
};

const handleOnEnd = async () => {
  progressBar.stop();
  const tokensDeposited = keys(calculatedData.DEPOSIT);
  const tokenPriceInUSD = await fetchTokenPriceInUSD(tokensDeposited);
  dataTransformer(tokenPriceInUSD);
  logDataInTableView(calculatedData, options);
  process.exit(0);
};

createReadStream(resolve(__dirname, filePath))
  .pipe(csv())
  .on('headers', () => progressBar.start(progressBarOptions.max, 0))
  .on('data', handleOnData)
  .on('end', handleOnEnd);
