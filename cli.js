#!/usr/bin/env node

'use strict';

var program = require("commander");
var server = require("./server");

program
	.version(require("./package.json").version)
	.option('-port, --port [value]', 'Listen port')
	.option('-file, --file [value]', 'Server url')
	.parse(process.argv);


if (program.port) console.log(program.port);
if (program.file) console.log(program.file);


if (!program.port) {
	program.port = 8000 + Math.floor(Math.random() * 1000);
}

if (!program.file) {
	program.file = "index.html";
}

server.serve(program.port, function() {
	server.open(program.file);
});