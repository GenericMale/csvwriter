var expectAPI = require('./../testbase').expectAPI;
var expect = require('chai').expect;

describe('table', function () {
    it('looks good by default', function (done) {
        expectAPI('table/data.json', 'table/default.txt', done, {table: true});
    });
    it('may contain line numbers', function (done) {
        expectAPI('table/data.json', 'table/linenumbers.txt', done, {table: true, linenumbers: true});
    });
    it('line numbers can start with 0', function (done) {
        expectAPI('table/data.json', 'table/zero.txt', done, {table: true, linenumbers: true, zero: true});
    });
    it('may be created without header', function (done) {
        expectAPI('table/data.json', 'table/nohead.txt', done, {table: true, headerRow: false});
    });
});