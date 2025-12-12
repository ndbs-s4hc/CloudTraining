sap.ui.define([
    "zdemo/zfreestylepo00/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
    "use strict";

    return Controller.extend("zdemo.zfreestylepo00.controller.Post", {
        onInit() {
            this.getRouter().getRoute("PostRO").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function(oEvent) {
            debugger;
            this.setModel();
            
        },

        setModel: function () {
            debugger;
            var oDate = new Date(),
                oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd"
                });

            var oModelPost = this.getView().getModel("mPostData");
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
                this.getView().setModel(oPostData, "mPostData");
            }
        },

        onAddItem: function(oEvent){
            var aPostData = this.getView().getModel("mPostData").getProperty("/");
            aPostData.Items.push({Plant : "",
                              Material : "",
                              OrderQuantity : parseInt(0),
                              OrderQuantityUnit : "PC",
                              NetAmount : parseInt(0),
                              DocumentCurrency : "THB"  
                    });
            this.getView().getModel("mPostData").setProperty("/", aPostData);
        },

        onPostData: function(oEvent){
            debugger;

            var sWarningMessage = "Do you want to create a Purchase Order ? ";
                MessageBox.confirm(sWarningMessage, {
                    onClose: function (btnAction) {
                        if (btnAction == "OK") {
                            this.prepareJSONPost();
                        } else if (btnAction == "CANCEL") 
                            //
                            this.getView().setBusy(false);
                    }.bind(this)
                });
        },

        prepareJSONPost: function(){
            debugger;           
            var aPostData = this.getView().getModel("mPostData").getProperty("/"),
                sPath = "/sap/opu/odata4/sap/zsb_purchaseorder_00_v4/srvd/sap/zsd_purchaseorder_00/0001/ZC_PurchaseOrderHead00_S01/com.sap.gateway.srvd.zsd_purchaseorder_00.v0001.CreatePO";

            this._oBody = {
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
                this._oBody._Item.push({ Plant : aPostData.Items[i].Plant,
                                         Material : aPostData.Items[i].Material,
                                         OrderQuantity : parseInt(aPostData.Items[i].OrderQuantity),
                                         OrderQuantityUnit : "PC",
                                         NetAmount : parseInt(aPostData.Items[i].NetAmount),
                                         DocumentCurrency : "THB"  
                                        });
            }

            this.getView().getModel().securityTokenAvailable().then(
                function (sToken) {
                    this.postODataV4(sPath, sToken, this._oBody, this._onPostSuccess, this._onPostError, this);
                }.bind(this));
        },

        postODataV4: function(sPath, tToken, objJSON, fnSuccess, fnError, that) {
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
        },

        _onPostSuccess: function(oData, sStatus, oResponse) {
            debugger;
            var sSuccessMessage = "Purchase Order: " + oResponse.responseJSON.PurchaseOrder + " has been created.";
            MessageBox.success(sSuccessMessage, {
                    onClose: function (btnAction) {
                        if (btnAction == "OK") {
                            this.onNavBack();
                        }
                    }.bind(this)
                });

        },

        _onPostError: function(oData) {
            debugger;
            MessageBox.error(oData.responseJSON.error.message);

        }
    });
});
