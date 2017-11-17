"use strict";

const MoodAnalyzer = require("./moodAnalyzer");

function SocketGateway(app) {

	this.app = app;
	this.io = app.io;
	this.fileManager = app.fileManager;

	this.moodAnalyzer = new MoodAnalyzer();
	this.moodAnalyzer.onNewMood(() => {
		this.io.emit("newMood", this.moodAnalyzer.getMoodLevel());
	});

	this.activateSocketListeners(app.io);

}

SocketGateway.prototype.activateSocketListeners = function (io){
	io.on("connection", (socket) => {

        socket.on("register", (registerData, callback) => {

            let loginSuccessful = {
                status: true,
                reason: ""
            };

            if (loginSuccessful.status) {
                socket.username = registerData.username;
                this.emitNewUser(registerData.username);
            }
            callback(loginSuccessful);
        });

		socket.on("login", (loginData, callback) => {
			console.log(loginData);
			const loginStatus = this.app.addUser(loginData.username, socket);
			if (loginStatus.status) {
				socket.username = loginData.username;
				this.emitNewUser(loginData.username);
			}
			callback(loginStatus);
		});

		socket.on("disconnect", () => {
			if(this.isUserLoggedIn(socket)) {
				this.emitUserLeft(socket.username);
			}
		});

		socket.on("message", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.moodAnalyzer.analyzeMessage(args.message);
				this.emitMessage(socket.username, args.message, Date.now());
                callback();
			}
		});

		socket.on("messageWithAttachment", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.moodAnalyzer.analyzeMessage(args.message);
				this.emitMessageWithAttachment(socket.username, args.message, args.attachment, Date.now());
                callback();
			}
		});

		socket.on("privateMessage", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.moodAnalyzer.analyzeMessage(args.message);
				this.emitPrivateMessage(socket, args.message, args.otherUsername, Date.now());
				callback();
			}
		});

		socket.on("privateMessageWithAttachment", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				this.moodAnalyzer.analyzeMessage(args.message);
				this.emitPrivateMessageWithAttachment(socket, args.message, args.attachment, args.otherUsername, Date.now());
                callback();
			}
		});

		socket.on("getUsersList", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				callback(this.getMembersList());
			}
		});

		socket.on("getUsersCount", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				callback(this.getMembersList().length);
			}
		});

		socket.on("getMoodLevel", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				callback(this.moodAnalyzer.getMoodLevel());
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
	if(this.fileManager.isFileTypeAllowed(attachment.type)){
		this.fileManager.saveFile(attachment, (attachmentURL) => {
			this.io.emit("messageWithAttachment", username, message, attachmentURL, timestamp);
		});
	}
};

SocketGateway.prototype.emitPrivateMessage = function (userSocket, message, otherUsername, timestamp) {
	const otherUserSocket = this.app.users[otherUsername];
	if(otherUserSocket) {
		userSocket.emit("privateMessage", userSocket.username, message, timestamp);
		otherUserSocket.emit("privateMessage", userSocket.username, message, timestamp);
	}
};

SocketGateway.prototype.emitPrivateMessageWithAttachment = function (userSocket, message, attachment, otherUsername, timestamp) {
	const otherUserSocket = this.app.users[otherUsername];
	if(otherUserSocket && this.fileManager.isFileTypeAllowed(attachment.type)) {
		this.fileManager.saveFile(attachment, (attachmentURL) => {
			userSocket.emit("privateMessageWithAttachment", userSocket.username, message, attachmentURL, timestamp);
			otherUserSocket.emit("privateMessageWithAttachment", userSocket.username, message, attachmentURL, timestamp);
		});
	}
};

SocketGateway.prototype.isUserLoggedIn = function (socket) {
	return socket.username !== undefined;
};

SocketGateway.prototype.getMembersList = function () {
	return Object.keys(this.app.users);
};

module.exports = SocketGateway;