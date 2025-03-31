import createHttpError from "http-errors";
import User from "./UserModel.js";
// import { makeSlug } from "../../Helpers/Helper";
import { userValidation } from "./validation.js";
import { Op } from "sequelize";
import UploadQueue from "../../Queues/UpoladQueue.js";
import { deleteFile } from "../../Jobs/UploadJob.js";


async function index(req,res,next) {

    try{

        const {page,limit,status,search,sort} = req.query; // Extract query parameters for pagination and filtering
    
        let where = {};
        let order = [];
    
        // where
        if (status) where.status = status; // Filter by status if provided
        if (search) where = {...where,slug: {
            [Op.like]: `%${search}%` // Filter by slug if search term is provided, using SQL LIKE operator
        }}    
    
        // Handle pagination
        const pageNumber = parseInt(page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(limit) || 10; // Default to 10 items per page if not provided
        const offset = (pageNumber - 1) * pageSize; // Calculate the offset for the query
    
        // order by
        order.push(['createdAt',sort ? sort : 'DESC']); // Default to descending order by createdAt if no sort is provided']);
    
    
        // Fetch users from the database with pagination and filtering
        const { rows, count } = await User.findAndCountAll({
            where,
            limit: pageSize,
            offset: offset,
            order: order, // Use the order array for sorting
        });
    
        if (!rows) return next(createHttpError(404, "No users found"));
        
        // Calculate total pages
        const totalPages = Math.ceil(count / pageSize); // Calculate total pages based on count and page size
    
        // Send the response
        res.status(200).json({
            message: "Users retrieved successfully",
            users: rows,
            totalItems: count,
            totalPages: totalPages,
            currentPage: pageNumber
        });
    

    } catch(err){
        next(err); // Pass the error to the next middleware for handling
    }

}


async function show(req,res,next) {
    
    try {

        const {slug} = req.params; // Extract slug from request parameters

        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug } // Use the slug to find the user
        });

        if(!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error

        // If user found, send the user details in the response
        res.status(200).json({
            message: "User retrieved successfully",
            user // Send the user object in the response
        });

    } catch(err){
        next(err); // Pass the error to the next middleware for handling
    }

}


async function changeStatus(req,res,next) {
    
    try {

        const {slug} = req.params; // Extract slug from request parameters

        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug } // Use the slug to find the user
        });

        if(!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error

        // update the status of the user
        const newUser = await user.update({
            status: user.status == 1 ? 0 : 1
        });

        // If user found, send the user details in the response
        res.status(200).json({
            message: "User retrieved successfully",
            user: newUser // Send the user object in the response
        });

    } catch(err){
        next(err); // Pass the error to the next middleware for handling
    }

}


async function update(req,res,next) {

    try {
        
        const {error} = userValidation.validate(req.body);
        if(error) throw createHttpError(422, error.details[0].message);

        const {slug} = req.params; // Extract slug from request parameters

        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug } // Use the slug to find the user
        });

        if(req.body.user_name != user.user_name){
            const userCheck = await User.findOne({
                where: { user_name: req.body.user_name }
            });
            if(userCheck) throw createHttpError(422, "User name already exists");
        }

        if(!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error

        // update the user
        const newUser = await user.update({
            name: req.body.name,
            title: req.body.title,
            github: req.body.github,
            bio: req.body.bio,
            birthday: req.body.birthday,
            slug: req.body.slug,
            x: req.body.x,
        });

        const data = {
            id: user.id,
            slug: user.slug
        }

        console.log(data);
        
        // upload the req.files.img && delete the old img if exists
        if (req.files?.img && req.files.img) {
            await UploadQueue.add('uploadFile',{
                file: req.files.img,
                table: 'users',
                img_field: 'img',
                data
            });
            // delete the old img if exists
            if(user.img) await deleteFile(user.img);
        }

        // upload the req.files.img_bg
        if (req?.files?.img_bg) {
            await UploadQueue.add('uploadFile',{
                file: req.files.img_bg,
                table: 'users',
                img_field: 'img_bg',    
                data
            });
            // delete the old img_bg if exists
            if(user.img_bg) await deleteFile(user.img_bg);
        }

        // If user found, send the user details in the response
        res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: newUser // Send the user object in the response,
            // token: req.session.token
        });

    } catch (err){
        
        next(err); // Pass the error to the next middleware for handling
    }

}


async function destroy(req,res,next) {

    try {
    
        const {slug} = req.params; // Extract slug from request parameters

        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug } // Use the slug to find the user
        });

        if(!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error

        // delete the user
        await user.destroy();

        // delete user imgs
        if(user.img) await deleteFile(user.img);
        if(user.img_bg) await deleteFile(user.img_bg);


        // If user found, send the user details in the response
        res.status(200).json({
            message: "User deleted successfully",
        });

    } catch (error) {
        next(error);
    }
}




export {index,show,changeStatus,update,destroy};