const bcrypt = require("bcrypt");
const fs = require("fs");
// Database Connection
var db;
var cloudant;
var dbCredentials = {
    dbName: 'cloudcomputingchat'
};

function DatabaseManager() {
    this.initDBConnection();
}

/*
    Check if the username already exist on databases
*/
DatabaseManager.prototype.doesUsernameExist = function (username, callback) {
    
    db.get(username, function(err, data){
            if(!err) {
                console.log("Found document : " + JSON.stringify(data));
                callback({
                        "status": true
                });
            }
            else 
            {
                console.log("Document not found in database");
                callback({
                        "status": false
                });
            }
     });
};

/* 
    Save the user data to database
*/
DatabaseManager.prototype.registerUser = function (registerData, callback) {
	   
       var hashPassword = bcrypt.hashSync(registerData.password, bcrypt.genSaltSync(8), null);

        db.insert({
        "username": registerData.username,
        "_id": registerData.username,
        "password": hashPassword,
        "picturePath": registerData.picturePath
        });

        console.log('new user : '+ registerData.username);
        callback();
};

/*
    Check if the login data valid (username & password)
*/
DatabaseManager.prototype.areLoginDataValid = function (loginData, callback) {

     db.get(loginData.username, function(err, data){
            if(!err) {
                if(bcrypt.compareSync(loginData.password, data.password)) {
                    console.log("login data valid..");
                    callback({
                        "status": true,
                        "picturePath": data.picturePath
                    });
                }
                else
                {
                    console.log("password are incorect..");
                    callback({
						"status": false,
						"reason": "password are incorect"
                    });
                }
            }
            else 
            {
                console.log("User not found in database..");
                 callback({
                        "status": false,
                        "reason": "User not found in database"
                    });
            }
     });
};

/*
    Get the database credentials URLs
*/
DatabaseManager.prototype.getDBCredentialsUrl = function (jsonData, callback) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
};

/*
    Initiate the database connection
*/
DatabaseManager.prototype.initDBConnection = function (callback) {
  
    dbCredentials.url = this.getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);

    console.log('Database connection establish..');

};

module.exports = DatabaseManager;