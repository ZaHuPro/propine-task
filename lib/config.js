"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenPriceEndpointURL = exports.filePath = void 0;

var _colors2 = _interopRequireDefault(require("colors"));

var _path = require("path");

var filePath = (0, _path.resolve)(__dirname, '../assets/transactions.csv');
exports.filePath = filePath;
var tokenPriceEndpointURL = 'https://min-api.cryptocompare.com/data/pricemulti?tsyms=USD&api_key=8a40e2ade21cbdf645ae47836bae9dcc5acf206b3296497542f8d44ac961bba5';
exports.tokenPriceEndpointURL = tokenPriceEndpointURL;