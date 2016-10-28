# csvwriter

[![NPM Package](https://badge.fury.io/js/csvwriter.svg)](https://www.npmjs.com/package/csvwriter)
[![Dependencies](https://gemnasium.com/GazonkFoo/csvwriter.svg)](https://gemnasium.com/GazonkFoo/csvwriter)
[![Build](https://api.travis-ci.org/GazonkFoo/csvwriter.svg)](https://travis-ci.org/GazonkFoo/csvwriter)
[![Coverage](https://img.shields.io/coveralls/GazonkFoo/csvwriter.svg)](https://coveralls.io/r/GazonkFoo/csvwriter)
[![Codacy](https://www.codacy.com/project/badge/ae25ffe3a4ff4d52a6d89884b8bc1796)](https://www.codacy.com/public/gazonkdev/csvwriter)
[![Code Climate](https://codeclimate.com/github/GazonkFoo/csvwriter/badges/gpa.svg)](https://codeclimate.com/github/GazonkFoo/csvwriter)

Convert any JSON string to CSV with support for nested objects, filtering, many different CSV variations, CLI, ...

There are already a lot of good json to csv modules in the wild and this one aggregates all the features of the other modules and adds many, many more.

[csvkit](https://github.com/onyxfish/csvkit) [json2csv](https://github.com/zemirco/json2csv) [commander](https://github.com/tj/commander.js) [JSONPath](https://github.com/s3u/JSONPath) [cli-table](https://github.com/Automattic/cli-table)


## Install

    npm install csvwriter


## Usage

### API

```js
var csvwriter = require('csvwriter');
var data = {
 "name": "csvwriter",
 "repository": {
   "type": "git",
   "url": "https://github.com/GazonkFoo/csvwriter"
 }
};
csvwriter(data, function(err, csv) {
  console.log(csv);
});
```

With configuration parameters:

```js
var csvwriter = require('csvwriter');
var data = [/*...*/];
csvwriter(data, {delimiter: ';', decimalSeparator: ','}, function(err, csv) {
    console.log(csv);
});
```


### Command Line Interface

Read from stdin and write to stdout:

```bash
$ echo '{"name": "csvwriter", "repository": {"type": "git", "url": "https://github.com"}}' | csvwriter
```

Using files:

```bash
$ csvwriter -o converted.csv source.json
```


## Features

- Command Line Interface and API
- Handles complex objects and arrays with different schemas
- Filtering and traversing using [JSONPath](http://goessner.net/articles/JsonPath/)
- Automatic and fixed column list
- Optional header row
- Escape quoting characters with double quotes (can be disabled)
- Strip line breaks in field values or quote them properly
- Optionally add column with line numbers to CSV
- Configurable value for empty entries (e.g. N/A)
- Read from file or stdin (CLI)
- Write to file or stdout (CLI)
- Can include UTF BOM in output file (CLI)
- Create a pretty printed table on the console
- Many CSV variations with configurable:
    - Column delimiter
    - Decimal separator for numbers
    - Quoting character
    - Quoting mode (always, never, everything but numbers, only when needed)
    - Escape character if quoting is disabled
    - Array delimiter for arrays of primitives (strings, numbers, booleans)
    - Nesting delimiter for complex objects
    - Newline character to end rows (CRLF or LF)
- Good test coverage


## Command Line Interface

```bash
Usage: csvwriter [options] [file] - with no file, or when file is -, read standard input

  Options:

    -h, --help                           output usage information
    -V, --version                        output the version number
    -a, --array-delimiter <delimiter>    delimiting character for arrays of primitives (strings, booleans, numbers), set to empty string ("") to disable flatting out primitive arrays (,)
    -c, --no-crlf                        use line feed (\n) instead of carriage return + line feed (\r\n) as line separator
    -d, --delimiter <delimiter>          delimiting character of the csv (,)
    -D, --decimal-separator <separator>  the decimal mark to use for numbers (.)
    -e, --encoding <encoding>            encoding used for the input and output (utf8)
    -E, --escape <escape>                character used to escape the delimiter, newlines and the escape character itself if quoting is disabled
    -f, --fields <fields>                specify a comma (,) separated list of fields to convert
    -H, --no-header                      do not include a header row as first line
    -p, --path <path>                    jsonpath to apply on the object
    -l, --line-numbers                   insert a column of line numbers at the front of the output, useful when piping to grep or as a simple primary key
    -L, --suppress-line-breaks           remove line breaks (\n) from field values
    -n, --nesting-delimiter <delimiter>  delimiter used for nested fields of the input (.)
    -N, --max-depth <depth>              maximum depth of the json object, fields below max-depth will not be included in the csv, use -1 to include all fields, 0 will not include nested objects (-1)
    -o, --output <file>                  write to file, use - to write to stdout (default)
    -q, --quote <quote>                  character used to quote strings in the csv (")
    -Q, --no-double-quote                disable inserting another quote to escape the quote character
    -s, --null-string <string>           string to use for writing null or undefined values
    -t, --tabs                           specifies that the csv is delimited with tabs, overrides -d
    -T, --table                          create a neat looking table for the console
    -C, --header-color <color>           color of the table header, one of: black, red, green, yellow, blue, magenta, cyan, white, gray (red)
    -u, --quote-mode <0,1,2,3>           quoting style used in the csv: 0 = quote minimal (default), 1 = quote all, 2 = quote non-numeric, 3 = quote none
    -U, --no-utf-bom                     do not write utf bom (0xFEFF or 0xEFBBBF) in file if encoding is set to utf
    -z, --zero                           when interpreting or displaying column numbers, use zero-based numbering instead of the default 1-based numbering
```


## Examples

For ease of demonstration the examples use the command line interface but all the configuration options except those related to files are also available on the API.

### JSONPath & Column List

Find some of the other json to csv converters on github and create a neat csv of the result:

```bash
curl https://api.github.com/search/repositories?q=json+csv|csvwriter -p "$.items[*]" -f "name,description,homepage,language,owner.login"
```

This uses the [JSONPath](http://goessner.net/articles/JsonPath/) "$.items[*]" to only list the items array of the result and uses a fixed list of columns.

The resulting CSV looks like this:

```
name,description,homepage,language,owner.login
json,"A free, in-browser JSON to CSV converter.",http://konklone.io/json/,JavaScript,konklone
json2csv,command line tool to convert json to csv,http://github.com/jehiah/json2csv,Go,jehiah
json2csv,Convert json to csv with column titles,,JavaScript,zemirco
csv-to-json,CSV to JSON,http://www.cparker15.com/code/utilities/csv-to-json/,JavaScript,cparker15
csv2json,A gem useful for converting CSV files to JSON from command-line,,Ruby,darwin
JSON2CSV,A simple PHP script to convert JSON data to CSV,,PHP,danmandle
json2csv,Converts JSON files to CSV (pulling data from nested structures). Useful for Mongo data,,Python,evidens
to_csv,"This Rails plugin gives you the ability to call to_csv to a collection of activerecords. The builder options are the same as to_json / to_xml, except for the :include.",http://www.arydjmal.com/blog/to_csv-plugin-better-excel-compatibility,Ruby,arydjmal
ServiceStack.Text,".NET's fastest JSON, JSV and CSV Text Serializers ",https://servicestack.net/text,C#,ServiceStack
```

The column order is the same as passed to the command.

By default the minimal quoting is used. Only fields containing the column delimiter, quoting character or newlines are quoted.

Also note the sub-field "login" of the "owner" field which is mapped as "owner.login".

### Input/Output File, Arrays, Quotes and Newlines

Let's consider the following JSON (stored in a file named in.json):

```js
[
  {
    "description": "Show of some array handling",
    "tags": ["example", "arrays", "json"],
    "meta": [
      {
        "type": "number",
        "value": 12.34
      },
      {
        "type": "boolean",
        "value": false
      }
    ]
  },
  {
    "description": "Just for \"demo\"",
    "tags": ["foo", "bar", "baz"],
    "meta": [
      {
        "type": "array",
        "value": ["another", "array"]
      },
      {
        "type": "wrong field?",
        "wrong": "Where am i?"
      },
      {
        "type": "newline",
        "value": "Think\ni'm Lost!"
      }
    ]
  }
]
```

Some funny stuff in there so let's convert this to CSV:

```bash
csvwriter -o out.csv in.json
```

So what do we get (content of out.csv):

```
description,tags,meta.0.type,meta.0.value,meta.1.type,meta.1.value,meta.1.wrong,meta.2.type,meta.2.value
Show of some array handling,"example,arrays,json",number,12.34,boolean,false,,,
"Just for ""demo""","foo,bar,baz",array,"another,array",wrong field,,Where am i?,newline,"Think
i'm Lost!"
```

This time all the fields of the input are included automatically.

The interesting part is the handling of arrays.
The array of the primitive strings "example", "arrays", "json" has been flattened out to "example,arrays,json".
But the array of complex objects in meta is converted by using the index in the column header (meta.0, meta.1, meta.2).

Also note the automatic escaping of the quoting character ("demo" becomes ""demo"") and by default new lines are preserved.

The entire behaviour regarding arrays, quoting, newlines can be configured as well as all the delimiters used.
The defaults are chosen to meet the requirements of common spreadsheet applications (Libre/Open Office, MS Office, ...)

### Formatted Table & Line Numbers

Finally a bit of eye candy on the console (Table with Line Numbers):

![Screenshot](http://i.imgur.com/8QNmP6Z.png)


# API Reference

## Functions

<dl>
<dt><a href="#csvwriter">csvwriter(data, [params], callback)</a></dt>
<dd><p>Convert any JSON string to CSV with support for nested objects, filtering, many different CSV variations, CLI, ...</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#csvParameters">csvParameters</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#csvCallback">csvCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="csvwriter"></a>

## csvwriter(data, [params], callback)
Convert any JSON string to CSV with support for nested objects, filtering, many different CSV variations, CLI, ...

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> &#124; <code>object</code> | The source json data which should be converted. Can be a string or a javascript object. |
| [params] | <code>[csvParameters](#csvParameters)</code> | Configuration of the CSV generation. |
| callback | <code>[csvCallback](#csvCallback)</code> | Callback to handle the generated CSV string. |

<a name="csvParameters"></a>

## csvParameters : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| arrayDelimiter | <code>string</code> | delimiting character for arrays of primitives (strings, booleans, numbers), set to empty string ("") to disable flatting out primitive arrays (,) |
| crlf | <code>boolean</code> | use line feed (\n) or carriage return + line feed (\r\n) as line separator (true) |
| delimiter | <code>string</code> | delimiting character of the csv (,) |
| decimalSeparator | <code>string</code> | the decimal mark to use for numbers (.) |
| encoding | <code>string</code> | encoding used for the input and output (utf8) |
| escape | <code>string</code> | character used to escape the delimiter, newlines and the escape character itself if quoting is disabled |
| fields | <code>string</code> | specify a comma (,) separated list of fields to convert |
| header | <code>boolean</code> | include a header as first line (true) |
| path | <code>string</code> | jsonpath to apply on the object |
| lineNumbers | <code>boolean</code> | insert a column of line numbers at the front of the output, useful when piping to grep or as a simple primary key (false) |
| suppressLineBreaks | <code>boolean</code> | remove line breaks (\n) from field values (false) |
| nestingDelimiter | <code>string</code> | delimiter used for nested fields of the input (.) |
| maxDepth | <code>number</code> | maximum depth of the json object, fields below max-depth will not be included in the csv, use -1 (default) to include all fields, 0 will not include nested objects |
| output | <code>string</code> | write to file, use - to write to stdout (default) |
| quote | <code>string</code> | character used to quote strings in the csv (") |
| doubleQuote | <code>boolean</code> | insert another quote to escape the quote character (true) |
| nullString | <code>string</code> | string to use for writing null or undefined values |
| table | <code>boolean</code> | create a neat looking table for the console (false) |
| headerColor | <code>string</code> | color of the table header, one of: black, red, green, yellow, blue, magenta, cyan, white, gray (red) |
| quoteMode | <code>number</code> | quoting style used in the csv: 0 = quote minimal (default), 1 = quote all, 2 = quote non-numeric, 3 = quote none |
| utfBom | <code>boolean</code> | write utf bom (0xFEFF or 0xEFBBBF) in file if encoding is set to utf (true) |
| zero | <code>boolean</code> | when interpreting or displaying column numbers, use zero-based numbering instead of the default 1-based numbering (false) |

<a name="csvCallback"></a>

## csvCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>error</code> | Error object or null if no error occurred. |
| csv | <code>string</code> | The generated CSV as string. |


# License

The MIT License (MIT)

Copyright (c) 2016 Sebastian Maurer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
