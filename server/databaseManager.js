const bcrypt = require("bcrypt");

function DatabaseManager() {


}



DatabaseManager.prototype.doesUsernameExist = function (username, callback) {

	callback(false);
};

/*
* registerData = {
* 	"username": username,
*   "password": password,
*	"picturePath": ""
* }
* */

DatabaseManager.prototype.registerUser = function (username, password, picturePath, callback) {
	
	var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

	callback();
};

/*
*
* loginData = {
* 	"username": username,
*   "password": password
* }
*
*
* */
DatabaseManager.prototype.areLoginDataValid = function (loginData, callback) {
	callback({
		status: true,
		picturePath: ""
	});
};

module.exports = DatabaseManager;