import Attachment from "./attachment";

export default function MessageEditor(parent, socket) {
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
					attachment = new Attachment(reader.result, file.type, file.name, file.size);
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