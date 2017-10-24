"use strict";

const express = require("express");
const path = require("path");
const initServer = require("./server");
const SocketGateway = require("./SocketGateway");

const port = "3001";
const homePath = path.join(__dirname, "..");
const clientPath = path.join(homePath, "client");

const maxNumberOfUsers = 100;

function App() {

	this.expressApp = express();

	this.expressApp.get("/", (req, res) => {
		res.sendFile(clientPath + "/index.html");
	});

	this.expressApp.use(express.static(clientPath));
	this.io = require('socket.io')(initServer(port, this.expressApp));
	this.users = {};

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


new App();