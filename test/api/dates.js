var csvwriter = require('../../lib/csvwriter');
var expect = require('chai').expect;

describe('dates', function () {
    it('will be converted to ISO string', function (done) {
        csvwriter({date:new Date(2000,1,2,3,4,5,6)}, function(err, csv) {
            expect(err).to.be.null;
            expect(csv).to.equal('date\r\n2000-02-02T02:04:05.006Z\r\n');
            done();
        });
    });
});