"use strict";

const express = require("express");
const path = require("path");
const initServer = require("./server");
const SocketGateway = require("./socketGateway");
const FileManager = require("./fileManager");

const port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;
const homePath = path.join(__dirname, "..");
const clientPath = path.join(homePath, "client");

const maxNumberOfUsers = 100;

function App() {

	this.expressApp = express();

	/*this.expressApp.get("/", (req, res) => {
		res.sendFile(clientPath + "/index.html");
	});*/

	this.expressApp.use(express.static(clientPath));
	this.io = require('socket.io')(initServer(port, this.expressApp));
	this.users = {};
	this.fileManager = new FileManager();

	setInterval(() => {
		this.fileManager.deleteFilesOlderThan(this.getOldestUserTimestamp());
	}, 30 * 60 * 1000);

	new SocketGateway(this);
}

App.prototype.addUser = function(username, socket) {

	let loginSuccessful = {
		status: false,
		reason: ""
	};

	if(Object.keys(this.users).length === maxNumberOfUsers){
		loginSuccessful.reason = "The server is full";
	}
	else if(username in this.users){
		loginSuccessful.reason = "This username already exists!";
	}
	else {
		this.users[username] = socket;
		loginSuccessful.status = true;
	}
	return loginSuccessful;
};

App.prototype.removeUser = function (username) {
	delete this.users[username];
};

App.prototype.getOldestUserTimestamp = function () {
	let oldestTimestamp = Date.now();
	for(let key in this.users){
		if(this.users.hasOwnProperty(key)){
			let userSocket = this.users[key];
			let userTimestamp = userSocket.handshake.issued;
			if(oldestTimestamp === undefined || userTimestamp < oldestTimestamp){
				oldestTimestamp = userTimestamp;
			}
		}
	}
	return oldestTimestamp;
};


new App();