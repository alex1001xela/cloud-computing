"use strict";

const express = require("express");
const path = require("path");
const initServer = require("./server");
const SocketGateway = require("./socketGateway");
const FileManager = require("./fileManager");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const DatabaseManager = require("./databaseManager");
const PictureAnalyzer = require("./pictureAnalyzer");

require("dotenv").config({silent: true});

const port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;
const homePath = path.join(__dirname, "..");
const clientPath = path.join(homePath, "client");
const profilePicturesPath = path.join(clientPath, "profilepictures");
const tempPicturesPath = path.join(clientPath, "temppictures");

const maxNumberOfUsers = 100;

// Database Connection
var db;
var cloudant;
var dbCredentials = {
    dbName: 'cloudcomputingchat'
};

function App() {

	this.expressApp = express();
    this.expressApp.enable("trust proxy");

	/*this.expressApp.get("/", (req, res) => {
		res.sendFile(clientPath + "/index.html");
	});*/

    this.expressApp.use((req, res, next) => {

        if (req.secure || req.headers.host === "localhost:8080") { // allowing localhost without https

            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }

    });

	this.expressApp.use(express.static(clientPath));
	this.expressApp.use(bodyParser.json());

	this.io = socketIO(initServer(port, this.expressApp));
	this.users = {};
	this.fileManager = new FileManager();
	this.databaseManager = new DatabaseManager();
	this.pictureAnalyzer = new PictureAnalyzer();


	setInterval(() => {
		this.fileManager.deleteUploadsOlderThan(this.getOldestUserTimestamp());// purge some uploads every 30'
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
	else {
		this.users[username] = socket;
		loginSuccessful.status = true;
	}
	return loginSuccessful;
};

App.prototype.removeUser = function (username) {
	delete this.users[username];
};

/*
Of all the users currently online, it gets the timestamp of the one who logged in first
 */
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

App.prototype.doesUsernameExist = function (username, callback) {
	this.databaseManager.doesUsernameExist(username, callback);
};

App.prototype.registerUser = function (registerData, callback) {
	this.databaseManager.registerUser(registerData, callback);
};

/*
Saves the profile picture temporarily and checks with the IBM picture analyzer if a face is present
 */
App.prototype.isProfilePictureValid = function (pictureData, callback) {
	this.fileManager.saveTemporaryProfilePicture(pictureData, (picturePath) => {

		this.pictureAnalyzer.isFaceContainedInPicture(picturePath, (result) => {

			callback(result);

		});


	});

};

App.prototype.areLoginDataValid = function (loginData, callback) {
    this.databaseManager.areLoginDataValid(loginData, callback);
};

/*
Moves the profile picture from the temppictures folder to the profilepictures folder
 */
App.prototype.moveProfilePicture = function (picturePath, callback) {
	let arrayPicturePathParts = picturePath.split("/");
	let picture = arrayPicturePathParts[arrayPicturePathParts.length - 1];

	this.fileManager.moveFile(path.join(tempPicturesPath, picture), path.join(profilePicturesPath, picture), () => {
		callback(path.join("/", "profilepictures", picture));
	});
};

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
    }

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
    
    console.log('Database connection establish..');
}

new App();

initDBConnection();