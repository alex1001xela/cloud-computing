import LoginScreen from "./loginScreen";

export default function RegisterScreen(parent, socket) {
    var registerScreen = {};
    var onPressedLoginCallback, onLoginCallback;
    var domElement = document.createElement("DIV");
    domElement.className = "register-screen";

    var logo = document.createElement("IMG");
    logo.setAttribute("src","resources/logo.jpg");
    logo.setAttribute("width", "436");
    logo.setAttribute("height", "116");
    domElement.appendChild(logo);
    logo.className = "logo";

    var paragraph = document.createElement("P");
    paragraph.textContent = "Please enter your name!";
    paragraph.className = "paragraph";
    domElement.appendChild(paragraph);

    var usernameInputField = document.createElement("INPUT");
    usernameInputField.className = "username-input-field";

    usernameInputField.onkeyup = function (event) {
        if(event.key === "Enter" && usernameInputField.value.length > 0){
            submitUsername(usernameInputField.value);
        }
    };

    domElement.appendChild(usernameInputField);

    var passwordInputField = document.createElement("INPUT");
    passwordInputField.type = "password";

    domElement.appendChild(passwordInputField);

    var confirmPasswordInputField = document.createElement("INPUT");
    confirmPasswordInputField.type = "password";

    domElement.appendChild(confirmPasswordInputField);

    var submitButton = document.createElement("BUTTON");
    submitButton.className = "submit-login-button";
    submitButton.textContent = "REGISTER";

    submitButton.onclick = function () {
        if(usernameInputField.value.length > 0){
            if(matchPasswordToConfirmation(passwordInputField.value, confirmPasswordInputField.value)){
                submitRegisterData(usernameInputField.value, passwordInputField.value);
            }
        }
    };
    domElement.appendChild(submitButton);

    var loginScreenLink = document.createElement("DIV");
    loginScreenLink.className = "login-register-screen-link";
    loginScreenLink.textContent = "Already registered? Press this to log in";

    loginScreenLink.onclick = function () {
       onPressedLoginCallback();
    };

    domElement.appendChild(loginScreenLink);

    parent.appendChild(domElement);
    usernameInputField.focus();

    function submitUsername (username) {

        if(isUsernameValid(username.trim())){
            socket.emit("login", username, function (loginSuccessful) {
                if(loginSuccessful.status){
                    onLoginCallback();
                }
                else{
                    alert(loginSuccessful.reason);
                }
            });
        }
        else{
            alert("Please enter a username without an empty space.");
        }

    }

    function matchPasswordToConfirmation(password, confirmationPassword) {
        return password === confirmationPassword;
    }

    function submitRegisterData(username, password) {
        if(isUsernameValid(username.trim())){
            socket.emit("register", {
                "username": username,
                "password": password
            }, function (loginSuccessful) {
                if(loginSuccessful.status){
                    onLoginCallback();
                }
                else{
                    alert(loginSuccessful.reason);
                }
            });
        }
        else{
            alert("Please enter a username without an empty space.");
        }
    }

    function isUsernameValid(username) {
        return !username.includes(" ");
    }

    registerScreen.onLogin = function(callback) {
        onLoginCallback = callback;
    };

    registerScreen.onPressedLogin = function (callback) {
        onPressedLoginCallback = callback;
    };

    registerScreen.detach = function () {
        parent.removeChild(domElement);
    };

    return registerScreen;
}