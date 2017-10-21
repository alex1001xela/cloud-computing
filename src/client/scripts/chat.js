var socket = io();
function Chat() {

	var username = "";
	var domElement = document.createElement("DIV");
	document.body.appendChild(domElement);

	//var loginScreen = new LoginScreen(domElement);

	loginScreen.onLogin(function () {

		new ChatScreen();
    });






	/* BEISPIEL

	var randomDiv = document.createElement("DIV");
	randomDiv.textContent = "Connected!";

	var randomButton = document.createElement("BUTTON");
	randomButton.textContent = "Press me!";
	randomButton.onclick = function () {
		domElement.removeChild(randomDiv);
		domElement.removeChild(randomButton);

		var randomDiv2 = document.createElement("DIV");
		randomDiv2.textContent = "Well done!";
		domElement.appendChild(randomDiv2);
	};


	socket.on("connect", function () {
		domElement.appendChild(randomDiv);
		domElement.appendChild(randomButton);
	});

	// BEISPIEL ENDE */

	function showChatScreen() {

	}
}