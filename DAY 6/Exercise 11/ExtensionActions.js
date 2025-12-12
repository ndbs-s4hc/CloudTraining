sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function(MessageBox, MessageToast, JSONModel) {
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

    function createPOFrag(oController) {
            _initFragmentDialog(oController,
                "zdemo.zdemopo00.ext.controller.CreatePO")
            .then(function(oDialog) { 

                setModel(oController);
                oController._CurrentDialog = oDialog;
                oController._CurrentDialog.open();
            }.bind(oController));

    }

    function _initFragmentDialog(that, sFramentPath){

          if(that._controller) that = that._controller;

          if(that._CurrentDialog){
              that._CurrentDialog.destroy(true);
          }

          return that.loadFragment({ name: sFramentPath });

    }

    function setModel(oController) {
            debugger;
            var oDate = new Date(),
                oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd"
                });

            var oModelPost = oController.getView().getModel("mPostData");
            if (oModelPost) {
                oModelPost.setProperty("/PurchaseOrder", "");
                oModelPost.setProperty("/CompanyCode", "1000");
                oModelPost.setProperty("/PurchaseOrderType", "P401");
                oModelPost.setProperty("/PurchaseOrderDeletionCode", "");
                oModelPost.setProperty("/CreationDate", oDateFormat.format(oDate));
                oModelPost.setProperty("/CreatedByUser", "");
                oModelPost.setProperty("/Supplier", "50001");
                oModelPost.setProperty("/DocumentCurrency", "THB");
                oModelPost.setProperty("/SubjectToRelease", "");
                oModelPost.setProperty("/Items", [{ Plant : "",
                                                    Material : "",
                                                    OrderQuantity : parseInt(0),
                                                    OrderQuantityUnit : "PC",
                                                    NetAmount : parseInt(0),
                                                    DocumentCurrency : "THB"  
                                                }]);
            } else {
                var oPostData = new JSONModel({
                    PurchaseOrder : "",
                    CompanyCode : "1000",
                    PurchaseOrderType : "P401",
                    PurchaseOrderDeletionCode : "",
                    CreationDate : oDateFormat.format(oDate),
                    CreatedByUser : "",                
                    Supplier : "50001",
                    DocumentCurrency : "THB",
                    SubjectToRelease : "",
                    Items: [{ Plant : "",
                              Material : "",
                              OrderQuantity : parseInt(0),
                              OrderQuantityUnit : "PC",
                              NetAmount : parseInt(0),
                              DocumentCurrency : "THB"  
                    }]
                });
                oController.getView().setModel(oPostData, "mPostData");
            }
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

            createPOFrag(this._controller);

            // var sWarningMessage = "Do you want to create a Purchase Order ? ";
            //     MessageBox.confirm(sWarningMessage, {
            //         onClose: async function (btnAction) {
            //             if (btnAction == "OK") {
            //                 await postCreatePO(this._controller);
            //                 this._controller.extensionAPI.refresh();
            //             } else if (btnAction == "CANCEL") 
            //                 //
            //                 this.getView().setBusy(false);
            //         }.bind(this)
            //     });
            
        }        
    };
});
