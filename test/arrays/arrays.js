var expect = require('chai').expect;
var fs = require('fs');
var csvwriter = require('../../lib/csvwriter');

function fixture(name) {
    return fs.readFileSync(__dirname + '/fixtures/' + name, 'utf8');
}

describe('arrays', function () {
    it('can be primitives', function (done) {
        csvwriter(fixture('primitives.json'), function (err, csv) {
            expect(csv).to.equal(fixture('primitives.csv'));
            done();
        });
    });

    it('can have different delimiters', function (done) {
        csvwriter(fixture('primitives.json'), {arrayDelimiter: ';'}, function (err, csv) {
            expect(csv).to.equal(fixture('primitives_semicolon.csv'));
            done();
        });
    });

    it('can be spread out to columns', function (done) {
        csvwriter(fixture('primitives.json'), {arrayDelimiter: ''}, function (err, csv) {
            expect(csv).to.equal(fixture('primitives_columns.csv'));
            done();
        });
    });

    it('can be complex', function (done) {
        csvwriter(fixture('complex.json'), function (err, csv) {
            expect(csv).to.equal(fixture('complex.csv'));
            done();
        });
    });
});