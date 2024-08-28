
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";
    return Controller.extend("my.app.controller.View1", {
        onInit: function () {
            // Initialization logic if needed
        },

        onFileChange: function (oEvent) {
            const oFiledata = oEvent.getParameter("files");
            const oFile = oFiledata[0];

            if (oFile) {
                // Proceed to upload immediately after selecting a file
                this.uploadImage(oFile);
            } else {
                MessageBox.warning("No file selected.");
            }
        },

        uploadImage: function (oFile) {
            return new Promise((resolve, reject) => {
                const oFileReader = new FileReader();

                oFileReader.onload = (oEvent) => {
                    // Extract base64 data from the result
                    let sBase64 = oEvent.target.result;

                    // Strip the base64 prefix if present
                    sBase64 = sBase64.split(',')[1];

                    const oPayload = {
                        FileName: oFile.name,
                        screenImg: sBase64,
                        mediaType: oFile.type
                    };

                    // Call backend service to store image
                    $.ajax({
                        url: "/odata/v2/img/uploadImage", // Ensure this is the correct endpoint
                        method: "POST",
                        data: JSON.stringify(oPayload),
                        contentType: "application/json",
                        success: function (data) {
                            MessageToast.show("Image uploaded successfully.");
                            resolve(data);
                        },
                        error: function (error) {
                            MessageBox.error("Error uploading image: " + error.responseText);
                            reject(error);
                        }
                    });
                };

                oFileReader.onerror = function () {
                    MessageBox.error("Error reading file.");
                    reject(new Error("Error reading file."));
                };

                // Convert file to base64
                oFileReader.readAsDataURL(oFile);
            });
        }
    });
});
