var expect = require('chai').expect;
var fs = require('fs');
var csvwriter = require('../../lib/csvwriter');

function fixture(name) {
    return fs.readFileSync(__dirname + '/fixtures/' + name, 'utf8');
}

describe('nesting', function () {
    it('can get complex', function (done) {
        csvwriter(fixture('data.json'), function (err, csv) {
            expect(csv).to.equal(fixture('default.csv'));
            done();
        });
    });

    it('can be disabled', function (done) {
        csvwriter(fixture('data.json'), {maxDepth: 0}, function (err, csv) {
            expect(csv).to.equal(fixture('simple.csv'));
            done();
        });
    });

    it('can be limited to depth', function (done) {
        csvwriter(fixture('data.json'), {maxDepth: 2}, function (err, csv) {
            expect(csv).to.equal(fixture('maxDepth2.csv'));
            done();
        });
    });

    it('can have different delimiters', function (done) {
        csvwriter(fixture('data.json'), {nestingDelimiter: '|'}, function (err, csv) {
            expect(csv).to.equal(fixture('delimiter.csv'));
            done();
        });
    });

    it('can be traversed using jsonpath', function (done) {
        csvwriter(fixture('data.json'), {path: '$..repository'}, function (err, csv) {
            expect(csv).to.equal(fixture('repos.csv'));
            done();
        });
    });

    it('can be filtered to specific columns', function (done) {
        csvwriter(fixture('data.json'), {path: '$..packages[*]', fields: 'name,repository.url'}, function (err, csv) {
            expect(csv).to.equal(fixture('packages.csv'));
            done();
        });
    });

    it('reports illegal jsonpath', function (done) {
        csvwriter(fixture('data.json'), {path: '()'}, function (err, csv) {
            expect(err).not.to.be.null;
            expect(csv).to.be.undefined;
            done();
        });
    });
});