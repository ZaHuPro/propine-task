"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progressBarOptions = exports.tokenPriceEndpointURL = exports.filePath = void 0;

var _colors2 = _interopRequireDefault(require("colors"));

var filePath = '../assets/transactions.csv';
exports.filePath = filePath;
var tokenPriceEndpointURL = 'https://min-api.cryptocompare.com/data/pricemulti?tsyms=USD&api_key=8a40e2ade21cbdf645ae47836bae9dcc5acf206b3296497542f8d44ac961bba5';
exports.tokenPriceEndpointURL = tokenPriceEndpointURL;
var progressBarOptions = {
  format: "Processing CSV... |".concat(_colors2["default"].cyan('{bar}'), "| {percentage}% || {value}/{total}"),
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
  max: 30000000
};
exports.progressBarOptions = progressBarOptions;