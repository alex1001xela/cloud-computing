export default function RegisterScreen(parent, socket) {
    var registerScreen = {};
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

    var registerScreenLink = document.createElement("DIV");
    registerScreenLink.className = "register-screen-link";
    registerScreenLink.textContent = "Not registered? Press this to register";

    registerScreenLink.onclick = function () {
        registerScreen.detach();
        new RegisterScreen(parent, socket);
    };

    domElement.appendChild(usernameInputField);

    var submitButton = document.createElement("BUTTON");
    submitButton.className = "submit-login-button";
    submitButton.textContent = "REGISTER";

    submitButton.onclick = function () {
        if(usernameInputField.value.length > 0){
            submitUsername(usernameInputField.value);
        }
    };
    domElement.appendChild(submitButton);

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

    function isUsernameValid(username) {
        return !username.includes(" ");
    }

    registerScreen.onLogin = function(callback) {
        onLoginCallback = callback;
    };

    registerScreen.detach = function () {
        parent.removeChild(domElement);
    };

    return registerScreen;
}