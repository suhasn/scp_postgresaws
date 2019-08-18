/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/demo/codecamp/ui/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});