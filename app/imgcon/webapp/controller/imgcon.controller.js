sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("imgcon.imgcon.controller.imgcon", {
        onInit: function () {
            // Initialize the OData model when the controller is instantiated
            this._oODataModel = new ODataModel("/odata/v2/img", {
                useBatch: false, // Optional: Disable batch requests
                defaultBindingMode: "TwoWay" // Optional: Set default binding mode
            });
        },

        onFileChange: function (oEvent) {
            var aFiles = oEvent.getParameter("files");

            if (aFiles && aFiles.length > 0) {
                var oFile = aFiles[0];
                this.convertFileToBase64(oFile);
            } else {
                MessageToast.show("No files selected.");
            }
        },

        convertFileToBase64: function (oFile) {
            var reader = new FileReader();
            var that = this;

            reader.onload = function (oEvent) {
                var base64String = oEvent.target.result.split(',')[1]; // Extract base64 part from data URL
                that.uploadFile(base64String, oFile.name);
            };

            reader.readAsDataURL(oFile); // Read the file as data URL
        },

        uploadFile: function (base64String, fileName) {
            var oEntry = {
                FileData: base64String
            };

            this._oODataModel.callFunction("/uploadImage", {
                method: "POST",
                urlParameters: oEntry,
                success: function (response) {
                    MessageToast.show("File uploaded and processed successfully.");
                },
                error: function (error) {
                    MessageToast.show("File upload failed: " + error.message);
                }
            });
        }
    });
});
