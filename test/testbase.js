"use strict";

var expect = require('chai').expect;
var fs = require('fs');
var execFile = require('child_process').execFile;
var csvwriter = require('../lib/csvwriter');

module.exports.readFixture = function (name, callback) {
    return fs.readFile(__dirname + '/fixtures/' + name, 'utf8', callback);
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
                    expect(err).to.be.null();
                    expect(csv).to.equal(outputData);
                    done();
                });
            }
        });
    });
};

module.exports.expectCLI = function (input, output, done, params) {
    params = [__dirname + '/fixtures/' + input].concat(params || []);
    execFile(__dirname + '/../bin/csvwriter.js', params, function (err, csv) {
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
