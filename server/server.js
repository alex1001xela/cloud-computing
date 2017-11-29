"use strict";

const http = require('http');

function initServer (port, app) {

	const server = http.createServer(app);
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

