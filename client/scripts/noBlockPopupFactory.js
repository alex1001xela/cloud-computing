"use strict";

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