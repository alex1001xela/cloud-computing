"use strict";

const path = require("path");
const fs = require("fs");

const homePath = path.join(__dirname, "..");
const clientPath = path.join(homePath, "client");
const uploadsPath = path.join("uploads", "/");
const saveUploadsPath = path.join(clientPath, uploadsPath, "/");
const temporaryProfilePicturePath = path.join("temppictures", "/");
const saveTemporaryProfilePicturePath = path.join(clientPath, temporaryProfilePicturePath, "/");

const allowedMimeTypes = ["image/jpeg", "audio/mpeg", "video/mp4"];

function FileManager() {
	this.deleteUploadsOlderThan(Date.now()); // on starting the server all old files are deleted
	this.deleteTempPicturesOlderThan(Date.now());

	if (!fs.existsSync(saveUploadsPath)){
		fs.mkdirSync(saveUploadsPath);
	}

	if (!fs.existsSync(saveTemporaryProfilePicturePath)){
		fs.mkdirSync(saveTemporaryProfilePicturePath);
	}

	if (!fs.existsSync(saveUploadsPath)){
		fs.mkdirSync(saveUploadsPath);
	}

}

/*
Saves a file uploaded from the user in the chat
 */
FileManager.prototype.saveUserUpload = function (file, callback) {

	const fileName = this.convertFileNameToTimestampAndRandomNumberFileName(file);

	this.saveFile(saveUploadsPath, fileName, file.fileBuffer, () => {
		callback(uploadsPath + fileName);
	});

};

/*
Saves an uploaded profile picture to the temppictures folder
 */
FileManager.prototype.saveTemporaryProfilePicture = function (file, callback) {

	const fileName = this.convertFileNameToTimestampAndRandomNumberFileName(file);

	this.saveFile(saveTemporaryProfilePicturePath, fileName, file.fileBuffer, () => {
		callback(temporaryProfilePicturePath + fileName);
	});
};

/*
Converts a file's name to a one easier to manage, with a timestamp and a random number
 */
FileManager.prototype.convertFileNameToTimestampAndRandomNumberFileName = function (file) {
	const splitFileName = file.name.split(".");
	const extension = splitFileName.pop();

	return Date.now() + "-" + (Math.floor(Math.random() * 1000)) + "." + extension;
};

FileManager.prototype.saveFile = function (folderPath, fileName, fileBuffer, callback) {
	fs.writeFile(folderPath + fileName, fileBuffer, 'utf8', (err) => {
		if(err) {
			console.error(err);
		}
		else{
			callback();
		}
	});
};

FileManager.prototype.isFileTypeAllowed = function (type) {
	return (allowedMimeTypes.indexOf(type) > -1);
};

FileManager.prototype.deleteUploadsOlderThan = function (timestamp) {
	this.deleteFilesOlderThan(saveUploadsPath, timestamp);
};

FileManager.prototype.deleteTempPicturesOlderThan = function (timestamp) {
	this.deleteFilesOlderThan(saveTemporaryProfilePicturePath, timestamp);
};

/*
Checks in the given folder for files older than the given timestamp and deletes them
 */
FileManager.prototype.deleteFilesOlderThan = function (folder, timestamp) {
	const dateTimestamp = new Date(timestamp);
	fs.readdir(folder, (err, files) => {

		if(err) {
			console.error(err);
		}
		else{
			files.forEach(file => {

				if(file !== ".gitignore") {
					let splitFilename = file.split("-");
					let fileTimestamp = splitFilename[0];
					const fileDate = new Date(parseInt(fileTimestamp));
					if (fileDate < dateTimestamp) {
						fs.unlinkSync(folder + file)
					}
				}
			});
		}
	});
};

FileManager.prototype.moveFile = function (originalPath, targetPath, callback) {
	fs.rename(originalPath, targetPath, function (err) {
		if (err) {
			console.error(err);
		}
		else {
			callback();
		}
	});

};

module.exports = FileManager;