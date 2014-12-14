var expectAPI = require('./helpers/testutil').expectAPI;
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
        expectAPI('format/data.json', 'format/linenumbers.csv', done, {linenumbers: true});
    });
    it('can add line numbers starting with 0', function (done) {
        expectAPI('format/data.json', 'format/zero.csv', done, {linenumbers: true, zero: true});
    });
    it('can be without header row', function (done) {
        expectAPI('format/data.json', 'format/noheader.csv', done, {headerRow: false});
    });
    it('will convert to array', function (done) {
        expectAPI('format/object.json', 'format/object.csv', done);
    });
    it('can become a console table', function (done) {
        expectAPI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, {table: true});
    });
    it('can become a console table with line numbers', function (done) {
        expectAPI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, {table: true, linenumbers: true});
    });
    it('can become a console table with line numbers starting with 0', function (done) {
        expectAPI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, {table: true, linenumbers: true, zero: true});
    });
    it('can become a console table without header', function (done) {
        expectAPI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, {table: true, headerRow: false});
    });
    it('reports illegal json', function (done) {
        expectAPI('format/illegal.json', function (err, csv) {
            expect(err).not.to.be.null();
            expect(csv).to.be.undefined();
            done();
        }, done);
    });
});