#!/usr/bin/env node

'use strict';
var http = require("http");

// var commander = require("commander");

var childProcess = require('child_process');

var fs = require('fs');
var path = require("path");
var url = require("url");

for(var i=1, l=process.argv.length; i<l; i++) {
	if (/^-{0,2}\d+$/.test(process.argv[i])) {
		var argPort = process.argv[i].match(/\d+/)[0]
	}
}

var port = argPort || 8000 + Math.floor(Math.random()*1000);

//获取当前运行目录下的文件信息
fs.readdir(process.cwd(), function(err, files) {
	var list = files;
	list = files.filter(function(file) {
		return file.indexOf('.') !== 0;
	});
	// console.log(list.join(' ')); //控制台将所有文件名打印出来
});

var server = http.createServer(function(request, response) {
	console.log(request.method,request.url);

	var pathname = url.parse(request.url).pathname;

	var realPath = path.join(process.cwd(), pathname);

	if (!path.parse(request.url).ext) {
		// pathname = path.join(process.cwd(), "index.html");
		response.writeHead(302, {
			"Location": "index.html"
		});
		response.end();
		return;
	}

	fs.exists(realPath, function(exists) {
		if (!exists) {

			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});

			response.write("This request URL " + pathname + " was not found on this server.");

			response.end();

		} else {

			fs.readFile(realPath, "binary", function(err, file) {

				if (err) {

					response.writeHead(500, {
						'Content-Type': 'text/plain'
					});

					response.end(err);

				} else {

					response.writeHead(200, {
						'Content-Type': 'text/html'
					});

					response.write(file, "binary");

					response.end();

				}

			});
		}
	});
});

server.listen(port);

childProcess.exec('start http://localhost:' + port, function(error, stdout, stderr) {
	if (error !== null) {
		console.log('exec error: ' + error);
	}
});