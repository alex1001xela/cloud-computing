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

    var registerFieldsContainer = document.createElement("DIV");
    registerFieldsContainer.className = "register-fields-container";


    var profilePictureContainer = document.createElement("DIV");
    profilePictureContainer.className = "profile-picture-container";

    var profilePicture = document.createElement("IMG");
    profilePicture.className = "profile-picture-register";
	profilePictureContainer.appendChild(profilePicture);

	createUploadPictureButton();

	registerFieldsContainer.appendChild(profilePictureContainer);

    var usernameInputLabel = document.createElement("P");
    usernameInputLabel.textContent = "Please enter your name!";
    usernameInputLabel.className = "text-label";
	registerFieldsContainer.appendChild(usernameInputLabel);

    var usernameInputField = document.createElement("INPUT");
    usernameInputField.className = "username-input-field";

    usernameInputField.onkeyup = function (event) {
        if(event.key === "Enter" && usernameInputField.value.length > 0){
            submitUsername(usernameInputField.value);
        }
    };

	registerFieldsContainer.appendChild(usernameInputField);

    var passwordInputLabel = document.createElement("P");
    passwordInputLabel.textContent = "Please enter your password";
    passwordInputLabel.className = "text-label";

	registerFieldsContainer.appendChild(passwordInputLabel);

    var passwordInputField = document.createElement("INPUT");
    passwordInputField.className = "username-input-field";
    passwordInputField.type = "password";

	registerFieldsContainer.appendChild(passwordInputField);

	var confirmPasswordInputLabel = document.createElement("P");
	confirmPasswordInputLabel.textContent = "Please confirm your password";
	confirmPasswordInputLabel.className = "text-label";

	registerFieldsContainer.appendChild(confirmPasswordInputLabel);

    var confirmPasswordInputField = document.createElement("INPUT");
	confirmPasswordInputField.className = "username-input-field";
    confirmPasswordInputField.type = "password";

	registerFieldsContainer.appendChild(confirmPasswordInputField);

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
	registerFieldsContainer.appendChild(submitButton);

    var loginScreenLink = document.createElement("P");
    loginScreenLink.className = "text-label login";
    loginScreenLink.textContent = "Already registered? Press here to log in";

    loginScreenLink.onclick = function () {
       onPressedLoginCallback();
    };

	registerFieldsContainer.appendChild(loginScreenLink);

	domElement.appendChild(registerFieldsContainer);
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
                "password": password,
				"pictureArrayBuffer": pictureArrayBuffer
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

	function arrayBufferToBase64(buffer) {
		var binary = "";
		var bytes = new Uint8Array(buffer);
		for (var i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		return "data:image/jpeg;base64," + window.btoa(binary);
	}

	var fileUploadLabel, pictureArrayBuffer;
	function createUploadPictureButton() {
		if(!fileUploadLabel){

			fileUploadLabel = document.createElement("LABEL");
			fileUploadLabel.htmlFor = "add-picture-button";
			fileUploadLabel.className = "add-picture-label";


			var uploadPictureButton = document.createElement("INPUT");
			uploadPictureButton.type = "file";
			uploadPictureButton.id = "add-picture-button";
			uploadPictureButton.accept = "image/jpeg, image/png";
			uploadPictureButton.className = "add-picture-button";
			uploadPictureButton.onchange = function (event) {
				var reader = new FileReader();

				var file = event.target.files[0];

				reader.onload = function () {
					// pictureArrayBuffer = reader.result;

					socket.emit("profilePictureUpload", {
						"fileBuffer": reader.result,
						"type": file.type,
						"name":file.name,
						"size": file.size
					}, function (response) {
						if(response.status) {
							profilePicture.src = response.path;
						}
						else {
							alert(response.reason);
						}
					});
				};

				reader.readAsArrayBuffer(file);
			};

			profilePicture.appendChild(fileUploadLabel);
			profilePicture.appendChild(uploadPictureButton);
		}
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