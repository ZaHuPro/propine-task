"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = require("lodash");

var _csvParser = _interopRequireDefault(require("csv-parser"));

var _path = require("path");

var _commander = require("commander");

var _cliProgress = _interopRequireDefault(require("cli-progress"));

var _fs = require("fs");

var _service = _interopRequireDefault(require("./service"));

var _config = require("./config");

var _utils = require("./utils");

var program = new _commander.Command();
var progressBar = new _cliProgress["default"].SingleBar(_config.progressBarOptions);
var calculatedData = {
  WITHDRAWAL: {},
  DEPOSIT: {},
  BALANCE: {},
  BALANCE_USD: {},
  TABLE_VIEW: []
};
var options = program.helpOption('-h, --help', 'custom help message').option('-d, --date <seconds>', 'Integer number of seconds since the Epoch', _utils.validateDate).option('-t, --token <symbol>', 'The crypto token symbol', _utils.validateToken).parse(process.argv).opts();

var dataTransformer = function dataTransformer(tokenPriceInUSD) {
  var dateInView = options.date ? [options.date, new Date(options.date).toGMTString()] : [];
  var WITHDRAWAL = calculatedData.WITHDRAWAL,
      DEPOSIT = calculatedData.DEPOSIT;
  (0, _lodash.mapKeys)(DEPOSIT, function (value, key) {
    var withdrawal = WITHDRAWAL[key] || 0;
    var balance = value - withdrawal;
    var balanceUSD = (balance * tokenPriceInUSD[key]).toFixed(2);
    calculatedData.BALANCE[key] = balance;
    calculatedData.BALANCE_USD[key] = balanceUSD;
    calculatedData.TABLE_VIEW.push([key, value, withdrawal, balance, balanceUSD].concat(dateInView));
    return value;
  });
};

var handleOnData = function handleOnData(_ref) {
  var timestamp = _ref.timestamp,
      transaction_type = _ref.transaction_type,
      token = _ref.token,
      amount = _ref.amount;
  progressBar.increment();

  if (options.token && options.token !== token) {
    return;
  }

  if (!(0, _lodash.get)(calculatedData, "".concat(transaction_type, ".").concat(token))) {
    (0, _lodash.set)(calculatedData, "".concat(transaction_type, ".").concat(token), 0);
  }

  if (options.date && options.date <= Number(timestamp)) {
    return;
  }

  calculatedData[transaction_type][token] += Number(amount);
};

var handleOnEnd = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var tokensDeposited, tokenPriceInUSD;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            progressBar.stop();
            tokensDeposited = (0, _lodash.keys)(calculatedData.DEPOSIT);
            _context.next = 4;
            return (0, _service["default"])(tokensDeposited);

          case 4:
            tokenPriceInUSD = _context.sent;
            dataTransformer(tokenPriceInUSD);
            (0, _utils.logDataInTableView)(calculatedData, options);
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

(0, _fs.createReadStream)((0, _path.resolve)(__dirname, _config.filePath)).pipe((0, _csvParser["default"])()).on('headers', function () {
  return progressBar.start(_config.progressBarOptions.max, 0);
}).on('data', handleOnData).on('end', handleOnEnd);