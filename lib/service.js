"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _config = require("./config");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Extracts and transforms to valid data from the API call
 * @param  {array} tokens Array of token symbol
 * @param  {object} data JSON response from the external API call
 * @returns  {object} Extracted and transformed token price data 
 */
var extractData = function extractData(tokens, data) {
  return tokens.reduce(function (acc, obj) {
    return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, obj, (0, _lodash.get)(data, "".concat(obj, ".USD"), 0)));
  }, {});
};
/**
 * Calls the external API for exchange rates
 * @param  {array} tokens Array of token symbol
 * @returns  {object} JSON response from the external API call
 */


var fetchTokenPriceInUSD = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(tokens) {
    var res, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _nodeFetch["default"])("".concat(_config.tokenPriceEndpointURL, "&fsyms=").concat(tokens.join(',')));

          case 3:
            res = _context.sent;
            _context.next = 6;
            return res.json();

          case 6:
            data = _context.sent;
            return _context.abrupt("return", extractData(tokens, data));

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", console.error(_context.t0));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function fetchTokenPriceInUSD(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = fetchTokenPriceInUSD;
exports["default"] = _default;