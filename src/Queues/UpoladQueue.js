import Queue from 'bull';
import redisClient from '../Configs/Redis.js';
import UploadJob from '../Jobs/UploadJob.js';
import Post from '../Modules/Post/PostModel.js';
import createHttpError from 'http-errors';


const UploadQueue = new Queue('upload',redisClient);

// Process the queue with the upload job
UploadQueue.process(UploadJob);

UploadQueue.on('completed', async (job, result) => {
    try {
        console.log(`Job with ID ${job.id} completed successfully.`);
    } catch (error) {
        throw new createHttpError.InternalServerError(`Error updating post after upload: ${error.message}`);
    }
});


export default UploadQueue;