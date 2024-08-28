sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageStrip",
    "sap/ui/unified/FileUploader"
], function (Controller, JSONModel, MessageStrip, FileUploader) {
    "use strict";

    return Controller.extend("imgcon.imgcon.controller.imgcon", {
        onInit: function () {
            // Initialize model to hold selected images
            var oModel = new JSONModel({
                SelectedImages: [],
                MediaTypes: [],
                FileNames: []
            });
            this.getView().setModel(oModel);
        },

        onFileChange: function (oEvent) {
            var aFiles = oEvent.getParameter("files");
            var oModel = this.getView().getModel();
            var aSelectedImages = oModel.getProperty("/SelectedImages") || [];
            var aMediaTypes = oModel.getProperty("/MediaTypes") || [];
            var aFileNames = oModel.getProperty("/FileNames") || [];

            // Process selected files
            for (var i = 0; i < aFiles.length; i++) {
                var file = aFiles[i];
                var reader = new FileReader();

                reader.onload = function (e) {
                    var base64Image = e.target.result.split(',')[1]; // Extract base64 part of data URL
                    aSelectedImages.push(base64Image);
                    aMediaTypes.push(file.type);
                    aFileNames.push(file.name);

                    oModel.setProperty("/SelectedImages", aSelectedImages);
                    oModel.setProperty("/MediaTypes", aMediaTypes);
                    oModel.setProperty("/FileNames", aFileNames);
                    
                };

                reader.readAsDataURL(file);
            }
        },

        onUploadPress: async function () {
            var oModel = this.getView().getModel();
            var aSelectedImages = oModel.getProperty("/SelectedImages");
            var aMediaTypes = oModel.getProperty("/MediaTypes");
            var aFileNames = oModel.getProperty("/FileNames");

            if (aSelectedImages.length === 0) {
                this._showMessage("Please select images to upload.");
                return;
            }

            try {
                var oPayload = {
                    FileName: aFileNames, // Example filename
                    ScreenImg: aSelectedImages,
                    MediaType: aMediaTypes
                };

                var oService = "/odata/v2/img/uploadImage"; // Replace with your actual service URL
                var response = await fetch(oService, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(oPayload)
                });

                if (response.status ===404) {
                    this._showMessage("Not found.");
                    
                } else if (response.ok) {
                    oModel.setProperty("/SelectedImages", []);
                    oModel.setProperty("/MediaTypes", []);
                    oModel.setProperty("/FileNames", []);
                    var result = await response.json(); // Assuming the server returns JSON with base64 data
                    var base64Data = result.d.uploadImage.pdfBase64; // Adjust based on actual response structure
                    var fileName = "download.pdf"; // Adjust based on actual response

                    // Convert base64 to binary
                    var binaryString = window.atob(base64Data);
                    var len = binaryString.length;
                    var bytes = new Uint8Array(len);
                    for (var i = 0; i < len; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    var blob = new Blob([bytes], { type: 'application/pdf' });

                    // Create a link element
                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;

                    // Programmatically click the link to trigger download
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                } else {
                    var result = await response.text();
                    this._showMessage(result, "Error");
                }
            } catch (error) {
                this._showMessage("An error occurred: " + error.message, "Error");
            }
        },

        _showMessage: function (sText, sType) {
            var oMessageStrip = this.byId("messageStrip");
            if (!oMessageStrip) {
                oMessageStrip = new MessageStrip({
                    id: "messageStrip",
                    showCloseButton: true
                });
                this.getView().byId("messageContainer").addItem(oMessageStrip); // Ensure you have a container with id "messageContainer"
            }
            oMessageStrip.setText(sText);
            oMessageStrip.setType(sType || "Information");
            oMessageStrip.setVisible(true);
        }
    });
});
