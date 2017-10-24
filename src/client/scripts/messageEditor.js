function MessageEditor(parent) {
    var messageEditor = {};
    var attachment;
    var howToUse = document.createElement("DIV");
	howToUse.appendChild(document.createTextNode("1. /list to get a list of the available users"));
    howToUse.appendChild(document.createElement("BR"));
    howToUse.appendChild(document.createTextNode("2. @someUsername to send a private message to that username"));

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
			addAttachmentButton.accept = "image/jpeg, audio/mpeg";
			addAttachmentButton.className = "add-attachment-button";
			addAttachmentButton.onchange = function (event) {
				var reader = new FileReader();

				var file = event.target.files[0];

				reader.onload = function () {
					attachment = new Attachment(reader.result, file.type, file.name, file.size);
					fileName.textContent = file.name;
				};

				reader.readAsArrayBuffer(file);
			};

			var helpButton = document.createElement("IMG");
			helpButton.src = "../resources/Help.png";
			helpButton.className = "help-button";
			helpButton.onclick = function () {
				if(popup){
					popup.parentNode.removeChild(popup);
				}

				popup = popupFactory.inform(howToUse, function () {
					popup = null;
				});
			};

			domElement.appendChild(fileUploadLabel);
			domElement.appendChild(fileName);
			domElement.appendChild(addAttachmentButton);
			domElement.appendChild(helpButton);
		}
	}

    domElement.appendChild(messageInputField);
    domElement.appendChild(sendMessageButton);
	createAddAttachmentButton();


    parent.appendChild(domElement);
	messageInputField.focus();

    function parseMessage(message) {
        message = message.trim();
        if(message === "/list"){
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
			popup = popupFactory.inform(members, function () {
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