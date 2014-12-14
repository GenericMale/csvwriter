//The MIT License (MIT)
//
//Copyright (c) 2014 Sebastian Maurer
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

/*global module*/
/*jslint evil: true*/
"use strict";

var jsonpath = require("JSONPath").eval;
var Table = require('cli-table');

function flatten(data, path, row, columns, params) {
    if (params.maxDepth >= 0 && path.length > (params.maxDepth + 1)) {
        return row;
    }

    if (data instanceof Array) {
        if (params.arrayDelimiter && data.length > 0 && typeof data[0] !== 'object' && !(data[0] instanceof Array)) {
            flatten(data.join(params.arrayDelimiter), path, row, columns, params);
        } else {
            var i;
            for (i = 0; i < data.length; i++) {
                flatten(data[i], path.concat(i), row, columns, params);
            }
        }
    } else if (typeof data === 'object') {
        var key;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                flatten(data[key], path.concat(key), row, columns, params);
            }
        }
    } else {
        var field = path.join(params.nestingDelimiter);
        row[field] = data;
        if (columns.indexOf(field) === -1) {
            columns.push(field);
        }
    }

    return row;
}

function quote(field, params) {
    var str = '';
    var needsQuoting = false;

    if (field !== null && field !== undefined) {
        if (typeof field === 'number') {
            str = field.toString().replace('.', params.decimalSeparator);
        } else {
            str = field.toString();
        }

        if (params.doublequote && params.quoting !== 3) {
            str = str.replace(new RegExp(params.quotechar, 'g'), params.quotechar + params.quotechar);
        }

        if (params.suppressLineBreaks) {
            str = str.replace(new RegExp('\r?\n', 'g'), '');
        }
    }

    if (params.quoting === 1) {
        needsQuoting = true;
    } else if (params.quoting === 2) {
        needsQuoting = typeof field !== 'number';
    } else if (params.quoting !== 3) {
        needsQuoting = str.indexOf(params.delimiter) !== -1 || str.indexOf(params.quotechar) !== -1 || str.indexOf('\n') !== -1;
    }

    return needsQuoting ? params.quotechar + str + params.quotechar : str;
}

function csvwriter(data, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }

    params = params || {};
    params.tabs = params.tabs || false;
    params.delimiter = params.tabs ? '\t' : (typeof params.delimiter === 'string' ? params.delimiter : ',');
    params.decimalSeparator = typeof params.decimalSeparator === 'string' ? params.decimalSeparator : '.';
    params.arrayDelimiter = typeof params.arrayDelimiter === 'string' ? params.arrayDelimiter : ',';
    params.nestingDelimiter = typeof params.nestingDelimiter === 'string' ? params.nestingDelimiter : '.';

    params.quotechar = typeof params.quotechar === 'string' ? params.quotechar : '"';
    params.doublequote = params.doublequote !== false;
    params.suppressLineBreaks = params.suppressLineBreaks || false;
    params.quoting = params.quoting >= 0 && params.quoting <= 3 ? params.quoting : 0;

    params.linenumbers = params.linenumbers || false;
    params.zero = params.zero || false;

    params.path = params.path || null;
    params.fields = params.fields || null;
    params.maxDepth = typeof params.maxDepth === 'number' ? params.maxDepth : -1;

    params.headerRow = params.headerRow !== false;
    params.table = params.table || false;
    params.crlf = params.crlf !== false;


    var newline = params.crlf === false ? '\n' : '\r\n';

    if (typeof data !== 'object' && !(data instanceof Array)) {
        try {
            data = JSON.parse(data);
        } catch (err) {
            callback(err);
            return;
        }
    }

    var columns = [],
        rows = [],
        csv = '',
        i = 0,
        ii = 0,
        table;

    if (params.path) {
        try {
            data = jsonpath(data, params.path);
        } catch (err) {
            callback(err);
            return;
        }
    }

    if (!(data instanceof Array)) {
        data = [data];
    }

    data.forEach(function (d) {
        rows.push(flatten(d, [], {}, columns, params));
    });

    columns = params.fields ? params.fields.split(',') : columns;

    if (params.table) {
        if (params.linenumbers) {
            columns = [''].concat(columns);
        }

        table = new Table(params.headerRow ? {head: columns} : {});
        rows.forEach(function (row, rowNum) {
            table.push(columns.map(function (column, colNum) {
                if (colNum === 0 && params.linenumbers) {
                    return params.zero ? rowNum : rowNum + 1;
                }
                return row.hasOwnProperty(column) ? row[column] : '';
            }));
        });

        csv = table.toString();
    } else {
        if (columns.length && params.headerRow) {
            if (params.linenumbers) {
                csv += quote('', params) + params.delimiter;
            }

            for (i = 0; i < columns.length; i++) {
                if (i > 0) {
                    csv += params.delimiter;
                }

                csv += quote(columns[i], params);
            }

            csv += newline;
        }

        for (i = 0; i < rows.length; i++) {
            if (params.linenumbers) {
                csv += quote(params.zero ? i : i + 1, params) + params.delimiter;
            }

            for (ii = 0; ii < columns.length; ii++) {
                if (ii > 0) {
                    csv += params.delimiter;
                }

                csv += quote(rows[i].hasOwnProperty(columns[ii]) ? rows[i][columns[ii]] : '', params);
            }

            csv += newline;
        }
    }

    callback(null, csv);
}

module.exports = csvwriter;
