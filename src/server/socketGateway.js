"use strict";

function SocketGateway(app) {

	this.app = app;
	this.io = app.io;
	this.activateSocketListeners(app.io);
}

SocketGateway.prototype.activateSocketListeners = function (io){
	io.on("connection", (socket) => {

		socket.on("login", (username, callback) => {
			const loginSuccessful = this.app.addUser(username, socket);
			if (loginSuccessful) {
				socket.username = username;
				this.emitNewUser(username);
			}
			callback(loginSuccessful);
		});

		socket.on("disconnect", () => {
			if(this.isUserLoggedIn(socket)) {
				this.emitUserLeft(socket.username);
			}
		});

		socket.on("message", (message) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitMessage(socket.username, message);
			}
		});

		socket.on("messageWithAttachment", (message, attachment) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitMessageWithAttachment(socket.username, message, attachment);
			}
		});

		socket.on("privateMessage", (message, otherUsername) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitPrivateMessage(socket.username, message, otherUsername);
			}
		});

		socket.on("privateMessageWithAttachment", (message, attachment, otherUsername) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitPrivateMessageWithAttachment(socket.username, message, attachment, otherUsername);
			}
		});

		socket.on("getUsersList", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				callback(this.getMembersList());
			}
		});
	});
};

SocketGateway.prototype.emitNewUser = function (username) {
	this.io.emit("newUser", username);
};

SocketGateway.prototype.emitUserLeft = function (username) {
	this.app.removeUser(username);
	this.io.emit("userLeft", username);
};

SocketGateway.prototype.emitMessage = function (username, message) {
	this.io.emit("message", username, message);
};

SocketGateway.prototype.emitMessageWithAttachment = function (username, message, attachment) {
	this.io.emit("messageWithAttachment", username, message, attachment);
};

SocketGateway.prototype.emitPrivateMessage = function (username, message, otherUsername) {
	const userSocket = this.app.users[otherUsername];
	if(userSocket) {
		userSocket.emit("privateMessage", username, message);
	}
};

SocketGateway.prototype.emitPrivateMessageWithAttachment = function (username, message, attachment, otherUsername) {
	const userSocket = this.app.users[otherUsername];
	if(userSocket) {
		userSocket.emit("privateMessageWithAttachment", username, message, attachment);
	}
};

SocketGateway.prototype.isUserLoggedIn = function (socket) {
	return socket.username !== undefined;
};

SocketGateway.prototype.getMembersList = function () {
	return Object.keys(this.app.users);
};

module.exports = SocketGateway;