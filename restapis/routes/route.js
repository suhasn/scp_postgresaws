var express = require('express');
var router = express.Router();
var dbOp = require('../db/dbOp');
var xsenv = require('@sap/xsenv');
var xssec = require('@sap/xssec');

const urlBase = '/api';

router.get(`/`, function (req, res) {
	res.send("PostgreSQL ample application!!!");
});

router.get(`${urlBase}/getAllEmployees`, function (req, res) {
	dbOp.getAllEmployees(function (error, data) {
		if (error) {
			res.status(500);
			res.end('Error accessing DB: ' + JSON.stringify(error));
		} else {
			res.status(200);
			res.json(data);
		}
	});
});

router.get(`${urlBase}/getEmployeeDetails/:id`, function (req, res) {
	const id = req.params.id;
	console.log(`Retrieving product ${id}`);

	dbOp.getEmployeeDetails(id, function (error, product) {
		if (error) {
			res.status(400);
			res.send(error.toString());
		} else {
			res.status(200);
			res.send(product); //modify the response message.
		}
	});
});

router.post(`${urlBase}/addEmployeeDetails`, function (req, res) {
	const body = req.body;

	console.log(`Post addEmployeeDetails  ${JSON.stringify(body)}`);

	dbOp.addEmployeeDetails(body, function (error, data) {
		if (error) {
			res.status(400);
			res.send(error.toString());
		} else {
			console.log("$$$ inside put request response");
			res.status(200);
			res.send(data); //modify the response message.
		}
	});
});
module.exports = router;