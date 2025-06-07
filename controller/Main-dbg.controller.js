
sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
    "sap/m/WizardStep",
    "sap/m/Wizard",
    "sap/m/Text",
    "sap/m/HBox",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/VBox",
    "sap/m/List",
    "sap/m/InputListItem",
    "sap/m/Label",
    "libs/moments.min"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     
    */
    function (Controller, JSONModel, Button, WizardStep, Wizard, Text, HBox, Input, DatePicker, VBox, List, InputListItem, Label, moments) {
        "use strict";

        return Controller.extend("cassyl.cycle.controller.Main", {
            
            onInit: function () {
                const aCycles = Array.from({ length: 4 }, (_, index) => ({
                    date: "",
                    label: `Cycle ${index + 1} - 1er jour des règles`,
                    required: index < 2
                }));

                const oModel = new JSONModel({
                    knowsCycleDuration: null,
                    cycles: aCycles,
                    averageCycleLength: null,
                    averageCycleText: null,
                    startDate: null,
                    ovulationDate: null,
                    fertileStart: null,
                    fertileEnd: null,
                    fertilitySummary: null,
                    NidationStart: null,
                    NidationEnd: null,
                    PriseSang: null,
                    Nextcycle: null,
                });


                this.getView().setModel(oModel, "viewModel");
                this._oNavContainer = this.byId("wizardNavContainer"); // or however your NavContainer is set up

            },

            
            onPressYes: function (oEvent) {

                this.byId("Step1").setValidated(true);
                this.byId("Step1").setNextStep(this.getView().byId("Step2a"));
                this.byId("Wizard").nextStep(); // Navigate to Step 2 immediately
            },
            onPressNo: function (oEvent) {
                this.byId("Step1").setValidated(true);
                this.byId("Step1").setNextStep(this.getView().byId("Step2b"));
                this.byId("Wizard").nextStep(); // Navigate to Step 2 immediately
            },
            check2a: function (oEvent) {
                if (this.getView().getModel("viewModel").getProperty("/averageCycleLength") &&
                    this.getView().getModel("viewModel").getProperty("/startDate")) {
                    this.byId("Step2a").setValidated(true);
                }
            },
            check2b: function (oEvent) {
                const cycles = this.getView().getModel("viewModel").getProperty("/cycles");
                const filledfirstTwo = cycles[0]?.date?.length > 0 && cycles[1]?.date?.length > 0;
                if (filledfirstTwo) {
                    this.byId("Step2b").setValidated(true);
                } else {
                    this.byId("Step2b").setValidated(false);
                }
            },
            onComplete: function (oEvent) {
                const oModel = this.getView().getModel("viewModel");
                this.calculatedata(oModel);
                const averageCycleLength = oModel.getProperty("/averageCycleLength");
                const averageCycleText = averageCycleLength
                    ? `La durée moyenne de votre cycle est de : ${averageCycleLength} jours`
                    : "La durée moyenne de votre cycle n'a pas pu être calculée.";

                oModel.setProperty("/averageCycleText", averageCycleText);

                const formatDate = (dateStr) => {
                    if (!dateStr) return "<i>non disponible</i>";
                    const date = new Date(dateStr);
                    return date.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    });
                };

                const formatDateshort = (dateStr) => {
                    if (!dateStr) return "<i>non disponible</i>";
                    const date = new Date(dateStr);
                    if (NidationStart.month() === NidationEnd.month()) {
                        return date.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                    });
                    } else {
                    return date.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long"
                    });
                }
                };

                const startDate = oModel.getProperty("/startDate");
                const date = new Date(startDate);
                const startDateText = startDate
                    ? `Date des dernières règles : ${formatDate(date)}`
                    : "La date de début du cycle n'a pas été fournie.";

                oModel.setProperty("/startDateText", startDateText);

                const ovulation = oModel.getProperty("/ovulationDate");
                const fertileStart = oModel.getProperty("/fertileStart");
                const fertileEnd = oModel.getProperty("/fertileEnd");
                const NidationStart = oModel.getProperty("/NidationStart");
                const NidationEnd = oModel.getProperty("/NidationEnd");
                const PriseSang = oModel.getProperty("/PriseSang");
                const Nextcycle = oModel.getProperty("/Nextcycle");


                const finalText = `🩷 <strong>Date d'ovulation :</strong> ${formatDate(ovulation)}<br>` +
                    `🌱 <strong>Début de la période fertile :</strong> ${formatDate(fertileStart)}<br>` +
                    `🌸 <strong>Fin de la période fertile :</strong> ${formatDate(fertileEnd)}<br>` +
                    `🪺 <strong>Nidation :</strong> entre le ${formatDateshort(NidationStart)} et le ${formatDate(NidationEnd)}<br>` +
                    `🩸 <strong>Prise de sang :</strong> à partir du ${formatDate(PriseSang)}<br>` +
                    `🔁 <strong>Prochain cycle :</strong> ${formatDate(Nextcycle)}`;

                oModel.setProperty("/fertilitySummary", finalText);

                this._oNavContainer.to(this.byId("ReviewPage"));
            },
            calculatedata: function (oModel) {
                const wizard = this.byId("Wizard");
                const currentStep = wizard.getCurrentStep();
                if (currentStep.endsWith("Step2a")) { } else if (currentStep.endsWith("Step2b")) {

                    const cycles = oModel.getProperty("/cycles");

                    const dates = cycles
                        .map(c => c.date)
                        .filter(date => !!date)
                        .map(dateStr => new Date(dateStr));

                    let diffs = [];
                    debugger;

                    for (let i = 1; i < dates.length; i++) {
                        const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
                        if (!isNaN(diff) && diff > 0) {
                            diffs.push(diff);
                        }
                    }

                    if (diffs.length > 0) {
                        const avg = diffs.reduce((sum, d) => sum + d, 0) / diffs.length;
                        oModel.setProperty("/averageCycleLength", Math.round(avg));
                    } else {
                        oModel.setProperty("/averageCycleLength", null);
                    }

                    // ✅ Set the latest date as startDate
                    if (dates.length > 0) {
                        const latest = new Date(Math.max.apply(null, dates));
                        const yyyy = latest.getFullYear();
                        const mm = String(latest.getMonth() + 1).padStart(2, '0');
                        const dd = String(latest.getDate()).padStart(2, '0');
                        const formatted = `${yyyy}-${mm}-${dd}`; // Match your valueFormat: yyyy-MM-dd
                        oModel.setProperty("/startDate", formatted);
                    } else {
                        oModel.setProperty("/startDate", null);
                    }


                }
                const averageCycleLength = oModel.getProperty("/averageCycleLength");
                const startDateStr = oModel.getProperty("/startDate");

                const ovulationDate = moment(startDateStr).add(averageCycleLength - 14, 'days');

                const fertileStart = moment(ovulationDate).subtract(4, 'days');

                const fertileEnd = moment(ovulationDate).add(1, 'days');

                const nidationDatestart = moment(ovulationDate).add(6, 'days');
                const nidationDateend = moment(ovulationDate).add(10, 'days');
                
                const priseSang = moment(ovulationDate).add(12, 'days');
                
                const nextcycle = moment(startDateStr).add(averageCycleLength, 'days').format('YYYY-MM-DD');

                oModel.setProperty("/ovulationDate", ovulationDate);
                oModel.setProperty("/fertileStart", fertileStart);
                oModel.setProperty("/fertileEnd", fertileEnd);
                oModel.setProperty("/NidationStart", nidationDatestart);
                oModel.setProperty("/NidationEnd", nidationDateend);
                oModel.setProperty("/PriseSang", priseSang);
                oModel.setProperty("/Nextcycle", nextcycle);

            },
            handleWizardCancel: function (oEvent) {
               // this.wizard.discardProgress(this.wizard.getSteps()[0]);
               const _wizard = this.byId("Wizard");
                _wizard.discardProgress(_wizard.getSteps()[0]);
                _wizard.goToStep(_wizard.getSteps()[0]);
                this.byId("Step1").setValidated(false);
                this.byId("Step2a").setValidated(false);
                this.byId("Step2b").setValidated(false);

                this._oNavContainer.to(this.byId("page"));
                this.getView().getModel("viewModel").setData({
                    knowsCycleDuration: null,
                    cycles: Array.from({ length: 4 }, (_, index) => ({
                        date: "",
                        label: `Cycle ${index + 1} - 1er jour des règles`,
                        required: index < 2
                    })),
                    averageCycleLength: null,
                    averageCycleText: null,
                    startDate: null,
                    ovulationDate: null,
                    fertileStart: null,
                    fertileEnd: null,
                    fertilitySummary: null,
                    NidationStart: null,
                    NidationEnd: null,
                    PriseSang: null,
                    Nextcycle: null,
                });
            },
        });
    });


