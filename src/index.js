import csv from 'csv-parser';
import { resolve } from 'path';
import { Command } from 'commander';
import cliProgress from 'cli-progress';
import { createReadStream } from 'fs';
import { get, set, mapKeys } from "lodash";
import { validateDate, validateToken } from './utils';
import { filePath, progressBarOptions } from './config';

const program = new Command();
const progressBar = new cliProgress.SingleBar(progressBarOptions);
const calculatedData = {
    WITHDRAWAL: {},
    DEPOSIT: {},
    BALANCE: {}
}

const options = program
    .helpOption('-h, --help', 'custom help message')
    .option('-d, --date <seconds>', 'Integer number of seconds since the Epoch', validateDate)
    .option('-t, --token <symbol>', 'The crypto token symbol', validateToken)
    .parse(process.argv)
    .opts();

console.log("options::", options);

export const handleBalanceCalculation = () => {
    const { WITHDRAWAL, DEPOSIT } = calculatedData;
    mapKeys(WITHDRAWAL, (value, key) => {
        calculatedData.BALANCE[key] = DEPOSIT[key] - value;
        return value;
    });
}

export const handleOnData = ({ timestamp, transaction_type, token, amount }) => {
    progressBar.increment();
    if (options.token && options.token !== token) {
        return;
    }
    if (options.date &&  options.date >= Number(timestamp)) {
        return;
    }
    if (!get(calculatedData, `${transaction_type}.${token}`)) {
        set(calculatedData, `${transaction_type}.${token}`, 0);
    }
    calculatedData[transaction_type][token] += Number(amount);
}


export const handleOnEnd = () => {
    progressBar.stop();
    handleBalanceCalculation()
    console.log("calculatedData::", calculatedData)
    console.table(calculatedData.BALANCE)
    process.exit(0)
}

createReadStream(resolve(__dirname, filePath))
  .pipe(csv())
  .on('headers', () => progressBar.start(30000000, 0))
  .on('data', handleOnData)
  .on("end", handleOnEnd)
