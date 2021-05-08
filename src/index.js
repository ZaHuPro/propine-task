import csv from 'csv-parser';
import { filePath } from './config';
import { resolve } from 'path';
import { Command } from 'commander';
import { createReadStream } from 'fs';
import { get, set, mapKeys } from "lodash";
import { validateDate, validateToken } from './utils';

const program = new Command();
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

export const handleOnData = ({ timestamp, transaction_type, token, amount }) => {
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

export const handleBalanceCalculation = () => {
    const { WITHDRAWAL, DEPOSIT } = calculatedData;
    mapKeys(WITHDRAWAL, (value, key) => {
        calculatedData.BALANCE[key] = DEPOSIT[key] - value;
        return value;
    });
}

createReadStream(resolve(__dirname, filePath))
  .pipe(csv())
  .on('data', handleOnData)
  .on("end", () => {
      handleBalanceCalculation()
      console.log("calculatedData::", calculatedData)
      process.exit(0)
  })
