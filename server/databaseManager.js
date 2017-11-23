function DatabaseManager() {


}

DatabaseManager.prototype.doesUsernameExist = function (username, callback) {

	callback(false);
};

DatabaseManager.prototype.registerUser = function (registerData, callback) {
	callback();
};

module.exports = DatabaseManager;