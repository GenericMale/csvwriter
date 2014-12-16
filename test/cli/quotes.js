var expectCLI = require('./../testbase').expectCLI;
var expect = require('chai').expect;

describe('quotes (CLI)', function () {
    it('are placed where needed', function (done) {
        expectCLI('quotes/data.json', 'quotes/default.csv', done);
    });
    it('can be placed everywhere', function (done) {
        expectCLI('quotes/data.json', 'quotes/all.csv', done, '-u 1');
    });
    it('can only be added for everything not a number', function (done) {
        expectCLI('quotes/data.json', 'quotes/numbers.csv', done, '-u 2');
    });
    it('can be disabled', function (done) {
        expectCLI('quotes/data.json', 'quotes/none.csv', done, '-u 3');
    });
    it('can escape without quoting', function (done) {
        expectCLI('quotes/data.json', 'quotes/escape.csv', done, '-u 3 -E "\\\\"');
    });
    it('can ignore quotes in values', function (done) {
        expectCLI('quotes/data.json', 'quotes/doublequote.csv', done, '-Q');
    });
    it('can be changed', function (done) {
        expectCLI('quotes/data.json', 'quotes/quotechar.csv', done, '-q "\'"');
    });
    it('will adapt to changed delimiters', function (done) {
        expectCLI('quotes/data.json', 'quotes/delimiter.csv', done, '-d ";"');
    });
    it('will adapt to changed decimal separator', function (done) {
        expectCLI('quotes/data.json', 'quotes/decimalSeparator.csv', done, '-D ","');
    });
    it('will adapt to changed array delimiter', function (done) {
        expectCLI('quotes/data.json', 'quotes/arrays.csv', done, '-a ";"');
    });
    it('will adapt to removed line breaks', function (done) {
        expectCLI('quotes/data.json', 'quotes/nolinebreaks.csv', done, '-L');
    });
});