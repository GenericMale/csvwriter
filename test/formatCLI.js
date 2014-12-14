var expectCLI = require('./helpers/testutil').expectCLI;
var expect = require('chai').expect;

describe('format (CLI)', function () {
    it('uses commas by default', function (done) {
        expectCLI('format/data.json', 'format/default.csv', done);
    });
    it('can be changed to semicolons', function (done) {
        expectCLI('format/data.json', 'format/semicolons.csv', done, ['-d', ';']);
    });
    it('can use anything (e.g. doublepipes)', function (done) {
        expectCLI('format/data.json', 'format/doublepipe.csv', done, ['-d', '||']);
    });
    it('can use tabs', function (done) {
        expectCLI('format/data.json', 'format/tabs.csv', done, ['-t']);
    });
    it('can add line numbers', function (done) {
        expectCLI('format/data.json', 'format/linenumbers.csv', done, ['-l']);
    });
    it('can add line numbers starting with 0', function (done) {
        expectCLI('format/data.json', 'format/zero.csv', done, ['-l', '-z']);
    });
    it('can be without header row', function (done) {
        expectCLI('format/data.json', 'format/noheader.csv', done, ['-H']);
    });
    it('will convert to array', function (done) {
        expectCLI('format/object.json', 'format/object.csv', done);
    });
    it('can become a console table', function (done) {
        expectCLI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, ['-T']);
    });
    it('can become a console table with line numbers', function (done) {
        expectCLI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, ['-T', '-l']);
    });
    it('can become a console table with line numbers starting with 0', function (done) {
        expectCLI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, ['-T', '-l', '-z']);
    });
    it('can become a console table without header', function (done) {
        expectCLI('format/data.json', function (err, csv) {
            expect(err).to.be.null();
            expect(csv).not.to.be.empty(); //TODO: validate table
            done();
        }, done, ['-T', '-H']);
    });
    it('reports illegal json', function (done) {
        expectCLI('format/illegal.json', function (err, csv) {
            expect(err).not.to.be.null();
            expect(csv).to.be.empty();
            done();
        }, done);
    });
});