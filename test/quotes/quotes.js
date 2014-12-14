var expect = require('chai').expect;
var fs = require('fs');
var csvwriter = require('../../lib/csvwriter');

function fixture(name) {
    return fs.readFileSync(__dirname + '/fixtures/' + name, 'utf8');
}

describe('quotes', function () {
    it('are placed where needed', function (done) {
        csvwriter(fixture('data.json'), function (err, csv) {
            expect(csv).to.equal(fixture('default.csv'));
            done();
        });
    });
    it('can be placed everywhere', function (done) {
        csvwriter(fixture('data.json'), {quoting: 1}, function (err, csv) {
            expect(csv).to.equal(fixture('all.csv'));
            done();
        });
    });
    it('can only be added for everything not a number', function (done) {
        csvwriter(fixture('data.json'), {quoting: 2}, function (err, csv) {
            expect(csv).to.equal(fixture('numbers.csv'));
            done();
        });
    });
    it('can be disabled', function (done) {
        csvwriter(fixture('data.json'), {quoting: 3}, function (err, csv) {
            expect(csv).to.equal(fixture('none.csv'));
            done();
        });
    });
    it('can ignore quotes in values', function (done) {
        csvwriter(fixture('data.json'), {doublequote: false}, function (err, csv) {
            expect(csv).to.equal(fixture('doublequote.csv'));
            done();
        });
    });
    it('can be changed', function (done) {
        csvwriter(fixture('data.json'), {quotechar: '\''}, function (err, csv) {
            expect(csv).to.equal(fixture('quotechar.csv'));
            done();
        });
    });
    it('can adapt to changed delimiters', function (done) {
        csvwriter(fixture('data.json'), {delimiter: ';'}, function (err, csv) {
            expect(csv).to.equal(fixture('delimiter.csv'));
            done();
        });
    });
    it('can adapt to changed decimal separator', function (done) {
        csvwriter(fixture('data.json'), {decimalSeparator: ','}, function (err, csv) {
            expect(csv).to.equal(fixture('decimalSeparator.csv'));
            done();
        });
    });
    it('can adapt to changed array delimiter', function (done) {
        csvwriter(fixture('data.json'), {arrayDelimiter: ';'}, function (err, csv) {
            expect(csv).to.equal(fixture('arrays.csv'));
            done();
        });
    });
});