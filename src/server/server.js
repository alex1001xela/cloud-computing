"use strict";

const http = require('http');

function initServer (port, app) {
	/**
	 * Get port from environment and store in Express.
	 */
	app.set('port', port);

	/**
	 * Create HTTP server.
	 */
	const server = http.createServer(app);

	/**
	 * Listen on provided port, on all network interfaces.
	 */
	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);

	/**
	 * Event listener for HTTP server "error" event.
	 */
	function onError(error) {
		console.error(error);
	}

	/**
	 * Event listener for HTTP server "listening" event.
	 */
	function onListening() {
		console.log("Listening on " + port);
	}

	return server;
}

module.exports = initServer;

