'use strict';

var http = require("http");
var mime = require("mime");
var childProcess = require('child_process');

var fs = require('fs');
var path = require("path");
var url = require("url");

var isRun = false;
var host = "http://localhost";
var port = 80;

var server = http.createServer(function(request, response) {

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
						'Content-Type': mime.lookup(path.parse(request.url).ext) || "text/plain"
					});

					response.write(file, "binary");

					response.end();

				}

			});
		}
	});
});



//获取当前运行目录下的文件信息
server.pwd = function() {
	fs.readdir(process.cwd(), function(err, files) {
		return files.filter(function(file) {
			return file.indexOf('.') !== 0;
		});
		// console.log(list.join(' ')); //控制台将所有文件名打印出来
	});
};

server.serve = function(portnum, callback) {
	port = portnum || port;
	server.listen(port, function(err) {
		if (err) {
			console.log(err);
			return;
		}
		isRun = true;
		callback && callback();
		console.log("server is running at port " + port);
	});
}


function openBrowser(filename) {
	var file = filename || "";
	childProcess.exec('start ' + host + ':' + port + '/' + filename, function(error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
}
server.open = function(filename) {
	if (!isRun) {
		console.log("Please start a server first!");
		return;
	}
	openBrowser(filename);
};

module.exports = server;