"use strict";

const MoodAnalyzer = require("./moodAnalyzer");
const redisOptions = {
	host: "redis-13166.c10.us-east-1-2.ec2.cloud.redislabs.com",
	password: "6tY6qGh49h4E2OAhugA",
	port: 13166,
	no_ready_check: true
};
function SocketGateway(app) {
	const redis = require('socket.io-redis');

	this.app = app;
	this.io = app.io;
	this.io.adapter(redis(redisOptions));
	this.fileManager = app.fileManager;

	this.moodAnalyzer = new MoodAnalyzer();
	this.moodAnalyzer.onNewMood(() => {
		this.io.emit("newMood", this.moodAnalyzer.getMoodLevel());
	});

	this.activateSocketListeners(app.io);
}

SocketGateway.prototype.activateSocketListeners = function (io){
	io.on("connection", (socket) => {

		io.of('/').adapter.customHook = (data, callback) => {
			const eventName = data.eventName;
			switch (eventName) {
				case "getUsersList":
					callback(this.getMembersList());
					break;
			}
		};

        socket.on("register", (registerData, callback) => {

            let loginSuccessful = {
                status: true,
                reason: ""
            };

			this.app.doesUsernameExist(registerData.username, (status) => {

				if(!status) {
					loginSuccessful.status = false;
					loginSuccessful.reason = "This username already exists!";
					callback(loginSuccessful);
				}
				else{

					this.app.moveProfilePicture(registerData.picturePath, (newPicturePath) => {

						registerData.picturePath = newPicturePath;
						this.app.registerUser(registerData, () => {
							socket.username = registerData.username;
							this.app.addUser(registerData.username, socket);

							this.emitNewUser(registerData.username);
							callback(loginSuccessful);
						});
					});
				}
			});

        });

        socket.on("profilePictureUpload", (pictureData, callback) => {
			this.app.isProfilePictureValid(pictureData, callback);
		});

		socket.on("login", (loginData, callback) => {

		    this.app.areLoginDataValid(loginData, (loginStatus) => {

                if (loginStatus.status) {

					this.app.addUser(loginData.username, socket);
                	loginStatus.username = loginData.username;
                    socket.username = loginData.username;
                    this.emitNewUser(loginStatus);
                }
                callback(loginStatus);
            });
		});

		socket.on("disconnect", () => {
			if(this.isUserLoggedIn(socket)) {
				this.emitUserLeft(socket.username);
				this.app.removeUser(socket.username);
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
				io.of('/').adapter.customRequest({
					eventName: "getUsersList"
				}, function(err, replies){
					let finalReply = [];
					replies.forEach((reply) => {
						if(reply.length > 0) {
							finalReply = finalReply.concat(reply);	
						}
					});
					callback(finalReply);
				});
			}
		});

		socket.on("getMoodLevel", (args, callback) => {
			if(this.isUserLoggedIn(socket)) {
				callback(this.moodAnalyzer.getMoodLevel());
			}
		});
	});
};

SocketGateway.prototype.emitNewUser = function (loginStatus) {
	this.io.emit("newUser", loginStatus);
};

SocketGateway.prototype.emitUserLeft = function (username) {
	this.io.emit("userLeft", username);
};

SocketGateway.prototype.emitMessage = function (username, message, timestamp) {
	this.io.emit("message", username, message, timestamp);
};

SocketGateway.prototype.emitMessageWithAttachment = function (username, message, attachment, timestamp) {
	if(this.fileManager.isFileTypeAllowed(attachment.type)){
		this.fileManager.saveUserUpload(attachment, (attachmentURL) => {
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
		this.fileManager.saveUserUpload(attachment, (attachmentURL) => {
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