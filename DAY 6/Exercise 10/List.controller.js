sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("zdemo.zfreestylepo00.controller.List", {
        onInit() {
            this.getRouter().getRoute("ListRO").attachPatternMatched(this._onPatternMatched, this);

        },

        onCreatePO: function(oEvent){
            debugger;
            this.getRouter().navTo("PostRO", {});
            
        }
    });
});
