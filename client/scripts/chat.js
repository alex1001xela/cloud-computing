import io from "socket.io-client";
import NoBlockPopupFactory from "./noBlockPopupFactory.js";
import ChatScreen from "./chatScreen";
import LoginScreen from "./loginScreen";
import RegisterScreen from "./registerScreen";

var popupFactory, popup;
var socket = io();

export default function Chat() {

	var domElement = document.createElement("DIV");
	var chatScreen, loginScreen, registerScreen;

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
		loginScreen = new LoginScreen(domElement, socket);
		loginScreen.onLogin(function () {
			removeComponent(loginScreen);
			chatScreen = new ChatScreen(domElement, socket);
		});
		loginScreen.onPressedRegister(function () {
		    removeComponent(loginScreen);
			initRegisterScreen();
        });
	}

	function initRegisterScreen() {
        registerScreen = new RegisterScreen(domElement, socket);
        registerScreen.onLogin(function () {
            removeComponent(registerScreen);
            chatScreen = new ChatScreen(domElement, socket);
        });
        registerScreen.onPressedLogin(function () {
            removeComponent(registerScreen);
            initLoginScreen();
        });
    }

	function removeComponent(component) {
		component.detach();
		component = null;
	}
}

new Chat();