function MessageEditor(parent) {
    var messageEditor = {};
    var attachment;

    var domElement = document.createElement("DIV");
    domElement.className = "message-editor";
    var messageInputField = document.createElement("INPUT");
    messageInputField.onkeydown = function (event) {
        if(event.key === "Enter" && messageInputField.value.length > 0){
            parseMessage(messageInputField.value);
        }
    }

    var sendMessageButton = document.createElement("BUTTON");
    sendMessageButton.textContent = "Send";
    sendMessageButton.onclick = function () {
        if(messageInputField.value.length > 0){
            parseMessage(messageInputField.value);
        }
    };

    var addAttachmentButton = document.createElement("BUTTON");
    addAttachmentButton.textContent = "+";

    domElement.appendChild(messageInputField);
    domElement.appendChild(sendMessageButton);
    domElement.appendChild(addAttachmentButton);


    parent.appendChild(domElement);

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
            alert(members);
            clearTextField();
        })
    }

    function sendMessage(message) {
        if(attachment){
            socket.emit("messageWithAttachment", {
                "message": message,
                "attachment": attachment.fileBuffer
            }, function () {
                clearTextField();
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
                "attachment": attachment.fileBuffer
            }, function () {
                clearTextField();
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
    
    function addAttachment(file) {
        
    }
    
    function removeAttachment() {

    }

    function clearTextField() {
        messageInputField.value = "";
    }

    function getUserForPrivateMessage(message) {
        return (message.substr(1, message.length).split(" "))[0];
    }





    return messageEditor;
}