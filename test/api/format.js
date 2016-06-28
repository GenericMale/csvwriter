var expectAPI = require('./../testbase').expectAPI;
var expect = require('chai').expect;

describe('format', function () {
    it('uses commas by default', function (done) {
        expectAPI('format/data.json', 'format/default.csv', done);
    });
    it('can be changed to semicolons', function (done) {
        expectAPI('format/data.json', 'format/semicolons.csv', done, {delimiter: ';'});
    });
    it('can use anything (e.g. doublepipes)', function (done) {
        expectAPI('format/data.json', 'format/doublepipe.csv', done, {delimiter: '||'});
    });
    it('can use tabs', function (done) {
        expectAPI('format/data.json', 'format/tabs.csv', done, {tabs: true});
    });
    it('can add line numbers', function (done) {
        expectAPI('format/data.json', 'format/linenumbers.csv', done, {lineNumbers: true});
    });
    it('can add line numbers starting with 0', function (done) {
        expectAPI('format/data.json', 'format/zero.csv', done, {lineNumbers: true, zero: true});
    });
    it('can be without header row', function (done) {
        expectAPI('format/data.json', 'format/noheader.csv', done, {header: false});
    });
    it('can write a specific string for missing values', function (done) {
        expectAPI('format/data.json', 'format/nullstring.csv', done, {nullString: 'N/A'});
    });
    it('can separate rows with LF', function (done) {
        expectAPI('format/data.json', 'linefeed/default.csv', done, {crlf: false});
    });
    it('will convert to array', function (done) {
        expectAPI('format/object.json', 'format/object.csv', done);
    });
    it('reports illegal json', function (done) {
        expectAPI('format/illegal.json', function (err, csv) {
            expect(err).not.to.be.null;
            expect(csv).to.be.undefined;
            done();
        }, done);
    });
});