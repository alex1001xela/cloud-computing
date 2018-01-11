"use strict";

const https = require("https");
const http = require("http");
const constants = require("constants");

function initServer (port, app, isOnline) {
console.log("IS_ONLINE", isOnline);
	let server;

	app.secureProtocol = "SSLv23_method";
	app.secureOptions = constants.SSL_OP_NO_SSLv3;

	if(isOnline) {
		server = https.createServer(app);
	}
	else {
		server = http.createServer(app);
	}

	server.listen(port);

	server.on('error', (error) => {
		console.error(error);
	});

	server.on('listening', () => {
		console.log("Server listening on " + port);
	});

	return server;
}

module.exports = initServer;

