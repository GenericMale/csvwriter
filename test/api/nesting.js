var expectAPI = require('./../testbase').expectAPI;
var expect = require('chai').expect;

describe('nesting', function () {
    it('can get complex', function (done) {
        expectAPI('nesting/data.json', 'nesting/default.csv', done);
    });
    it('can be disabled', function (done) {
        expectAPI('nesting/data.json', 'nesting/simple.csv', done, {maxDepth: 0});
    });
    it('can be limited to depth', function (done) {
        expectAPI('nesting/data.json', 'nesting/maxDepth2.csv', done, {maxDepth: 2});
    });
    it('can have different delimiters', function (done) {
        expectAPI('nesting/data.json', 'nesting/delimiter.csv', done, {nestingDelimiter: '|'});
    });
    it('can be traversed using jsonpath', function (done) {
        expectAPI('nesting/data.json', 'nesting/repos.csv', done, {path: '$..repository'});
    });
    it('can be filtered to specific columns', function (done) {
        expectAPI('nesting/data.json', 'nesting/packages.csv', done, {
            path: '$..packages[*]',
            fields: 'name,repository.url'
        });
    });
    it('reports illegal jsonpath', function (done) {
        expectAPI('nesting/data.json', function (err, csv) {
            expect(err).not.to.be.null;
            expect(csv).to.be.undefined;
            done();
        }, done, {path: '()'});
    });
});