var expectAPI = require('./../testbase').expectAPI;
var expect = require('chai').expect;

describe('arrays', function () {
    it('can be primitives', function (done) {
        expectAPI('arrays/primitives.json', 'arrays/primitives.csv', done);
    });
    it('can have different delimiters', function (done) {
        expectAPI('arrays/primitives.json', 'arrays/primitives_semicolon.csv', done, {arrayDelimiter: ';'});
    });
    it('can be spread out to columns', function (done) {
        expectAPI('arrays/primitives.json', 'arrays/primitives_columns.csv', done, {arrayDelimiter: ''});
    });
    it('can be complex', function (done) {
        expectAPI('arrays/complex.json', 'arrays/complex.csv', done);
    });
});