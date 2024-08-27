const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');

module.exports = cds.service.impl(async function () {
    const { CapturedScreens } = this.entities;

    this.on('uploadImage', async (req) => {
        const { FileData } = req.data;

        if (!FileData) {
            return req.error(400, 'Missing file data');
        }

        try {
            
         const buffer = Buffer.from(FileData, 'base64');

            await INSERT.into(CapturedScreens).entries({
                FileName: "example.jpg",
                screenImg: buffer,
                mediaType: 'application/octet-stream', 
            });

            return true; 
        } catch (error) {
            return req.error(500, 'Failed to upload file: ' + error.message);
        }
    });
});
