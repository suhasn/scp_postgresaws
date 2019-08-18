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
			this.getView().setModel(employeesModel, "restEmployees");
			var url = "/getEmployees";
			jQuery
				.ajax({
					url: url,
					type: "GET",
					dataType: "json",
					success: function (result) {
						console.log("*****************Inside success " + result);
					},
					error: function (e) {
						// log error in browser
						console.log(e.message);
					}
				});
		}
	});
});