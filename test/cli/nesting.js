var expectCLI = require('./../testbase').expectCLI;
var expect = require('chai').expect;

describe('nesting (CLI)', function () {
    it('can get complex', function (done) {
        expectCLI('nesting/data.json', 'nesting/default.csv', done);
    });
    it('can be disabled', function (done) {
        expectCLI('nesting/data.json', 'nesting/simple.csv', done, '-N 0');
    });
    it('can be limited to depth', function (done) {
        expectCLI('nesting/data.json', 'nesting/maxDepth2.csv', done, '-N 2');
    });
    it('can have different delimiters', function (done) {
        expectCLI('nesting/data.json', 'nesting/delimiter.csv', done, '-n "|"');
    });
    it('can be traversed using jsonpath', function (done) {
        expectCLI('nesting/data.json', 'nesting/repos.csv', done, '-p "$..repository"');
    });
    it('can be filtered to specific columns', function (done) {
        expectCLI('nesting/data.json', 'nesting/packages.csv', done, '-p "$..packages[*]" -f "name,repository.url"');
    });

    it('reports illegal jsonpath', function (done) {
        expectCLI('nesting/data.json', function (err) {
            expect(err).not.to.be.null;
            // FIXME: JSONPath writes to stdout on errors!
            //expect(csv).to.be.empty;
            done();
        }, done, '-p "()"');
    });
});