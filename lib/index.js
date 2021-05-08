"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleBalanceCalculation = exports.handleOnData = void 0;

var _csvParser = _interopRequireDefault(require("csv-parser"));

var _config = require("./config");

var _path = require("path");

var _commander = require("commander");

var _fs = require("fs");

var _lodash = require("lodash");

var _utils = require("./utils");

var program = new _commander.Command();
var calculatedData = {
  WITHDRAWAL: {},
  DEPOSIT: {},
  BALANCE: {}
};
var options = program.helpOption('-h, --help', 'custom help message').option('-d, --date <seconds>', 'Integer number of seconds since the Epoch', _utils.validateDate).option('-t, --token <symbol>', 'The crypto token symbol', _utils.validateToken).parse(process.argv).opts();
console.log("options::", options);

var handleOnData = function handleOnData(_ref) {
  var timestamp = _ref.timestamp,
      transaction_type = _ref.transaction_type,
      token = _ref.token,
      amount = _ref.amount;

  if (options.token && options.token !== token) {
    return;
  }

  if (options.date && options.date >= Number(timestamp)) {
    return;
  }

  if (!(0, _lodash.get)(calculatedData, "".concat(transaction_type, ".").concat(token))) {
    (0, _lodash.set)(calculatedData, "".concat(transaction_type, ".").concat(token), 0);
  }

  calculatedData[transaction_type][token] += Number(amount);
};

exports.handleOnData = handleOnData;

var handleBalanceCalculation = function handleBalanceCalculation() {
  var WITHDRAWAL = calculatedData.WITHDRAWAL,
      DEPOSIT = calculatedData.DEPOSIT;
  (0, _lodash.mapKeys)(WITHDRAWAL, function (value, key) {
    calculatedData.BALANCE[key] = DEPOSIT[key] - value;
    return value;
  });
};

exports.handleBalanceCalculation = handleBalanceCalculation;
(0, _fs.createReadStream)((0, _path.resolve)(__dirname, _config.filePath)).pipe((0, _csvParser["default"])()).on('data', handleOnData).on("end", function () {
  handleBalanceCalculation();
  console.log("calculatedData::", calculatedData);
  process.exit(0);
});