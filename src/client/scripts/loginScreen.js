function LoginScreen(parent){
    var loginScreen = {};

    var domElement = document.createElement("DIV");
    var usernameInputField = document.createElement("INPUT");
    var submitButton = document.createElement("BUTTON");
    var onLoginCallback;

    parent.appendChild(domElement);


    submitButton.onclick = function () {
        submitUsername();
    };


    loginScreen.submitUsername = function(username) {
        socket.emit("login", username, function (loginSuccessful) {
            if(loginSuccessful){
                onLoginCallback();
            }
            else{

            }
        });
    };

    loginScreen.onLogin = function(callback) {
        onLoginCallback = callback;
    };

    return loginScreen;
}