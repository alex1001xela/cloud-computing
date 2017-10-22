"use strict";

const path = require("path");

const uploadsPath = path.join("uploads", "/");
const savePath = path.join("client", uploadsPath, "/");
const allowedMimeTypes = ["image/jpeg", "audio/mpeg"];

function FileManager() {
	this.fs = require("fs");
}

FileManager.prototype.saveFile = function (file, callback) {

	const splitFileName = file.name.split(".");
	const extension = splitFileName.pop();

	const fileName = Date.now() + "-" + (Math.floor(Math.random() * 1000)) + "." + extension;

	this.fs.writeFile(savePath + fileName, file.fileBuffer, 'utf8', (err) => {
		if(err) {
			console.error(err);
		}
		else{
			callback(uploadsPath + fileName);
		}
	});
};

FileManager.prototype.isFileTypeAllowed = function (type) {
	return (allowedMimeTypes.indexOf(type) > -1);
};

module.exports = FileManager;