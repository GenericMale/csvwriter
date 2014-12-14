var expect = require('chai').expect;
var fs = require('fs');
var csvwriter = require('../../lib/csvwriter');

function fixture(name) {
    return fs.readFileSync(__dirname + '/fixtures/' + name, 'utf8');
}

describe('format', function () {
    it('uses commas by default', function (done) {
        csvwriter(fixture('data.json'), function (err, csv) {
            expect(csv).to.equal(fixture('default.csv'));
            done();
        });
    });
    it('can be changed to semicolons', function (done) {
        csvwriter(fixture('data.json'), {delimiter: ";"}, function (err, csv) {
            expect(csv).to.equal(fixture('semicolons.csv'));
            done();
        });
    });
    it('can use anything (e.g. doublepipes)', function (done) {
        csvwriter(fixture('data.json'), {delimiter: "||"}, function (err, csv) {
            expect(csv).to.equal(fixture('doublepipe.csv'));
            done();
        });
    });
    it('can use tabs', function (done) {
        csvwriter(fixture('data.json'), {tabs: true}, function (err, csv) {
            expect(csv).to.equal(fixture('tabs.csv'));
            done();
        });
    });
    it('can use tabs', function (done) {
        csvwriter(fixture('data.json'), {tabs: true}, function (err, csv) {
            expect(csv).to.equal(fixture('tabs.csv'));
            done();
        });
    });
    it('can add line numbers', function (done) {
        csvwriter(fixture('data.json'), {linenumbers: true}, function (err, csv) {
            expect(csv).to.equal(fixture('linenumbers.csv'));
            done();
        });
    });
    it('can add line numbers starting with 0', function (done) {
        csvwriter(fixture('data.json'), {linenumbers: true, zero: true}, function (err, csv) {
            expect(csv).to.equal(fixture('zero.csv'));
            done();
        });
    });
    it('can be without header row', function (done) {
        csvwriter(fixture('data.json'), {headerRow: false}, function (err, csv) {
            expect(csv).to.equal(fixture('noheader.csv'));
            done();
        });
    });
    it('will convert to array', function (done) {
        csvwriter(fixture('object.json'), function (err, csv) {
            expect(csv).to.equal(fixture('object.csv'));
            done();
        });
    });
    it('can become a console table', function (done) {
        csvwriter(fixture('data.json'), {table: true}, function (err, csv) {
            expect(csv).to.be.not.empty; //TODO: validate table
            done();
        });
    });
    it('can become a console table with line numbers', function (done) {
        csvwriter(fixture('data.json'), {table: true, linenumbers: true}, function (err, csv) {
            expect(csv).to.be.not.empty; //TODO: validate table
            done();
        });
    });
    it('can become a console table with line numbers starting with 0', function (done) {
        csvwriter(fixture('data.json'), {table: true, linenumbers: true, zero: true}, function (err, csv) {
            expect(csv).to.be.not.empty; //TODO: validate table
            done();
        });
    });
    it('can become a console table without header', function (done) {
        csvwriter(fixture('data.json'), {table: true, headerRow: false}, function (err, csv) {
            expect(csv).to.be.not.empty; //TODO: validate table
            done();
        });
    });
    it('reports illegal json', function (done) {
        csvwriter('illegal', function (err, csv) {
            expect(err).not.to.be.null;
            expect(csv).to.be.undefined;
            done();
        });
    });
});