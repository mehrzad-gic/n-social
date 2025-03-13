import { uploadImages } from '../Helpers/Upload.js';
import Post from '../Modules/Post/PostModel.js';

export default async (job) => {
    const { files, postId } = job.data; // Get files and postId from job data

    try {
        console.log('files ✅✅✅✅✅', files);

        // Log before uploading
        console.log('Starting upload for files:', files);
        const results = await uploadImages(files);
        console.log('Upload results:', results);

        let img = null;
        let imgs = null;
        
        // Process results based on the number of images
        if (results.length > 1) {
            imgs = JSON.stringify(results); // Store multiple images as JSON
        } else {
            img = JSON.stringify(results[0]); // Store single image
        }

        // Update the post with the image data
        const postUpdateResult = await Post.update(
            { img, imgs }, 
            { where: { id: postId } }
        );
        console.log('Post update result:', postUpdateResult);

        console.log(`Files uploaded successfully for post ID: ${postId}`);

    } catch (error) {
        console.error('Error in job processing:', error);
        throw new Error('File upload failed: ' + error.message);
    }
};
