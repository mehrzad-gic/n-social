import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
import FormData from "form-data";

async function uploadToImgDB(fileBuffer, fileName, mimeType) {
    
    const formData = new FormData();
    formData.append('file', fileBuffer, {
        filename: fileName, // File name
        contentType: mimeType, // MIME type
    });


    // Send the file to ImgDB's API using fetch
    const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
        headers: {
            ...formData.getHeaders(), // Include form-data headers
            'Authorization': `Bearer ${process.env.IMGDB_API_KEY}`, // Replace with your ImgDB API key
        },
    });    

    // Parse the response as JSON
    const data = await response.json();
    return data;
}

export {
    upload,
    uploadToImgDB
};