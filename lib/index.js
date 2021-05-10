"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ora = _interopRequireDefault(require("ora"));

var _csvParser = _interopRequireDefault(require("csv-parser"));

var _commander = require("commander");

var _fs = require("fs");

var _lodash = require("lodash");

var _service = _interopRequireDefault(require("./service"));

var _config = require("./config");

var _utils = require("./utils");

var program = new _commander.Command();
var spinner = (0, _ora["default"])({
  text: '0',
  prefixText: "Processing CSV...",
  spinner: 'balloon'
});
var transformedData = {
  WITHDRAWAL: {},
  DEPOSIT: {},
  BALANCE: {},
  BALANCE_USD: {},
  TABLE_VIEW: [],
  COLUMN_COUNT: 0
};
/**
 * Handling the command-line interfaces
 * @return  {object}  extracted options defined in commands line
 */

var options = program.helpOption('-h, --help', 'help message').option('-d, --date <date>', 'date to filter the data', _utils.validateDate).option('-t, --token <symbol>', 'token symbol to filter the data', _utils.validateToken).option('-p, --path <path>', 'full path of the CSV file').parse(process.argv).opts();
/**
 * Transforms and updates the data in 'transformedData' variable
 * @param  {object} tokenPriceInUSD Extracted data from the external API
 */

var dataTransformer = function dataTransformer(tokenPriceInUSD) {
  var dateInView = options.date ? [options.date, new Date(options.date).toGMTString()] : [];
  var WITHDRAWAL = transformedData.WITHDRAWAL,
      DEPOSIT = transformedData.DEPOSIT;
  (0, _lodash.mapKeys)(DEPOSIT, function (value, key) {
    var withdrawal = WITHDRAWAL[key] || 0;
    var balance = value - withdrawal;
    var balanceUSD = (balance * tokenPriceInUSD[key]).toFixed(2);
    transformedData.BALANCE[key] = balance;
    transformedData.BALANCE_USD[key] = balanceUSD;
    transformedData.TABLE_VIEW.push([key, value, withdrawal, balance, balanceUSD].concat(dateInView));
    return value;
  });
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
  spinner.text = transformedData.COLUMN_COUNT.toString();

  if (options.token && options.token !== token) {
    return;
  }

  if (!(0, _lodash.get)(transformedData, "".concat(transaction_type, ".").concat(token))) {
    (0, _lodash.set)(transformedData, "".concat(transaction_type, ".").concat(token), 0);
  }

  if (options.date && options.date <= Number(timestamp)) {
    return;
  }

  transformedData[transaction_type][token] += Number(amount);
};
/**
 * Handles the final data after from "createReadStream"
 */


var handleOnEnd = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var tokensDeposited, tokenPriceInUSD;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spinner.succeed();
            tokensDeposited = (0, _lodash.keys)(transformedData.DEPOSIT);
            _context.next = 4;
            return (0, _service["default"])(tokensDeposited);

          case 4:
            tokenPriceInUSD = _context.sent;
            dataTransformer(tokenPriceInUSD);
            (0, _utils.logDataInTableView)(transformedData, options);
            process.exit(0);

          case 8:
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