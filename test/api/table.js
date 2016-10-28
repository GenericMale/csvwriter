var expectAPI = require('./../testbase').expectAPI;

describe('table', function () {
    it('looks good by default', function (done) {
        expectAPI('table/data.json', 'table/default.txt', done, {table: true});
    });
    it('may contain line numbers', function (done) {
        expectAPI('table/data.json', 'table/linenumbers.txt', done, {table: true, lineNumbers: true});
    });
    it('line numbers can start with 0', function (done) {
        expectAPI('table/data.json', 'table/zero.txt', done, {table: true, lineNumbers: true, zero: true});
    });
    it('may be created without header', function (done) {
        expectAPI('table/data.json', 'table/nohead.txt', done, {table: true, header: false});
    });
    it('can write a specific string for missing values', function (done) {
        expectAPI('table/data.json', 'table/nullstring.txt', done, {table: true, nullString: 'N/A'});
    });
    it('supports header colors', function (done) {
        expectAPI('table/data.json', 'table/color.txt', done, {table: true, headerColor: 'red'});
    });
});