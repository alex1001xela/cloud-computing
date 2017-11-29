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
    // TEST
    //this.registerUser('alpha','beta','user/alpha/profilepict.jpg');
    //this.doesUsernameExist('alpha');
    //this.areLoginDataValid('alpha','beta');
}

DatabaseManager.prototype.doesUsernameExist = function (username, callback) {

     db.get(username, function(err, data){
            if(!err) {
                console.log("Found document : " + JSON.stringify(data));
                return true;
            }
            else 
            {
                console.log("Document not found in database");
                return false;
            }
     });
};


DatabaseManager.prototype.registerUser = function (username, password, picturePath, callback) {
	
	

    if(this.doesUsernameExist(username)) {
        console.log('user : '+ username + 'already exist');
    }
    else
    {

        var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

        db.insert({
        "username": username,
        "_id": username,
        "password": hashPassword,
        "picturePath": picturePath
        });

        console.log('new user : '+ username);

    }
};


DatabaseManager.prototype.areLoginDataValid = function (username, password, callback) {

     db.get(username, function(err, data){
            if(!err) {
                if(bcrypt.compareSync(password, data.password)) {
                    console.log("login data valid..");
                    return true;     
                }
                else
                {
                    console.log("login data invalid..");
                    return false;
                }
            }
            else 
            {
                console.log("User not found in database");
                return false;
            }
     });
};

DatabaseManager.prototype.getDBCredentialsUrl = function (jsonData, callback) {
    var vcapServices = JSON.parse(jsonData);
    console.log(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
};

DatabaseManager.prototype.initDBConnection = function (callback) {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services

    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = this.getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = this.getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
    }

    console.log(dbCredentials.url);

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