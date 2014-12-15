/*global __dirname */

var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var csvwriter = require('../lib/csvwriter');
var path = require('path');

module.exports.readFixture = function (name, callback) {
    return fs.readFile(path.join(__dirname, 'fixtures', name), 'utf8', callback);
};

module.exports.expectAPI = function (input, output, done, params) {
    module.exports.readFixture(input, function (err, inputData) {
        expect(err).to.be.null();
        csvwriter(inputData, params, function (err, csv) {
            if (typeof output === 'function') {
                output(err, csv);
            } else {
                expect(err).to.be.null();
                module.exports.readFixture(output, function (err, outputData) {
                    csv = csv.replace(/\u001b\[.*?m/g, ''); //remove ANSI colors (for table comparison);

                    expect(err).to.be.null();
                    expect(csv).to.equal(outputData);
                    done();
                });
            }
        });
    });
};

module.exports.expectCLI = function (input, output, done, params) {
    var csvwriter = path.join(__dirname, '..', 'bin', 'csvwriter.js');
    var fixture = path.join(__dirname, 'fixtures', input);
    exec('"' + process.execPath + '" "' + csvwriter + '" "' + fixture + '" ' + params, function (err, csv) {
        if (typeof output === 'function') {
            output(err, csv);
        } else {
            expect(err).to.be.null();
            module.exports.readFixture(output, function (err, outputData) {
                expect(err).to.be.null();
                expect(csv).to.equal(outputData);
                done();
            });
        }
    });
};
