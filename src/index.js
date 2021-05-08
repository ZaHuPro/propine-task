import csv from 'csv-parser';
import config from './config';
import { resolve } from 'path';
import { Command } from 'commander';
import { createReadStream } from 'fs';
import { validateDate, validateToken } from './utils';

const program = new Command();

program
  .helpOption('-h, --HELP', 'custom help message')
  .option('-d, --date <seconds>', 'Integer number of seconds since the Epoch', validateDate)
  .option('-t, --token <symbol>', 'The crypto token symbol', validateToken);

program.parse(process.argv);
const options = program.opts();

console.log(options);

createReadStream(resolve(__dirname, config.filePath))
  .pipe(csv())
  .on('data', (each) => {console.log(each)})

export default {
  program,
};

