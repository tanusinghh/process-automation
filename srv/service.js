const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

module.exports = cds.service.impl(async function () {
  this.on('uploadImage', async (req) => {
    const { FileName, screenImg, mediaType } = req.data;

    // Validate inputs
    if (!FileName || !screenImg || !mediaType) {
      return req.reject(400, 'FileName, screenImg, and mediaType are required.');
    }

    // Check if the uploaded file is an image
    const allowedMediaTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMediaTypes.includes(mediaType)) {
      return req.reject(400, 'Only image files (JPEG, PNG, GIF) are accepted.');
    }

    // Define the path to save the PDF
    const uploadDir = path.join(__dirname, '../uploads');
    const pdfFilePath = path.join(uploadDir, FileName.replace(/\.[^/.]+$/, ".pdf")); // Replace file extension with .pdf

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(screenImg, 'base64');

    try {
      // Check if buffer is a valid image before proceeding
      if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error('Invalid image buffer.');
      }

      // Initialize a new PDF document
      const pdfDoc = new PDFDocument();
      const pdfStream = fs.createWriteStream(pdfFilePath);
      pdfDoc.pipe(pdfStream);

      // Add the image to the PDF
      pdfDoc.image(imageBuffer, 0, 0, { fit: [500, 700] });

      // Finalize the PDF file
      pdfDoc.end();

      // Wait for the PDF file to be fully written
      await new Promise((resolve, reject) => {
        pdfStream.on('finish', resolve);
        pdfStream.on('error', reject);
      });

      return `PDF created successfully and saved as ${pdfFilePath}`;

    } catch (error) {
      console.error('Error processing the image file:', error);
      return req.reject(500, `Error processing the image file: ${error.message}`);
    }
  });
});




