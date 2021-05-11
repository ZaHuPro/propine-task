"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ora = _interopRequireDefault(require("ora"));

var _csvParser = _interopRequireDefault(require("csv-parser"));

var _commander = require("commander");

var _fs = require("fs");

var _lodash = require("lodash");

var _config = require("./config");

var _service = _interopRequireDefault(require("./service"));

var _utils = require("./utils");

var program = new _commander.Command();
var spinner = (0, _ora["default"])({
  text: '0',
  prefixText: "Processing CSV...",
  spinner: 'balloon'
});
var transformedData = {
  WITHDRAWAL: {},
  // token => withdrawal amount mapping
  DEPOSIT: {},
  // token => deposit amount mapping
  BALANCE: {},
  // token => balance amount mapping
  BALANCE_USD: {},
  // token => balance USD amount mapping
  COLUMN_COUNT: 0,
  // Number of columns processed from CSV
  TOKENS: new Set() // Set of token symbols

}; // Handling the command-line interfaces options

var options = program.helpOption('-h, --help', 'help message').option('-d, --date <date>', 'integer of unix epoch date to filter the data', _utils.validateDate).option('-t, --token <symbol>', 'token symbol to filter the data', _utils.validateToken).option('-p, --path <path>', 'full path of the CSV file').parse(process.argv).opts();
/**
 * Transforms and updates the data in 'transformedData' variable
 * @param  {object} tokenPriceInUSD Extracted data from the external API
 */

var dataTransformer = function dataTransformer(tokenPriceInUSD) {
  var WITHDRAWAL = transformedData.WITHDRAWAL,
      DEPOSIT = transformedData.DEPOSIT,
      TOKENS = transformedData.TOKENS; // for each deposit, transforming and updating the data

  var tableData = Array.from(TOKENS).map(function (key) {
    var deposit = (0, _lodash.get)(DEPOSIT, key, 0);
    var withdrawal = (0, _lodash.get)(WITHDRAWAL, key, 0); // Calculating the balance from subtraction of overall deposit and withdrawal

    var balance = deposit - withdrawal; // Calculating USD price of the balance

    var balanceUSD = (balance * tokenPriceInUSD[key]).toFixed(2);
    transformedData.BALANCE[key] = balance;
    transformedData.BALANCE_USD[key] = balanceUSD; // Transforming the data to log in table view

    return [key, deposit, withdrawal, balance, balanceUSD];
  }); // Logging the data in table view

  (0, _utils.logDataInTableView)(tableData);
};
/**
 * Extracts the data as per the cli option by each column for the CSV
 * @param  {number} timestamp Integer number of seconds since the Epoch
 * @param  {string} transaction_type Either a DEPOSIT or a WITHDRAWAL
 * @param  {string} token The token symbol
 * @param  {number} amount The amount transacted
 */


var handleOnData = function handleOnData(_ref) {
  var timestamp = _ref.timestamp,
      transaction_type = _ref.transaction_type,
      token = _ref.token,
      amount = _ref.amount;
  transformedData.COLUMN_COUNT++;
  spinner.text = transformedData.COLUMN_COUNT.toString(); // If cli options has token and it's different from current one, skip processing

  if (options.token && options.token !== token) {
    return;
  } // If cli options has date and it's before this transaction time, skip processing


  if (options.date && options.date < new Date(+timestamp)) {
    return;
  }

  transformedData.TOKENS.add(token); // Adds the transaction amount to the specified transaction_type and token in transformedData variable

  var existingVal = (0, _lodash.get)(transformedData, "".concat(transaction_type, ".").concat(token), 0);
  (0, _lodash.set)(transformedData, "".concat(transaction_type, ".").concat(token), existingVal + Number(amount));
};
/**
 * Handles the final data after from "createReadStream"
 */


var handleOnEnd = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var tokenPriceInUSD;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spinner.succeed(); // Calls the service to get the USD price of the all tokens

            _context.next = 3;
            return (0, _service["default"])(Array.from(transformedData.TOKENS));

          case 3:
            tokenPriceInUSD = _context.sent;
            // Calls the dataTransformer to process the transformation and updates
            dataTransformer(tokenPriceInUSD);
            process.exit(0);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleOnEnd() {
    return _ref2.apply(this, arguments);
  };
}();

var path = options.path || _config.filePath;
/**
 * Opens the file as a readable stream and response passed to csv-parser
 * @param  {string} path cli option path or filepath from the config
 */

(0, _fs.createReadStream)(path).on('error', _utils.errorLogger).pipe((0, _csvParser["default"])()).on('headers', function () {
  return spinner.start();
}).on('data', handleOnData).on('end', handleOnEnd);