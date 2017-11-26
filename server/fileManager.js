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
	this.deleteFilesOlderThan(Date.now());
}

FileManager.prototype.saveUserUpload = function (file, callback) {

	const splitFileName = file.name.split(".");
	const extension = splitFileName.pop();

	const fileName = Date.now() + "-" + (Math.floor(Math.random() * 1000)) + "." + extension;
	this.saveFile(saveUploadsPath, fileName, file.fileBuffer, () => {
		callback(uploadsPath + fileName);
	});

};

FileManager.prototype.saveTemporaryProfilePicture = function (file, callback) {

	const splitFileName = file.name.split(".");
	const extension = splitFileName.pop();

	const fileName = Date.now() + "-" + (Math.floor(Math.random() * 1000)) + "." + extension;

	this.saveFile(saveTemporaryProfilePicturePath, fileName, file.fileBuffer, () => {
		callback(temporaryProfilePicturePath + fileName);
	});
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

FileManager.prototype.deleteFilesOlderThan = function (timestamp) {
	const dateTimestamp = new Date(timestamp);
	fs.readdir(saveUploadsPath, (err, files) => {

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
						fs.unlinkSync(saveUploadsPath + file)
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