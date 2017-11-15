const path = require("path");

module.exports = {
	entry: "./client/scripts/chat.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "client", "dist")
	}
};
