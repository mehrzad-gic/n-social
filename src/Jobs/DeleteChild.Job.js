import createHttpError from "http-errors";
import pool from "../Configs/Mysql2.js";

const DeleteChildJob = async (job) => {
    try {
        const { model, id } = job.data;
        await pool.query(`DELETE FROM ${model} WHERE parent_id = ${id}`);
        return true;
    } catch (error) {
        throw new createHttpError.InternalServerError(error.message);
    }
};

export default DeleteChildJob;
