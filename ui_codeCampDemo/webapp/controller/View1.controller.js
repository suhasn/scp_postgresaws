sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.sap.demo.codecamp.ui.controller.View1", {
		onInit: function () {

			var employeesModel = new sap.ui.model.json.JSONModel();

			employeesModel.loadData(
				"/getAllEmployees", null, true, 'GET'
			);
			this.getView().setModel(employeesModel, "EmployeesJSONModel");
		}
	});
});
