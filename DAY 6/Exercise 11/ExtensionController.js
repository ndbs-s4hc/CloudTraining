sap.ui.define([
    "sap/m/MessageBox"
], function(MessageBox) {
    'use strict';

        function prepareJSONPost(oController){
            debugger;           
            var aPostData = oController.getView().getModel("mPostData").getProperty("/"),
                oToken = oController.getView().getModel().getHttpHeaders()["X-CSRF-Token"],
                sPath = "/sap/opu/odata4/sap/zsb_purchaseorder_00_v4/srvd/sap/zsd_purchaseorder_00/0001/ZC_PurchaseOrderHead00_S01/com.sap.gateway.srvd.zsd_purchaseorder_00.v0001.CreatePO";

            var _oBody = {
                PurchaseOrder : "",
                CompanyCode : aPostData.CompanyCode,
                PurchaseOrderType : aPostData.PurchaseOrderType,
                PurchaseOrderDeletionCode : "",
                CreationDate : aPostData.CreationDate,
                CreatedByUser : "",                
                Supplier : aPostData.Supplier,
                DocumentCurrency : aPostData.DocumentCurrency,
                SubjectToRelease : "",
                _Item: []
            };

            for (let i = 0; i < aPostData.Items.length; i++) {
                _oBody._Item.push({ Plant : aPostData.Items[i].Plant,
                                         Material : aPostData.Items[i].Material,
                                         OrderQuantity : parseInt(aPostData.Items[i].OrderQuantity),
                                         OrderQuantityUnit : "PC",
                                         NetAmount : parseInt(aPostData.Items[i].NetAmount),
                                         DocumentCurrency : "THB"  
                                        });
            }

            postODataV4(sPath, oToken, _oBody, _onPostSuccess, _onPostError, oController);

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

        function _onPostSuccess(oData, sStatus, oResponse) {
            debugger;
            var sSuccessMessage = "Purchase Order: " + oResponse.responseJSON.PurchaseOrder + " has been created.";
            MessageBox.success(sSuccessMessage, {
                    onClose: function (btnAction) {
                        if (btnAction == "OK") {
                            this._CurrentDialog.close();
                            this.extensionAPI.refresh();
                        }
                    }.bind(this)
                });

        }

        function _onPostError(oData) {
            debugger;
            MessageBox.error(oData.responseJSON.error.message);

        }  

    return {
        onCancel: function(oEvent) {
            //Button Cancel in Dialog
            this._CurrentDialog.close();

        },

        onPost: function(oEvent){
            debugger;

            var sWarningMessage = "Do you want to create a Purchase Order ? ";
                MessageBox.confirm(sWarningMessage, {
                    onClose: function (btnAction) {
                        if (btnAction == "OK") {
                            prepareJSONPost(this);
                        } else if (btnAction == "CANCEL") 
                            //
                            this.getView().setBusy(false);
                    }.bind(this)
                });
        },

        onAddItem: function(oEvent){
            debugger;
            var aPostData = this.getView().getModel("mPostData").getProperty("/");
            aPostData.Items.push({Plant : "",
                              Material : "",
                              OrderQuantity : parseInt(0),
                              OrderQuantityUnit : "PC",
                              NetAmount : parseInt(0),
                              DocumentCurrency : "THB"  
                    });
            this.getView().getModel("mPostData").setProperty("/", aPostData);
        }
        
    };
});
