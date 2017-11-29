export function LoginScreen(parent, socket){
    var loginScreen = {};
    var onLoginCallback, onPressedRegisterCallback;
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
    


    domElement.appendChild(usernameInputField);

	var passwordInputLabel = document.createElement("P");
	passwordInputLabel.textContent = "Please enter your password";
	passwordInputLabel.className = "text-label";



	domElement.appendChild(passwordInputLabel);

	var passwordInputField = document.createElement("INPUT");
	passwordInputField.className = "username-input-field";
	passwordInputField.type = "password";
	passwordInputField.autocomplete = "off";

	passwordInputField.onkeyup = function (event) {
		if(event.key === "Enter" && usernameInputField.value.length > 0){
			submitLoginData(usernameInputField.value, passwordInputField.value);
		}
	};

	domElement.appendChild(passwordInputField);


    var submitButton = document.createElement("BUTTON");
    submitButton.className = "submit-login-button";
    submitButton.textContent = "LOGIN";
    
    submitButton.onclick = function () {
        if(usernameInputField.value.length > 0){
            submitLoginData(usernameInputField.value, passwordInputField.value);
        }
    };
    domElement.appendChild(submitButton);

    var registerScreenLink = document.createElement("P");
    registerScreenLink.className = "paragraph register";
    registerScreenLink.textContent = "Not registered yet? Press here to register";

    registerScreenLink.onclick = function () {
        onPressedRegisterCallback();
    };

    domElement.appendChild(registerScreenLink);

    parent.appendChild(domElement);
    usernameInputField.focus();

    function submitLoginData (username, password) {

        if(isUsernameValid(username.trim()) && isPasswordValid(password.trim())){
			socket.emit("login", {
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
        return !username.includes(" ") && username.length > 0;
	}

	function isPasswordValid(password) {
		return !password.includes(" ") && password.length > 0;
	}

    loginScreen.onLogin = function(callback) {
        onLoginCallback = callback;
    };

    loginScreen.onPressedRegister = function (callback) {
        onPressedRegisterCallback = callback;
    };

    loginScreen.detach = function () {
        if(domElement.parentNode === parent) {
			parent.removeChild(domElement);
        }
    };

    return loginScreen;
}