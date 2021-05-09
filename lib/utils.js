"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logDataInTableView = exports.validateToken = exports.validateDate = exports.errorLogger = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _colors2 = _interopRequireDefault(require("colors"));

var _cliTable = _interopRequireDefault(require("cli-table"));

/**
 * Logging the error in console with red color and exiting the process
 * @param  {string|object} message Message to be logged in the console
 */
var errorLogger = function errorLogger(message) {
  console.log(_colors2["default"].red(message));
  process.exit(1);
};
/**
 * Validated the date of cli option
 * @param  {string|number} input Date string or the Unix epoch
 * @returns  {number} Valid unix epoch integer
 */


exports.errorLogger = errorLogger;

var validateDate = function validateDate(input) {
  if (!Number.isNaN(Number(input))) {
    input = Number(input);
  }

  var dateIs = new Date(input).getTime();

  if (Number.isNaN(dateIs)) {
    return errorLogger("option '-d, --date <Date>' value for argument 'Date' is not a valid date");
  }

  return dateIs;
};
/**
 * Validated the token of cli option
 * @param  {string} input The token symbol
 * @returns  {number} Valid string in upper case
 */


exports.validateDate = validateDate;

var validateToken = function validateToken(input) {
  if (!(0, _typeof2["default"])(input) === 'string' && !(input instanceof String)) {
    return errorLogger("option '-t, --token <symbol>' value for argument 'symbol' is not a valid string");
  }

  return input.toUpperCase();
};
/**
 * Logging the data in table view on the console 
 * @param  {object} transformedData Modified final data from the CSV
 * @param  {object} options Extracted options defined in commands line
 */


exports.validateToken = validateToken;

var logDataInTableView = function logDataInTableView(transformedData, options) {
  var head = ['Symbol', 'Overall Deposit', 'Overall Withdraw', 'Balance', 'Balance in USD Price'];

  if (options.date) {
    head.push('Unix time');
    head.push('GMT time');
  }

  var table = new _cliTable["default"]({
    head: head
  });
  table.push.apply(table, (0, _toConsumableArray2["default"])(transformedData.TABLE_VIEW));
  console.log(table.toString());
};

exports.logDataInTableView = logDataInTableView;