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

		socket.on("message", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitMessage(socket.username, args.message, Date.now());
                callback();
			}
		});

		socket.on("messageWithAttachment", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitMessageWithAttachment(socket.username, args.message, args.attachment, Date.now());
                callback();
			}
		});

		socket.on("privateMessage", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitPrivateMessage(socket.username, args.message, args.otherUsername, Date.now());
				callback();
			}
		});

		socket.on("privateMessageWithAttachment", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.emitPrivateMessageWithAttachment(socket.username, args.message, args.attachment, args.otherUsername, Date.now());
                callback();
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

SocketGateway.prototype.emitMessage = function (username, message, timestamp) {
	this.io.emit("message", username, message, timestamp);
};

SocketGateway.prototype.emitMessageWithAttachment = function (username, message, attachment, timestamp) {
	this.io.emit("messageWithAttachment", username, message, attachment, timestamp);
};

SocketGateway.prototype.emitPrivateMessage = function (username, message, otherUsername, timestamp) {
	const userSocket = this.app.users[otherUsername];
	if(userSocket) {
		userSocket.emit("privateMessage", username, message, timestamp);
	}
};

SocketGateway.prototype.emitPrivateMessageWithAttachment = function (username, message, attachment, otherUsername, timestamp) {
	const userSocket = this.app.users[otherUsername];
	if(userSocket) {
		userSocket.emit("privateMessageWithAttachment", username, message, attachment, timestamp);
	}
};

SocketGateway.prototype.isUserLoggedIn = function (socket) {
	return socket.username !== undefined;
};

SocketGateway.prototype.getMembersList = function () {
	return Object.keys(this.app.users);
};

module.exports = SocketGateway;