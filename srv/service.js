const cds = require('@sap/cds');
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

module.exports = cds.service.impl(async function () {
  this.on('uploadImage', async (req) => {
    const { FileName, ScreenImg, MediaType } = req.data;

    // Validate inputs
    if (!FileName || !ScreenImg || !MediaType || !Array.isArray(ScreenImg) || !Array.isArray(MediaType) || ScreenImg.length !== MediaType.length) {
      return req.reject(400, 'FileName, ScreenImg (array of base64 strings), and MediaType (array of strings) are required and must be of the same length.');
    }

    // Initialize a new PDF document
    const pdfDoc = new PDFDocument();
    const passThroughStream = new PassThrough();
    pdfDoc.pipe(passThroughStream);

    try {
      const margin = 50;
      let yPosition = margin;

      for (let i = 0; i < ScreenImg.length; i++) {
        const imageBase64 = ScreenImg[i];
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const mediaType = MediaType[i];

        const allowedMediaTypes = ['image/jpeg', 'image/png','image/jpg','image/gif'];
        if (!allowedMediaTypes.includes(mediaType)) {
          throw new Error(`Only image files (JPEG, PNG, GIF) are accepted. Invalid type: ${mediaType}`);
        }

        if (!imageBuffer || imageBuffer.length === 0) {
          throw new Error('Invalid image buffer.');
        }

        if (yPosition > pdfDoc.page.height - margin) {
          pdfDoc.addPage(); // Add a new page if the current page is full
          yPosition = margin; // Reset yPosition for the new page
        }

        pdfDoc.image(imageBuffer, margin, yPosition, { fit: [pdfDoc.page.width - 2 * margin, 700] });
        yPosition += 700; // Move the yPosition down for the next image

        if (yPosition > pdfDoc.page.height - margin) {
          pdfDoc.addPage(); // Add a new page if needed
          yPosition = margin;
        }
      }

      pdfDoc.end();

      // Collect the PDF data from the PassThrough stream
      const pdfBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        passThroughStream.on('data', chunk => chunks.push(chunk));
        passThroughStream.on('end', () => resolve(Buffer.concat(chunks)));
        passThroughStream.on('error', reject);
      });

      // Encode PDF buffer to Base64
      const pdfBase64 = pdfBuffer.toString('base64');

      return { pdfBase64 };

    } catch (error) {
      console.error('Error processing the image files:', error);
      return req.reject(500, `Error processing the image files: ${error.message}`);
    }
  });
});
