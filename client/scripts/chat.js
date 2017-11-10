var socket = io();
var popupFactory, popup;
function Chat() {

	var domElement = document.createElement("DIV");
	var chatScreen, loginScreen;

	document.body.appendChild(domElement);

	popupFactory = new NoBlockPopupFactory(domElement);


	initLoginScreen();

	socket.on("disconnect", function () {
		setTimeout(function () {
			if(popup){
				popup.parentNode.removeChild(popup);
			}
			popup = popupFactory.inform("Connection problems. Please wait...", function () {
				popup = null;
			});
		}, 500);
	});

	socket.on("reconnect", function () {
		if(popup){
			popup.parentNode.removeChild(popup);
		}
		if(chatScreen){
			removeComponent(chatScreen);
		}
		if(loginScreen){
			removeComponent(loginScreen);
		}

		initLoginScreen();
	});


	function initLoginScreen() {
		loginScreen = new LoginScreen(domElement);
		loginScreen.onLogin(function () {
			removeComponent(loginScreen);
			chatScreen = new ChatScreen(domElement);
		});
	}

	function removeComponent(component) {
		component.detach();
		component = null;
	}
}