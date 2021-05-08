"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateToken = exports.validateDate = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _colors2 = _interopRequireDefault(require("colors"));

var errorLogger = function errorLogger(message) {
  console.log(_colors2["default"].red(message));
  process.exit(1);
};

var validateDate = function validateDate(input) {
  if (isNaN(input) || !(new Date(input) instanceof Date)) {
    return errorLogger("option '-d, --date <seconds>' value for argument 'seconds' is not a valid integer of seconds");
  }

  return Number(input);
};

exports.validateDate = validateDate;

var validateToken = function validateToken(input) {
  if (!(0, _typeof2["default"])(input) === 'string' || !(input instanceof String)) {
    return errorLogger("option '-t, --token <symbol>' value for argument 'symbol' is not a valid string of token symbol");
  }

  return input.toUpperCase();
};

exports.validateToken = validateToken;