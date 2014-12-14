var expectAPI = require('./helpers/testutil').expectAPI;
var expect = require('chai').expect;

describe('quotes', function () {
    it('are placed where needed', function (done) {
        expectAPI('quotes/data.json', 'quotes/default.csv', done);
    });
    it('can be placed everywhere', function (done) {
        expectAPI('quotes/data.json', 'quotes/all.csv', done, {quoting: 1});
    });
    it('can only be added for everything not a number', function (done) {
        expectAPI('quotes/data.json', 'quotes/numbers.csv', done, {quoting: 2});
    });
    it('can be disabled', function (done) {
        expectAPI('quotes/data.json', 'quotes/none.csv', done, {quoting: 3});
    });
    it('can ignore quotes in values', function (done) {
        expectAPI('quotes/data.json', 'quotes/doublequote.csv', done, {doublequote: false});
    });
    it('can be changed', function (done) {
        expectAPI('quotes/data.json', 'quotes/quotechar.csv', done, {quotechar: '\''});
    });
    it('will adapt to changed delimiters', function (done) {
        expectAPI('quotes/data.json', 'quotes/delimiter.csv', done, {delimiter: ';'});
    });
    it('will adapt to changed decimal separator', function (done) {
        expectAPI('quotes/data.json', 'quotes/decimalSeparator.csv', done, {decimalSeparator: ','});
    });
    it('will adapt to changed array delimiter', function (done) {
        expectAPI('quotes/data.json', 'quotes/arrays.csv', done, {arrayDelimiter: ';'});
    });
});