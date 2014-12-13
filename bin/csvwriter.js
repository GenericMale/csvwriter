#!/usr/bin/env node

var csvwriter = require('../lib/csvwriter');
var pkg = require('../package.json');
var program = require('commander');
var fs = require('fs');

program
    .version(pkg.version)
    .usage('[options] [file] - with no file, or when file is -, read standard input')
    .option('-a, --array-delimiter <delimiter>', 'delimiting character for arrays of primitives (strings, booleans, numbers), set to empty string ("") to disable flatting out primitive arrays (,)', ',')
    .option('-c, --no-crlf', 'use line feed (\\n) instead of carriage return + line feed (\\r\\n) as line separator')
    .option('-d, --delimiter <delimiter>', 'delimiting character of the csv (,)', ',')
    .option('-D, --decimal-separator <separator>', 'the decimal mark to use for numbers (.)', '.')
    .option('-e, --encoding <encoding>', 'encoding used for the input and output (utf8)', 'utf8')
    .option('-f, --fields <fields>', 'specify a comma (,) separated list of fields to convert')
    .option('-H, --no-header-row', 'do not include a header row as first line')
    .option('-p, --path <path>', 'jsonpath to apply on the object')
    .option('-l, --linenumbers', 'insert a column of line numbers at the front of the output, useful when piping to grep or as a simple primary key')
    .option('-L, --suppress-line-breaks', 'remove line breaks (\\n) from field values')
    .option('-n, --nesting-delimiter <delimiter>', 'delimiter used for nested fields of the input (.)', '.')
    .option('-N, --max-depth <depth>', 'maximum depth of the json object, fields below max-depth will not be included in the csv, use -1 to include all fields, 0 will not include nested objects (-1)', Number, -1)
    .option('-o, --output <file>', 'write to file, use - to write to stdout (default)', '-')
    .option('-q, --quotechar <quotechar>', 'character used to quote strings in the csv (")', '"')
    .option('-Q, --no-doublequote', 'disable doublequoting to escape the quote character')
    .option('-t, --tabs', 'specifies that the csv is delimited with tabs, overrides -d')
    .option('-u, --quoting <0,1,2,3>', 'quoting style used in the csv: 0 = quote minimal (default), 1 = quote all, 2 = quote non-numeric, 3 = quote none', Number, 0)
    .option('-U, --no-utf-bom', 'do not write utf bom (0xFEFF or 0xEFBBBF) in file if encoding is set to utf')
    .option('-z, --zero', 'when interpreting or displaying column numbers, use zero-based numbering instead of the default 1-based numbering')
    .parse(process.argv);

if (program.args.length && program.args[0] !== '-') {
    var stream = fs.createReadStream(program.args[0], {encoding: program.encoding});
} else {
    stream = process.stdin;
}

var data = '';
stream.setEncoding(program.encoding);
stream.on('data', function (chunk) {
    data += chunk;
});
stream.on('end', function () {
    csvwriter(data, program, writeOut);
});

function writeOut(err, csv) {
    if (err) {
        console.error(err.stack || err.message || err);
        process.exit(1);
    }

    if (program.output !== '-') {
        if (program.utf && program.encoding.indexOf('utf') == 0) {
            csv = '\ufeff' + csv;
        }
        fs.writeFile(program.output, csv, {encoding: program.encoding}, function (err) {
            if (err) {
                console.error(err.message || err);
                process.exit(1);
            }
        });
    } else {
        process.stdout.write(csv);
    }
}
