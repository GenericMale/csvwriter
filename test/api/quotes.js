var expectAPI = require('./../testbase').expectAPI;
var expect = require('chai').expect;

describe('quotes', function () {
    it('are placed where needed', function (done) {
        expectAPI('quotes/data.json', 'quotes/default.csv', done);
    });
    it('can be placed everywhere', function (done) {
        expectAPI('quotes/data.json', 'quotes/all.csv', done, {quoteMode: 1});
    });
    it('can only be added for everything not a number', function (done) {
        expectAPI('quotes/data.json', 'quotes/numbers.csv', done, {quoteMode: 2});
    });
    it('can be disabled', function (done) {
        expectAPI('quotes/data.json', 'quotes/none.csv', done, {quoteMode: 3});
    });
    it('can escape without quoting', function (done) {
        expectAPI('quotes/data.json', 'quotes/escape.csv', done, {quoteMode: 3, escape: '\\'});
    });
    it('can ignore quotes in values', function (done) {
        expectAPI('quotes/data.json', 'quotes/doublequote.csv', done, {doubleQuote: false});
    });
    it('can be changed', function (done) {
        expectAPI('quotes/data.json', 'quotes/quotechar.csv', done, {quote: '\''});
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
    it('will adapt to removed line breaks', function (done) {
        expectAPI('quotes/data.json', 'quotes/nolinebreaks.csv', done, {suppressLineBreaks: true});
    });
});