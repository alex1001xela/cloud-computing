function ChatScreen(parent,username) {
    
    var chatScreen = {};

    var domElement = document.createElement("DIV");
  	var textField = document.createElement("DIV");
  	var username = document.createElement("DIV");
  	var messageBox = document.createElement("DIV");
 	
 	parent.appendChild(domElement);
	domElement.appendChild(textField);
	textField.appendChild(messageBox);

	
	domElement.className = "ChatScreen";
	textField.className = "textField";
	username.className = "username";
	messageBox.className = "messageBox";
	
	messageBox.textContent = "hello world";









  	return chatScreen;
}