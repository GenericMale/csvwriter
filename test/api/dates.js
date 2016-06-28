var csvwriter = require('../../lib/csvwriter');
var expect = require('chai').expect;

describe('dates', function () {
    it('will be converted to ISO string', function (done) {
        csvwriter({date:new Date('02 Feb 2000 02:04:05.006 GMT')}, function(err, csv) {
            expect(err).to.be.null;
            expect(csv).to.equal('date\r\n2000-02-02T02:04:05.006Z\r\n');
            done();
        });
    });
});