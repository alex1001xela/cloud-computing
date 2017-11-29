import {MessageEditor} from "./messageEditor";

export function ChatScreen(parent, socket) {

    var chatScreen = {};

    var domElement = document.createElement("DIV");
    var logo = document.createElement("IMG");

    var usersContainer = document.createElement("DIV");
    usersContainer.className = "users-container";


    usersContainer.onclick = function () {
		if(window.popup){
			window.popup.parentNode.removeChild(window.popup);
		}
		socket.emit("getUsersList", {}, function (members) {
			window.popup = window.popupFactory.inform(members.toString(), function () {
				window.popup = null;
			});
		});
	};
    var usersCount = document.createElement("DIV");
    usersCount.className = "users-count";

    var numberOfUsers = 0;
    socket.emit("getUsersCount", {}, function (count) {
        numberOfUsers = count;
        setNumberOfUsers();
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
    new MessageEditor(domElement, socket);

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

    function setNumberOfUsers() {
        usersCount.textContent = numberOfUsers + "/100";
    }

    function scrollToBottom() {
		textField.scrollTop = textField.scrollHeight;
	}

    function showUserMessage(args) {

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

    /*
    Changes the background color of the chat based on the current mood level
     */
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

        showUserMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: true
        });
    });

    socket.on("privateMessage", function (username, message, timestamp) {

        showUserMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: false
        });
    });

    socket.on("messageWithAttachment", function (username, message, attachmentURL, timestamp) {

        showUserMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: true,
            attachment: attachmentURL
        });
    });

    socket.on("privateMessageWithAttachment", function (username, message, attachmentURL, timestamp) {

        showUserMessage({
            username: username,
            message: message,
            timestamp: timestamp,
            isPublic: false,
            attachment: attachmentURL
        });
    });

    socket.on("newUser", function (loginStatus) {
        numberOfUsers++;
        setNumberOfUsers();
        showServerMessage(loginStatus.username + " joined!");
    });

    socket.on("userLeft", function (username) {
        numberOfUsers--;
        setNumberOfUsers();
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