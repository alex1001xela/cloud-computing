const request = require("request");
const fs = require("fs");
const path = require("path");

function PictureAnalyzer() {

}

PictureAnalyzer.prototype.isFaceContainedInPicture = function (picturePath, callback) {

	const file = fs.createReadStream(path.join("client", picturePath));

	request.post({
		"url": "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key=ae8f4e9a3fc3cca545f26e7ac3cc9af560e067ed&version=2016-05-20",
		"formData": {
			"images_file": file
		}
	}, (err, res, body) => {
		if(err) {
			console.error(err);
		}
		else {

			const bodyJSON = JSON.parse(body);

			const image = bodyJSON.images[0];

			const reply = {
				"reason": "",
				"status": true,
				"path": picturePath
			};
			if(image.error) {
				console.error(image.error);
				reply.reason = image.error.description;
				reply.status = false;
			}
			else if (image.faces.length === 0){
				reply.reason = "Please insert a picture with a face!";
				reply.status = false;
			}

			callback(reply);
		}

	});
};
module.exports = PictureAnalyzer;