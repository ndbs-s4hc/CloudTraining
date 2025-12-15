sap.ui.define([
    "zdemo/zfreestylepo00/controller/BaseController"
], (Controller) => {
    "use strict";

    return Controller.extend("zdemo.zfreestylepo00.controller.List", {
        onInit() {
            this.getRouter().getRoute("ListRO").attachPatternMatched(this._onPatternMatched, this);

        },

        _onPatternMatched: function(oEvent){
            debugger;

        },

        onCreatePO: function(oEvent){
            debugger;
            this.getRouter().navTo("PostRO", {});
            
        }
    });
});
