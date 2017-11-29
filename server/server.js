"use strict";

const https = require("https");
const http = require("http");

function initServer (port, app, isOnline) {

	let server;
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

