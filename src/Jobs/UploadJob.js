import { deleteImage, uploadImages } from '../Helpers/Upload.js';
import Post from '../Modules/Post/PostModel.js';
import Company from '../Modules/Company/CompanyModel.js';
import UploadQueue from '../Queues/UpoladQueue.js';

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


export async function uploadCompany(job){

    const { img, img_bg, company } = job.data; 

    try {

        console.log('img ✅✅✅✅✅', img);
        console.log('img_bg ✅✅✅✅✅', img_bg);

        let img_bg_result = null;
        let img_result = null;

        // Log before uploading
        if(img){
            console.log('Starting upload for img:', img);
            img_result = await uploadImages(img);
            console.log('img results:', img_result);

            // delete the img file from the server with a job
            if(company.img) await deleteImage(JSON.parse(company.img).public_id);
        }

        if(img_bg){ 
            console.log('Starting upload for img_bg:', img_bg);
            img_bg_result = await uploadImages(img_bg);
            console.log('img_bg results:', img_bg_result);

            // delete the img_bg file from the server with a job
            if(company.img_bg) await deleteImage(JSON.parse(company.img_bg).public_id);
        }

        // Update the Company with the image data
        const companyUpdateResult = await Company.update(
            { img: JSON.stringify(img_result), img_bg: JSON.stringify(img_bg_result) }, 
            { where: { id: company.id } }
        );

        console.log('company update result:', companyUpdateResult);
    
        
    } catch (error) {
        console.error('Error in job processing:', error);
        throw new Error('File upload failed: ' + error.message);
    }
}


export async function deleteFile(job){

    const { file,files } = job.data;

    try {

        if(file) await deleteImage(JSON.parse(file).public_id);
    
        if(files){
            for(value of files){
                await deleteImage(value.public_id);
            }
        }
    
    } catch (error) {
        console.error('Error in job processing:', error);
        throw new Error('File upload failed: ' + error.message);
    }
}