"use strict";
require("dotenv").config({silent: true});
const express = require("express");
const path = require("path");
const initServer = require("./server");

const port = process.env.PORT || process.env.VCAP_APP_PORT || process.argv[2] || 8080;
const homePath = path.join(__dirname, "..");
const clientPath = path.join(homePath, "client");

function App() {

	this.expressApp = express();
	this.expressApp.enable("trust proxy");
	this.expressApp.use((req, res, next) => {
		res.setHeader("Content-Security-Policy", "script-src 'self' " + "https://" + req.headers.host + req.url);

		if (req.secure || req.headers.host === "localhost:" + port) { // allowing localhost without https

			next();
		} else {
			res.redirect("https://" + req.headers.host + req.url);
		}

	});

	this.expressApp.use(express.static(clientPath));


	this.users = {};

	initServer(port, this.expressApp, process.env.VCAP_APP_PORT);
}

new App();