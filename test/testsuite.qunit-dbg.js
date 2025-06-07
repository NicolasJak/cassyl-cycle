sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: cassyl.cycle",
		defaults: {
			page: "ui5://test-resources/cassyl/cycle/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "cassyl/cycle/",
				never: "test-resources/cassyl/cycle/"
			},
			loader: {
				paths: {
					"cassyl/cycle": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for cassyl.cycle"
			},
			"integration/opaTests": {
				title: "Integration tests for cassyl.cycle"
			}
		}
	};
});
