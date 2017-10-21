"use strict";

const express = require("express");
const path = require("path");
const initServer = require("./server");
const SocketGateway = require("./SocketGateway");

const port = "3001";
const homePath = path.join(__dirname, "..");
const clientPath = path.join(homePath, "client");


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
	let loginSuccessful = false;
	if(!(username in this.users)){
		this.users[username] = socket;
		loginSuccessful = true;
	}
	else{
		loginSuccessful = false;
	}
	return loginSuccessful;
};

App.prototype.removeUser = function (username) {
	delete this.users[username];
};


new App();