"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cfenv = require("cfenv");
var route = require('./routes/route');
const dbOp = require('./db/dbOp');

var app = express();

app.use(bodyParser.json());

app.use('/', route);

var appEnv = cfenv.getAppEnv();
dbOp.initializeDB(function (error) {
	if (error) {
		console.error(`Error initializing database ${error.toString()}`);
		process.exit(-2);
	}
	console.log(`data base initialized...`);
	const serviceURL = appEnv.url;
	const servicePort = appEnv.port;

	app.listen(servicePort, function () {
		console.log("server started on " + serviceURL);
	});
});
