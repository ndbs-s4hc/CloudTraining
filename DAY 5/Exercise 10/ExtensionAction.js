sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function(MessageBox, MessageToast) {
    'use strict';

    async function postCreatePO(oController){
        debugger;

        var _oBody = {
                PurchaseOrder : "",
                CompanyCode : "1000",
                PurchaseOrderType : "P401",
                PurchaseOrderDeletionCode : "",
                CreationDate : "2025-12-31",
                CreatedByUser : "",                
                Supplier : "50001",
                DocumentCurrency : "THB",
                SubjectToRelease : "",
                _Item: [
                    {
                        Plant : "1100",
                        Material : "RM001",
                        OrderQuantity : 10,
                        OrderQuantityUnit : "PC",
                        NetAmount : 1000,
                        DocumentCurrency : "THB"
                    },
                    {
                        Plant : "1100",
                        Material : "RM002",
                        OrderQuantity : 10,
                        OrderQuantityUnit : "PC",
                        NetAmount : 1000,
                        DocumentCurrency : "THB"
                    }
                ]
            };

        var oToken = oController.getView().getModel().getHttpHeaders()["X-CSRF-Token"];
        var sPath = "/sap/opu/odata4/sap/zsb_purchaseorder_00_v4/srvd/sap/zsd_purchaseorder_00/0001/ZC_PurchaseOrderHead00_S01/com.sap.gateway.srvd.zsd_purchaseorder_00.v0001.CreatePO";
        postODataV4(sPath, oToken, _oBody, _onPostSuccess, _onPostError, oController);
    }

    function _onPostSuccess(oData, sStatus, oResponse) {
            debugger;
            var sSuccessMessage = "Purchase Order: " + oResponse.responseJSON.PurchaseOrder + " has been created.";
            MessageBox.success(sSuccessMessage);

    }

    function _onPostError(oData) {
        debugger;
        MessageBox.error(oData.responseJSON.error.message);

    }

    function postODataV4(sPath, tToken, objJSON, fnSuccess, fnError, that) {
        debugger;
        return new Promise(function (fnresolve, fnreject) {
          jQuery.ajax({
            url: sPath,
            type: "POST",
            headers: {
              "X-CSRF-Token": tToken,
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            data: JSON.stringify(objJSON),
            success: fnSuccess.bind(that),
            error: fnError.bind(that)
          });
        }.bind(this));
    }

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        onCreatePO: function(oContext, aSelectedContexts) {
            debugger;

            var sWarningMessage = "Do you want to create a Purchase Order ? ";
                MessageBox.confirm(sWarningMessage, {
                    onClose: async function (btnAction) {
                        if (btnAction == "OK") {
                            await postCreatePO(this._controller);
                            this._controller.extensionAPI.refresh();
                        } else if (btnAction == "CANCEL") 
                            //
                            this.getView().setBusy(false);
                    }.bind(this)
                });

            
        }
    };
});
