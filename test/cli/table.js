var expectCLI = require('./../testbase').expectCLI;
var expect = require('chai').expect;

describe('table (CLI)', function () {
    it('looks good by default', function (done) {
        expectCLI('table/data.json', 'table/default.txt', done, '-T');
    });
    it('may contain line numbers', function (done) {
        expectCLI('table/data.json', 'table/linenumbers.txt', done, '-Tl');
    });
    it('line numbers can start with 0', function (done) {
        expectCLI('table/data.json', 'table/zero.txt', done, '-Tlz');
    });
    it('may be created without header', function (done) {
        expectCLI('table/data.json', 'table/nohead.txt', done, '-TH');
    });
    it('can write a specific string for missing values', function (done) {
        expectCLI('table/data.json', 'table/nullstring.txt', done, '-T -s "N/A"');
    });
});