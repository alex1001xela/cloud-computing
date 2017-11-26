import io from "socket.io-client";
import {NoBlockPopupFactory} from "./noBlockPopupFactory.js";
import {ChatScreen} from "./chatScreen";
import {LoginScreen} from "./loginScreen";
import {RegisterScreen} from "./registerScreen";

var socket = io();


export function Chat() {

	var domElement = document.createElement("DIV");
	var chatScreen, loginScreen, registerScreen;

	document.body.appendChild(domElement);

	window.popupFactory = new NoBlockPopupFactory(domElement);


	initLoginScreen();

	socket.on("disconnect", function () {
		setTimeout(function () {
			if(window.popup){
				console.log(window);
				console.log(window.popup);
				console.log(window.popup.parentNode);
				window.popup.parentNode.removeChild(window.popup);
			}
			window.popup = window.popupFactory.inform("Connection problems. Please wait...", function () {
				window.popup = null;
			});
		}, 500);
	});

	socket.on("reconnect", function () {
		if(window.popup){
			window.popup.parentNode.removeChild(window.popup);
			window.popup = null;
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