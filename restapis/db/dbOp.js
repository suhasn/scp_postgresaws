const xsenv = require('@sap/xsenv');
// Module var
let __db;

const CREATE_EMPLOYEE_TABLE_SQL =
	'CREATE TABLE IF NOT EXISTS employee_details \
          ( \
              emp_id varchar, \
              first_name varchar, \
              last_name varchar, \
              gender varchar, \
              department varchar, \
              PRIMARY KEY (emp_id) \
          )';

function _connectToDB() {
	if (!__db) {
		// we create and intialize the connection
		const pgp = require('pg-promise')();

		// UNCOMMENT THE BELOW GET SERVICES CODE

		// const servicesENV = xsenv.getServices({
		// 	 'aws-rds-postgresql': {
		// 	 	tag: "postgresql"
		// 	 }
		// });

		var awsEnv = servicesENV['aws-rds-postgresql'];
		const dbConnStr = awsEnv.uri + "?ssl=true";
		console.log('URL' + dbConnStr);
		__db = pgp(dbConnStr);
	}

	return __db;
}

function getAllEmployees(cb) {
	const db = _connectToDB();

	db.manyOrNone('SELECT * FROM employee_details')
		.then(function (data) {
			console.log(`Retrieved products ${JSON.stringify(data)}`);
			cb(null, data)
		})
		.catch(function (error) {
			console.error(`Error retrieving products ${error.toString()}`);
			cb(error);
		})
}

function getEmployeeDetails(id, cb) {
	const db = _connectToDB();
	db.one('SELECT * FROM employee_details WHERE emp_id = $1 GROUP BY emp_id', [id])
		.then(function (data) {
			cb(null, data);
		})
		.catch(function (error) {
			console.error(`error updating average rating ${error.toString()}`);
			cb(error);
		});
}

function addEmployeeDetails(data, cb) {
	const db = _connectToDB();
	db.one('INSERT INTO employee_details(emp_id, first_name, last_name, gender, department) values($1,$2,$3,$4,$5)', [data.empID, data.firstName,
			data.lastName, data.gender, data.department
		])
		.then(function (data) {
			cb(null, data);
		})
		.catch(function (error) {
			cb(error);
		})
}

function initializeDB(cb) {
	console.log("initializeDB ");

	const db = _connectToDB();

	db.none(CREATE_EMPLOYEE_TABLE_SQL)
		.then(function () {
			console.log("Employee table created");
			cb();
		})
		.catch((error) => {
			console.log(`Error while creating Employee table ${error.toString()}`);
			cb(error);
		});
}

module.exports = {
	initializeDB: initializeDB,
	getAllEmployees: getAllEmployees,
	addEmployeeDetails: addEmployeeDetails,
	getEmployeeDetails: getEmployeeDetails
};
