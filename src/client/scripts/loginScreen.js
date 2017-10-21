function LoginScreen(parent){
    var loginScreen = {};
    var onLoginCallback;
    var domElement = document.createElement("DIV");
    domElement.className = "login-screen";
    var usernameInputField = document.createElement("INPUT");
    usernameInputField.className = "username-input-field";
    usernameInputField.onkeyup = function (event) {
        if(event.key === "Enter" && usernameInputField.value.length > 0){
            submitUsername(usernameInputField.value);
        }
    };
    domElement.appendChild(usernameInputField);

    var submitButton = document.createElement("BUTTON");
    submitButton.className = "submit-login-button";
    submitButton.textContent = "Submit";
    submitButton.onclick = function () {
        if(usernameInputField.value.length > 0){
            submitUsername(usernameInputField.value);
        }
    };
    domElement.appendChild(submitButton);

    parent.appendChild(domElement);
    usernameInputField.focus();

    function submitUsername (username) {
        socket.emit("login", username, function (loginSuccessful) {
            if(loginSuccessful){
                onLoginCallback();
            }
            else{
                alert("This username already exists!");
            }
        });
    }

    loginScreen.onLogin = function(callback) {
        onLoginCallback = callback;
    };

    loginScreen.detach = function () {
        parent.removeChild(domElement);
    };

    return loginScreen;
}