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
 * To log the error in the console with red color and exiting the process
 * @param  {string|object} message Error message to be logged in the console
 */
var errorLogger = function errorLogger(message) {
  console.log(_colors2["default"].red(message));
  process.exit(1);
};
/**
 * Validates the date of cli option
 * @param  {number} input The Unix epoch seconds
 * @returns  {object} Valid date object
 */


exports.errorLogger = errorLogger;

var validateDate = function validateDate(input) {
  var dateIs = new Date(+input);

  if (Number.isNaN(dateIs.valueOf())) {
    return errorLogger("option '-d, --date <Date>' value for argument 'Date' is not a valid integer of unix epoch");
  }

  return dateIs;
};
/**
 * Validates the token of cli option
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
 * To log the data in table view on the console 
 * @param  {object} tableData Modified data for the table view
 */


exports.validateToken = validateToken;

var logDataInTableView = function logDataInTableView(tableData) {
  var head = ['Symbol', 'Overall Deposit', 'Overall Withdraw', 'Balance', 'Balance in USD Price'];
  var table = new _cliTable["default"]({
    head: head
  });
  table.push.apply(table, (0, _toConsumableArray2["default"])(tableData));
  console.log(table.toString());
};

exports.logDataInTableView = logDataInTableView;