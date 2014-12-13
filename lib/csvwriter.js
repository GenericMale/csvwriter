"use strict";

var jsonpath = require("JSONPath").eval;

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
    params.decimalSeparator = params.decimalSeparator || '.';
    params.arrayDelimiter = params.arrayDelimiter || ',';
    params.headerRow = params.headerRow !== false;
    params.nestingDelimiter = params.nestingDelimiter || '.';
    params.maxDepth = params.maxDepth || -1;
    params.quotechar = params.quotechar || '"';
    params.doublequote = params.doublequote !== false;
    params.quoting = params.quoting || 0;
    params.suppressLineBreaks = params.suppressLineBreaks || false;
    params.tabs = params.tabs || false;
    params.delimiter = params.tabs ? '\t' : (params.delimiter || ',');
    params.crlf = params.crlf !== false;
    params.path = params.path || null;
    params.fields = params.fields || null;
    params.linenumbers = params.linenumbers || false;
    params.zero = params.zero || false;

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
        ii = 0;

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

            if (rows[i].hasOwnProperty(columns[ii])) {
                csv += quote(rows[i][columns[ii]], params);
            } else {
                csv += quote('', params);
            }
        }

        csv += newline;
    }

    callback(null, csv);
}

module.exports = csvwriter;
