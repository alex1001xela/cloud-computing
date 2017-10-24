function LoginScreen(parent){
    var loginScreen = {};
    var onLoginCallback;
    var domElement = document.createElement("DIV");
    domElement.className = "login-screen";
    
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

    var submitButton = document.createElement("BUTTON");
    submitButton.className = "submit-login-button";
    submitButton.textContent = "SUBMIT";
    
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
            if(loginSuccessful.status){
                onLoginCallback();
            }
            else{
                alert(loginSuccessful.reason);
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