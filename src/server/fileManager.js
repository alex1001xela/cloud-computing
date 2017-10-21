const path = require("path");

const uploadsPath = path.join("uploads", "/");
const savePath = path.join("client", uploadsPath, "/");

function FileManager() {
	this.fs = require("fs");
}

FileManager.prototype.saveFile = function (file, callback) {

	this.fs.writeFile(savePath + file.name, file.fileBuffer, 'utf8', (err) => {
		if(err) {
			console.error(err);
		}
		else{
			callback(uploadsPath + file.name);
		}
	});
};

module.exports = FileManager;