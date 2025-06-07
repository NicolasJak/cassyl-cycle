sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("cassyl.cycle.controller.Main", {
		sayHello: function () {
			MessageBox.show("Hello World!");
		}
	});
});
