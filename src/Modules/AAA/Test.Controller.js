import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

async function uploadImage(req, res, next) {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Convert the file buffer to a stream
        const stream = Readable.from(req.file.buffer);

        // Upload the file to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' }, // Optional: Folder in Cloudinary
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.pipe(uploadStream);
        });

        // Return the Cloudinary response to the client
        res.json({
            message: 'File uploaded successfully',
            file: result,
        });
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
    }
}

export default {
    uploadImage
};