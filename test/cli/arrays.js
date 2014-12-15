var expectCLI = require('./../testbase').expectCLI;
var expect = require('chai').expect;

describe('arrays (CLI)', function () {
    it('can be primitives', function (done) {
        expectCLI('arrays/primitives.json', 'arrays/primitives.csv', done);
    });
    it('can have different delimiters', function (done) {
        expectCLI('arrays/primitives.json', 'arrays/primitives_semicolon.csv', done, '-a ";"');
    });
    it('can be spread out to columns', function (done) {
        expectCLI('arrays/primitives.json', 'arrays/primitives_columns.csv', done, '-a ""');
    });
    it('can be complex', function (done) {
        expectCLI('arrays/complex.json', 'arrays/complex.csv', done);
    });
});