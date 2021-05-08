"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = require("fs");

var _path = require("path");

var _commander = require("commander");

var _utils = require("./utils");

var program = new _commander.Command();
program.helpOption('-h, --HELP', 'custom help message').option('-d, --date <seconds>', 'Integer number of seconds since the Epoch', _utils.validateDate).option('-t, --token <symbol>', 'The crypto token symbol', _utils.validateToken);
program.parse(process.argv);
var options = program.opts();
console.log(options);
(0, _fs.createReadStream)((0, _path.resolve)(__dirname, '../source/transactions1.csv')).pipe(csv()).on('data', function (each) {
  console.log(each);
});
var _default = {
  program: program
};
exports["default"] = _default;