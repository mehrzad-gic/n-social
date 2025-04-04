import { deleteImage, uploadImages } from '../Helpers/Upload.js';
import pool from '../Configs/Mysql2.js';



export async function deleteFile(job){

    const { file,files } = job.data;

    try {

        if(file) await deleteImage(JSON.parse(file)[0].public_id);
    
        if(files){
            for(value of files){
                await deleteImage(value[0].public_id);
            }
        }
    
    } catch (error) {
        console.error('Error in job processing:', error);
        throw new Error('File upload failed: ' + error.message);
    }
}


export async function uploadFile(job) {


    const { files, table, img_field, data } = job.data;

    try {

        console.log('files',files);

        if(files.length == 0) return;
        
        const result = await uploadImages(files);

        // console.log('💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅');
        // console.log(typeof result);
        // console.log(result);
        // console.log('💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅');

        // Use backticks for table and column names
        const query = `UPDATE \`${table}\` SET \`${img_field}\` = ? WHERE id = ?`;
        await pool.query(query, [JSON.stringify(result), data.id]);

        // console.log(`File uploaded successfully for ${table} ID: ${data.id}`);
    } catch (error) {
        console.error('Error in job processing:', error);
        throw new Error('File upload failed: ' + error.message);
    }
}
