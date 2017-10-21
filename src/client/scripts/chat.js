var socket = io();
function Chat() {

	var domElement = document.createElement("DIV");
	document.body.appendChild(domElement);

	new ChatScreen(domElement);


	/*var loginScreen = new LoginScreen(domElement);
	loginScreen.onLogin(function (username) {
		loginScreen.detach();
		loginScreen = null;
		// new ChatScreen(parent, username);
    });*/

}