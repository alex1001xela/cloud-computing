/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = Chat;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__noBlockPopupFactory_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chatScreen__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__loginScreen__ = __webpack_require__(5);
var socket = io();
var popupFactory, popup;




function Chat() {

	var domElement = document.createElement("DIV");
	var chatScreen, loginScreen;

	document.body.appendChild(domElement);

	popupFactory = new __WEBPACK_IMPORTED_MODULE_0__noBlockPopupFactory_js__["a" /* default */](domElement);


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
		loginScreen = new __WEBPACK_IMPORTED_MODULE_2__loginScreen__["a" /* default */](domElement);
		loginScreen.onLogin(function () {
			removeComponent(loginScreen);
			chatScreen = new __WEBPACK_IMPORTED_MODULE_1__chatScreen__["a" /* default */](domElement);
		});
	}

	function removeComponent(component) {
		component.detach();
		component = null;
	}
}

new Chat();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = NoBlockPopupFactory;


function NoBlockPopupFactory(parent) {

	function createMainWindow() {
		var mainWindow = document.createElement("div");
		mainWindow.className = "nbPopup main";
		parent.appendChild(mainWindow);
		mainWindow.onmousedown = function (event) {
			event.preventDefault();
		};
		return mainWindow;
	}

	function createHeader(title) {
		var header = document.createElement("div");
		header.className = "nbPopup header";
		header.appendChild(createHeaderTextContainer(title));
		return header;
	}

	function createBody(text) {
		var body = document.createElement("div");
		body.className = "nbPopup body";
		body.appendChild(createBodyTextContainer(text));
		return body;
	}

	function createButton(label, windowToBeRemoved, onClick) {
		var button = document.createElement("button");
		button.className = "nbPopup button";
		button.textContent = label;
		button.onclick = function () {
			if(onClick){
				onClick();
			}
			parent.removeChild(windowToBeRemoved);
		};
		return button;
	}

	function createFooter() {
		var footer = document.createElement("div");
		footer.className = "nbPopup footer";
		return footer;
	}

	function createHeaderTextContainer(text) {
		var textContainer = document.createElement("div");
		textContainer.className = "nbPopup headerText";
		textContainer.textContent = text;
		return textContainer;
	}

	function createBodyTextContainer(text) {
		var textContainer = document.createElement("div");
		textContainer.className = "nbPopup bodyText";
		if((typeof text) === "string"){
			textContainer.textContent = text;
		}
		else if((typeof text) === "object"){
			textContainer = text;
		}


		return textContainer;
	}

	return {
		inform: function (bodyText, onOk) {
			var mainWindow = createMainWindow();
			var footer = createFooter();
			mainWindow.appendChild(createHeader("Information"));
			mainWindow.appendChild(createBody(bodyText));
			footer.appendChild(createButton("OK", mainWindow, onOk));
			mainWindow.appendChild(footer);
			return mainWindow;
		}
	}
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ChatScreen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__messageEditor__ = __webpack_require__(3);


function ChatScreen(parent) {

    var chatScreen = {};

    var domElement = document.createElement("DIV");
    var logo = document.createElement("IMG");

    var usersContainer = document.createElement("DIV");
    usersContainer.className = "users-container";


    usersContainer.onclick = function () {
		if(popup){
			popup.parentNode.removeChild(popup);
		}
		socket.emit("getUsersList", {}, function (members) {
			popup = popupFactory.inform(members.toString(), function () {
				popup = null;
			});
		});
	};
    var usersCount = document.createElement("DIV");
    usersCount.className = "users-count";

    var numberOfUsers = 0;
    socket.emit("getUsersCount", {}, function (count) {
        numberOfUsers = count;
        setNumberOfUsersElement();
    });

    var usersIcon = document.createElement("IMG");
    usersIcon.className = "users-icon";
    usersIcon.src = "resources/users.png";
    usersContainer.appendChild(usersCount);
    usersContainer.appendChild(usersIcon);

    var textField = document.createElement("DIV");
    textField.style.background = "#f2f2f2";

    parent.appendChild(domElement);
    domElement.appendChild(logo);
    domElement.appendChild(usersContainer);
    domElement.appendChild(textField);
    new __WEBPACK_IMPORTED_MODULE_0__messageEditor__["a" /* default */](domElement);

    logo.setAttribute("src", "resources/logo.jpg");
    logo.setAttribute("width", "250");
    logo.setAttribute("height", "67");

    domElement.className = "ChatScreen";
    textField.className = "textField";

    socket.emit("getMoodLevel", {}, function (moodLevel) {
		showMoodLevel(moodLevel);
	});

    function getTimeRepresentation(dateObject){
        var hours = dateObject.getHours() < 10 ? "0" + dateObject.getHours() : dateObject.getHours();
        var minutes = dateObject.getMinutes() < 10 ? "0" + dateObject.getMinutes() : dateObject.getMinutes();
        var seconds = dateObject.getSeconds() < 10 ? "0" + dateObject.getSeconds() : dateObject.getSeconds();

        return hours + ":" + minutes + ":" + seconds;
    }

    function setNumberOfUsersElement() {
        usersCount.textContent = numberOfUsers + "/100";
    }

    function scrollToBottom() {
		textField.scrollTop = textField.scrollHeight;
	}

    function showMessage(args) {

        var messageBox = document.createElement("DIV");
        var usernameText = document.createElement("DIV");
        var messageText = document.createElement("DIV");
        var messageTime = document.createElement("DIV");

        usernameText.textContent = args.username;
        messageText.textContent = args.message;
        messageTime.textContent = getTimeRepresentation(new Date(args.timestamp));

        messageBox.className = "messageBox";
        usernameText.className = "usernameText";
        messageText.className = args.isPublic ? "messageText" : "messageTextPrivate";
        messageTime.className = "messageTime";

        messageBox.appendChild(usernameText);
        if(args.message){
            messageBox.appendChild(messageText);
        }


        if(args.attachment) {
            var attachmentButton = document.createElement("BUTTON");
            attachmentButton.className = "attachment-button";
            attachmentButton.onclick = function () {
                window.open(args.attachment);
            };
            var attachmentButtonImage = document.createElement("IMG");
            attachmentButtonImage.src = "resources/download.png";
            attachmentButton.appendChild(attachmentButtonImage);

            messageBox.appendChild(attachmentButton);
        }

        messageBox.appendChild(messageTime);
        textField.appendChild(messageBox);
        scrollToBottom();
    }

    function showServerMessage(message) {
        var messageBox = document.createElement("DIV");
        messageBox.className = "messageBoxServer";
        var messageText = document.createElement("DIV");
        messageText.className = "messageTextServer";
        messageText.textContent = message;
        messageBox.appendChild(messageText);
        textField.appendChild(messageBox);
		scrollToBottom();
    }

    function showMoodLevel(moodLevel) {
		var positiveOrNegative = moodLevel > 0 ? 1 : -1;
		var startingColor = 242;
		var blueStep = 242 / 100;
		var redStep = moodLevel > 0 ? 242 / 100 : 142 / 100;
		var greenStep = moodLevel < 0 ? 242 / 100 : 142 / 100;

		var newRed = startingColor - redStep * moodLevel * positiveOrNegative;
		var newGreen = startingColor - greenStep * moodLevel * positiveOrNegative;
		var newBlue = startingColor - blueStep * moodLevel * positiveOrNegative;

		textField.style.background = "rgb(" + newRed + ", " + newGreen + ", " + newBlue + ")";
	}

    socket.on("message", function (username, message, timestamp) {

        showMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: true
        });
    });

    socket.on("privateMessage", function (username, message, timestamp) {

        showMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: false
        });
    });

    socket.on("messageWithAttachment", function (username, message, attachmentURL, timestamp) {

        showMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: true,
            attachment: attachmentURL
        });
    });

    socket.on("privateMessageWithAttachment", function (username, message, attachmentURL, timestamp) {

        showMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: false,
            attachment: attachmentURL
        });
    });

    socket.on("newUser", function (username) {
        numberOfUsers++;
        setNumberOfUsersElement();
        showServerMessage(username + " joined!");
    });

    socket.on("userLeft", function (username) {
        numberOfUsers--;
        setNumberOfUsersElement();
        showServerMessage(username + " left!");
    });

    socket.on("newMood", function (mood) {
        showMoodLevel(mood);
	});

	chatScreen.detach = function () {
		parent.removeChild(domElement);
	};

    return chatScreen;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = MessageEditor;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__attachment__ = __webpack_require__(4);


function MessageEditor(parent) {
    var messageEditor = {};
    var attachment;
    var howToUse = document.createElement("DIV");
	howToUse.appendChild(document.createTextNode("1. \\list to get a list of the available users"));
    howToUse.appendChild(document.createElement("BR"));
    howToUse.appendChild(document.createTextNode("2. Start your message with @username to send a private message to that username"));

    var domElement = document.createElement("DIV");
    domElement.className = "message-editor";

    var messageInputField = document.createElement("INPUT");
    messageInputField.className = "message-input-field";
    messageInputField.onkeydown = function (event) {
        if(event.key === "Enter" && messageInputField.value.length > 0){
            parseMessage(messageInputField.value);
        }
    };

    var sendMessageButton = document.createElement("BUTTON");
    sendMessageButton.className = "send-message-button";
    sendMessageButton.textContent = "Send";
    sendMessageButton.onclick = function () {
        if(attachment || messageInputField.value.length > 0){
            parseMessage(messageInputField.value);
        }
    };

	var fileUploadLabel, fileName;
    function createAddAttachmentButton() {
    	if(!fileUploadLabel){

			fileUploadLabel = document.createElement("LABEL");
			fileUploadLabel.htmlFor = "add-attachment-button";
			fileUploadLabel.className = "file-upload-label";

			fileName = document.createElement("DIV");
			fileName.className = "file-name";
			fileName.textContent = "";

			var addAttachmentButton = document.createElement("INPUT");
			addAttachmentButton.type = "file";
			addAttachmentButton.id = "add-attachment-button";
			addAttachmentButton.accept = "image/jpeg, audio/mpeg, video/mp4";
			addAttachmentButton.className = "add-attachment-button";
			addAttachmentButton.onchange = function (event) {
				var reader = new FileReader();

				var file = event.target.files[0];

				reader.onload = function () {
					attachment = new __WEBPACK_IMPORTED_MODULE_0__attachment__["a" /* default */](reader.result, file.type, file.name, file.size);
					fileName.textContent = file.name;
				};

				reader.readAsArrayBuffer(file);
			};




			domElement.appendChild(fileUploadLabel);
			domElement.appendChild(fileName);
			domElement.appendChild(addAttachmentButton);


		}
	}

	function createHelpButton() {
		var helpButton = document.createElement("IMG");
		helpButton.src = "../resources/help.png";
		helpButton.className = "help-button";
		helpButton.onclick = function () {
			if(popup){
				popup.parentNode.removeChild(popup);
			}

			popup = popupFactory.inform(howToUse, function () {
				popup = null;
			});
		};
		domElement.appendChild(helpButton);
	}

	function createMoodLevelIndicator() {
		var moodLevelIndicator = document.createElement("DIV");
		moodLevelIndicator.className = "mood-level-indicator";

		var sadSmiley = document.createElement("IMG");
		sadSmiley.className = "smiley sad";
		sadSmiley.src = "../resources/sadsmiley.png";
		moodLevelIndicator.appendChild(sadSmiley);

		var moodLevelBar = document.createElement("IMG");
		moodLevelBar.className = "mood-level-bar";
		moodLevelBar.src = "../resources/moodlevel.png";
		moodLevelIndicator.appendChild(moodLevelBar);

		var happySmiley = document.createElement("IMG");
		happySmiley.className = "smiley happy";
		happySmiley.src = "../resources/happysmiley.png";
		moodLevelIndicator.appendChild(happySmiley);

		domElement.appendChild(moodLevelIndicator);
	}

    domElement.appendChild(messageInputField);
    domElement.appendChild(sendMessageButton);
	createAddAttachmentButton();
	createMoodLevelIndicator();
	createHelpButton();



    parent.appendChild(domElement);
	messageInputField.focus();

    function parseMessage(message) {
        message = message.trim();
        if(message === "\\list"){
            getUsersList();
        }
        else if (message.startsWith("@")){
            sendPrivateMessage(message);
        }
        else{
            sendMessage(message);
        }
    }

    function getUsersList() {
        socket.emit("getUsersList", {}, function (members) {
			if(popup){
				popup.parentNode.removeChild(popup);
			}
			popup = popupFactory.inform(members.toString(), function () {
				popup = null;
			});
            clearTextField();
        })
    }

    function sendMessage(message) {
        if(attachment){
            socket.emit("messageWithAttachment", {
                "message": message,
                "attachment": attachment
            }, function () {
                clearTextField();
                clearAttachment();
            });
        }
        else{
            socket.emit("message", {
                "message": message
            }, function () {
                clearTextField();
            });
        }
    }

    function sendPrivateMessage(message) {
        if(attachment){
            socket.emit("privateMessageWithAttachment", {
                "message": message,
                "otherUsername": getUserForPrivateMessage(message),
                "attachment": attachment
            }, function () {
                clearTextField();
				clearAttachment();
            });
        }
        else{
            socket.emit("privateMessage", {
                "message": message,
                "otherUsername": getUserForPrivateMessage(message)
            }, function () {
                clearTextField();
            });
        }
    }

    function clearTextField() {
        messageInputField.value = "";
		messageInputField.focus();
    }

    function clearAttachment() {
		domElement.removeChild(fileUploadLabel);
		domElement.removeChild(fileName);
    	attachment = null;
		fileUploadLabel = null;
		createAddAttachmentButton();
	}



    function getUserForPrivateMessage(message) {
        return (message.substr(1, message.length).split(" "))[0];
    }

    return messageEditor;
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Attachment;
function Attachment(fileBuffer, type, name, size) {
    var attachment = {};

    attachment.fileBuffer = fileBuffer;
    attachment.type = type;
    attachment.name = name;
    attachment.size = size;

    return attachment;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = LoginScreen;
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

    loginScreen.onLogin = function(callback) {
        onLoginCallback = callback;
    };

    loginScreen.detach = function () {
        parent.removeChild(domElement);
    };

    return loginScreen;
}

/***/ })
/******/ ]);