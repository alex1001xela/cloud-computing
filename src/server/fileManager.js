"use strict";

const path = require("path");

const uploadsPath = path.join("uploads", "/");
const savePath = path.join("client", uploadsPath, "/");

function FileManager() {
	this.fs = require("fs");
}

FileManager.prototype.saveFile = function (file, callback) {

	const fileName = Date.now() + "-" + (Math.floor(Math.random() * 1000)) + this.fileExtensionFromType(file.type);

	this.fs.writeFile(savePath + fileName, file.fileBuffer, 'utf8', (err) => {
		if(err) {
			console.error(err);
		}
		else{
			callback(uploadsPath + fileName);
		}
	});
};

FileManager.prototype.fileExtensionFromType = function (type) {
	let extension = "";
	switch (type){
		case "image/jpeg":
			extension = ".jpg";
			break;
	}
	return extension
};

module.exports = FileManager;