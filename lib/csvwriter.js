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

/*jslint evil: true */

var jsonpath = require("JSONPath").eval;
var Table = require('cli-table');

module.exports = csvwriter;

/**
 * @typedef {object} csvParameters
 * @property {string} arrayDelimiter - delimiting character for arrays of primitives (strings, booleans, numbers), set to empty string ("") to disable flatting out primitive arrays (,)
 * @property {boolean} crlf - use line feed (\n) or carriage return + line feed (\r\n) as line separator (true)
 * @property {string} delimiter - delimiting character of the csv (,)
 * @property {string} decimalSeparator - the decimal mark to use for numbers (.)
 * @property {string} encoding - encoding used for the input and output (utf8)
 * @property {string} fields - specify a comma (,) separated list of fields to convert
 * @property {boolean} headerRow - include a header row as first line (true)
 * @property {string} path - jsonpath to apply on the object
 * @property {boolean} linenumbers - insert a column of line numbers at the front of the output, useful when piping to grep or as a simple primary key (false)
 * @property {boolean} suppressLineBreaks - remove line breaks (\n) from field values (false)
 * @property {string} nestingDelimiter - delimiter used for nested fields of the input (.)
 * @property {number} maxDepth - maximum depth of the json object, fields below max-depth will not be included in the csv, use -1 (default) to include all fields, 0 will not include nested objects
 * @property {string} output - write to csv, use - to write to stdout (default)
 * @property {string} quotechar - character used to quote strings in the csv (")
 * @property {boolean} doublequote - doublequote to escape the quote character (true)
 * @property {boolean} table - create a neat looking table for the console (false)
 * @property {number} quoting - quoting style used in the csv: 0 = quote minimal (default), 1 = quote all, 2 = quote non-numeric, 3 = quote none
 * @property {boolean} utfBom - write utf bom (0xFEFF or 0xEFBBBF) in csv if encoding is set to utf (false)
 * @property {boolean} zero - when interpreting or displaying column numbers, use zero-based numbering instead of the default 1-based numbering (false)
 */

/**
 * @callback csvCallback
 * @param {error} err - Error object or null if no error occurred.
 * @param {string} csv - The generated CSV as string.
 */

/**
 * Convert any JSON string to CSV with support for nested objects, filtering, many different CSV variations, CLI, ...
 *
 * @param {(string|object)} data - The source json data which should be converted. Can be a string or a javascript object.
 * @param {csvParameters} [params] - Configuration of the CSV generation.
 * @param {csvCallback} callback - Callback to handle the generated CSV string.
 */
function csvwriter (data, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = {};
    }

    params = applyDefaults(params);

    if (typeof data !== 'object' && !(data instanceof Array)) {
        try {
            data = JSON.parse(data);
        } catch (err) {
            callback(err);
            return;
        }
    }

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

    var columns = [];
    var rows = [];

    data.forEach(function (d) {
        rows.push(flatten(d, columns, params));
    });

    columns = params.fields ? params.fields.split(',') : columns;

    callback(null, params.table ?
        createCLITable(rows, columns, params) :
        createCSV(rows, columns, params));
}

function applyDefaults(params) {
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

    return params;
}

function createCLITable(rows, columns, params) {
    if (params.linenumbers) {
        columns = [''].concat(columns);
    }

    var table = new Table(params.headerRow ? {head: columns} : {});
    rows.forEach(function (row, rowNum) {
        table.push(columns.map(function (column, colNum) {
            if (colNum === 0 && params.linenumbers) {
                return params.zero ? rowNum : rowNum + 1;
            }
            return row.hasOwnProperty(column) ? row[column] : '';
        }));
    });

    return table.toString();
}

function createCSV(rows, columns, params) {
    var newline = params.crlf === false ? '\n' : '\r\n';

    var csv = '';
    var i, ii;
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
    return csv;
}

function flatten(data, columns, params, path, row) {
    path = path || [];
    row = row || {};

    if (params.maxDepth >= 0 && path.length > (params.maxDepth + 1)) {
        return row;
    }

    if (data instanceof Array) {
        flattenArray(data, columns, params, path, row);
    } else if (typeof data === 'object') {
        flattenObject(data, columns, params, path, row);
    } else {
        addField(data, columns, params, path, row);
    }

    return row;
}

function flattenArray(data, columns, params, path, row) {
    if (params.arrayDelimiter && data.length > 0 && typeof data[0] !== 'object' && !(data[0] instanceof Array)) {
        flatten(data.join(params.arrayDelimiter), columns, params, path, row);
    } else {
        var i;
        for (i = 0; i < data.length; i++) {
            flatten(data[i], columns, params, path.concat(i), row);
        }
    }
}

function flattenObject(data, columns, params, path, row) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            flatten(data[key], columns, params, path.concat(key), row);
        }
    }
}

function addField(data, columns, params, path, row) {
    var field = path.join(params.nestingDelimiter);
    row[field] = data;
    if (columns.indexOf(field) === -1) {
        columns.push(field);
    }
}

function quote(field, params) {
    var str = escapeFieldValue(field, params);
    var needsQuoting = false;

    if (params.quoting === 1) {
        needsQuoting = true;
    } else if (params.quoting === 2) {
        needsQuoting = typeof field !== 'number';
    } else if (params.quoting !== 3) {
        needsQuoting = str.indexOf(params.delimiter) !== -1 || str.indexOf(params.quotechar) !== -1 || str.indexOf('\n') !== -1;
    }

    return needsQuoting ? params.quotechar + str + params.quotechar : str;
}

function escapeFieldValue(field, params) {
    var str = '';
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
    return str;
}
