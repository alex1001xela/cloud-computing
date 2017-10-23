function ChatScreen(parent) {

    var chatScreen = {};

    var domElement = document.createElement("DIV");
    var logo = document.createElement("IMG");

    var usersContainer = document.createElement("DIV");
    usersContainer.className = "users-container";
    var usersCount = document.createElement("DIV");
    usersCount.className = "users-count";

    var numberOfUsers = 0;
    socket.emit("getUsersCount", {}, function (count) {
        numberOfUsers = count;
        setNumberOfUsersElement();
    });

    var usersIcon = document.createElement("IMG");
    usersIcon.className = "users-icon";
    usersIcon.src = "resources/Users.png";
    usersContainer.appendChild(usersCount);
    usersContainer.appendChild(usersIcon);

    var textField = document.createElement("DIV");


    parent.appendChild(domElement);
    domElement.appendChild(logo);
    domElement.appendChild(usersContainer);
    domElement.appendChild(textField);
    new MessageEditor(domElement);

    logo.setAttribute("src", "resources/logo.jpg");
    logo.setAttribute("width", "250");
    logo.setAttribute("height", "67");

    domElement.className = "ChatScreen";
    textField.className = "textField";

    function getTimeRepresentation(dateObject){
        var hours = dateObject.getHours() < 10 ? "0" + dateObject.getHours() : dateObject.getHours();
        var minutes = dateObject.getMinutes() < 10 ? "0" + dateObject.getMinutes() : dateObject.getMinutes();
        var seconds = dateObject.getSeconds() < 10 ? "0" + dateObject.getSeconds() : dateObject.getSeconds();

        return hours + ":" + minutes + ":" + seconds;
    }

    function setNumberOfUsersElement() {
        usersCount.textContent = numberOfUsers + "/100";
    }

    function showMessage(args) {

        var messageBox = document.createElement("DIV");
        var usernameText = document.createElement("DIV");
        var messageText = document.createElement("DIV");
        var messageTime = document.createElement("DIV");

        usernameText.textContent = args.username;
        messageText.textContent = args.message;
        messageTime.textContent = getTimeRepresentation(new Date(args.timestamp));

        messageBox.className = args.isPublic ? "messageBox" : "messageBoxPrivate";
        usernameText.className = args.isPublic ? "usernameText" : "usernameTextPrivate";
        messageText.className = args.isPublic ? "messageText" : "messageTextPrivate";
        messageTime.className = args.isPublic ? "messageTime" : "messageTimePrivate";

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
            attachmentButtonImage.src = "resources/Download.png";
            attachmentButton.appendChild(attachmentButtonImage);

            messageBox.appendChild(attachmentButton);
        }

        messageBox.appendChild(messageTime);
        textField.appendChild(messageBox);
    }

    function showServerMessage(message) {
        var messageBox = document.createElement("DIV");
        messageBox.className = "messageBoxServer";
        var messageText = document.createElement("DIV");
        messageText.className = "messageTextServer";
        messageText.textContent = message;
        messageBox.appendChild(messageText);
        textField.appendChild(messageBox);
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

    return chatScreen;
}