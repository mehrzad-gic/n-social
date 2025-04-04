import createHttpError from "http-errors";
import User from "./UserModel.js";
// import { makeSlug } from "../../Helpers/Helper";
import { userValidation, updateInfoValidation } from "./validation.js";
import { Op } from "sequelize";
import UploadQueue from "../../Queues/UpoladQueue.js";
import { deleteFile } from "../../Jobs/UploadJob.js";
import { makeSlug } from "../../Helpers/Helper.js";
import { makeHashPassword } from "../../Helpers/Helper.js";
import Role from "../Role/RoleModel.js";
import pool from "../../Configs/Mysql2.js";
import RoleUser from "../RoleUser/RoleUserModel.js";
import sequelize from "../../Configs/Sequelize.js";


async function index(req, res, next) {

    try {

        const { page, limit, status, search, sort } = req.query; // Extract query parameters for pagination and filtering

        let where = {};
        let order = [];

        // where
        if (status) where.status = status; // Filter by status if provided
        if (search) where = {
            ...where, slug: {
                [Op.like]: `%${search}%` // Filter by slug if search term is provided, using SQL LIKE operator
            }
        }

        // Handle pagination
        const pageNumber = parseInt(page) || 1; // Default to page 1 if not provided
        const pageSize = parseInt(limit) || 10; // Default to 10 items per page if not provided
        const offset = (pageNumber - 1) * pageSize; // Calculate the offset for the query

        // order by
        order.push(['createdAt', sort ? sort : 'DESC']); // Default to descending order by createdAt if no sort is provided']);


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


    } catch (err) {
        next(err); // Pass the error to the next middleware for handling
    }

}


async function show(req, res, next) {
    try {
        const { slug } = req.params; // Extract slug from request parameters

        // Use LEFT JOIN to include users even if they have no roles
        const sql = `
        SELECT u.*, r.name as role_name, r.id as role_id 
        FROM users u 
        LEFT JOIN role_user ru ON u.id = ru.user_id 
        LEFT JOIN roles r ON ru.role_id = r.id 
        WHERE u.slug = ?
        `;
        const result = await pool.query(sql, [slug]);
        const rows = result[0]; // result[0] is the array of rows

        // Check if the user exists
        if (!rows || rows?.length === 0) {
            throw new createHttpError(404, `User with slug '${slug}' not found`);
        }

        console.log(rows); // Debug: Log the raw query result

        // Transform the flat rows into a nested structure
        const user = {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            slug: rows[0].slug,
            img: rows[0].img,
            img_bg: rows[0].img_bg,
            bio: rows[0].bio,
            github: rows[0].github,
            x: rows[0].x,
            birthday: rows[0].birthday,
            title: rows[0].title,
            status: rows[0].status,
            roles: rows
                .filter(row => row.role_id !== null) // Exclude rows where role_id is NULL (no role)
                .map(row => ({
                    id: row.role_id,
                    name: row.role_name
                }))
        };

        // Send the response with the user data
        res.status(200).json({
            message: "User retrieved successfully",
            user
        });

    } catch (err) {
        next(err); // Pass any errors to the next middleware
    }
}


async function changeStatus(req, res, next) {

    try {

        const { slug } = req.params; // Extract slug from request parameters

        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug } // Use the slug to find the user
        });

        if (!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error

        // update the status of the user
        const newUser = await user.update({
            status: user.status == 1 ? 0 : 1
        });

        // If user found, send the user details in the response
        res.status(200).json({
            message: "User retrieved successfully",
            user: newUser, // Send the user object in the response
            success: true
        });

    } catch (err) {
        next(err); // Pass the error to the next middleware for handling
    }

}


async function update(req, res, next) {

    let transaction = null;

    try {

        const { error } = userValidation.validate(req.body);
        if (error) throw createHttpError(422, error.details[0].message);
        console.log('update',req.body);

        const { slug } = req.params; // Extract slug from request parameters

        transaction = await sequelize.transaction();

        if (!slug) throw createHttpError(422, "Slug is required");
        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug: slug } // Use the slug to find the user
        });
        if (!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error


        if (req.body?.slug && req.body.slug != user.slug) {
            const userCheck = await User.findOne({
                where: { slug: req.body.slug }
            });
            if (userCheck) throw createHttpError(422, "Slug already exists");
        }

        // update the user
        const newUser = await user.update({
            name: req.body.name,
            title: req.body.title,
            github: req.body.github,
            bio: req.body.bio,
            birthday: req.body.birthday,
            slug: req.body.slug,
            x: req.body.x,
        }, { transaction });

        // attach roles to user
        if (req.body?.roles?.length > 0) {

            // delete the old roles
            await RoleUser.destroy({where:{user_id:newUser.id}}, { transaction });
          
            // attach the new roles
            for (const role of req.body.roles) {
                let checkRole = await Role.findOne({where:{id:role}})
                if (!checkRole) throw createHttpError(422, "Role not found");
                await RoleUser.create({ user_id: newUser.id, role_id: checkRole.id }, { transaction });
            }

        }

        const data = {
            id: newUser.id,
            slug: newUser.slug
        }

        // upload the req.files.img && delete the old img if exists
        if (req.files?.img && req.files.img) {

            // delete the old img if exists
            if (newUser.img){
                await UploadQueue.add('deleteFile',{file:newUser.img})
            }
          
            await UploadQueue.add('uploadFile', {
                files: req.files.img,
                table: 'users',
                img_field: 'img',
                data
            });
        }

        // upload the req.files.img_bg
        if (req?.files?.img_bg) {

            // delete the old img_bg if exists
            if (newUser.img_bg){
                await UploadQueue.add('deleteFile',{file:newUser.img_bg})
            }

            await UploadQueue.add('uploadFile', {
                files: req.files.img_bg,
                table: 'users',
                img_field: 'img_bg',
                data
            });

        }

        // commit the transaction
        await transaction.commit();

        // If user found, send the user details in the response
        res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: newUser // Send the user object in the response,
            // token: req.session.token
        });

    } catch (err) {

        if (transaction && transaction !== null) await transaction.rollback();
        next(err); // Pass the error to the next middleware for handling
    }

}


async function updateInfo(req, res, next) {

    try {

        const { error } = updateInfoValidation.validate(req.body);
        if (error) throw createHttpError(422, error.details[0].message);

        const { slug } = req.params; // Extract slug from request parameters
        if (!slug) throw createHttpError(422, "Slug is required");
        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug } // Use the slug to find the user
        });

        if (req.body.slug != user.slug) {
            const userCheck = await User.findOne({
                where: { slug: req.body.slug }
            });
            if (userCheck) throw createHttpError(422, "Slug already exists");
        }

        if (!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error

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

        // upload the req.files.img && delete the old img if exists
        if (req.files?.img && req.files.img) {

            // delete the old img if exists
            if (user.img) await deleteFile({data:{file:user.img}});
          
            await UploadQueue.add('uploadFile', {
                files: req.files.img,
                table: 'users',
                img_field: 'img',
                data
            });
        }

        // upload the req.files.img_bg
        if (req?.files?.img_bg) {

            // delete the old img_bg if exists
            if (user.img_bg){
                await UploadQueue.add('deleteFile',{file:user.img_bg})
            }

            await UploadQueue.add('uploadFile', {
                files: req.files.img_bg[0],
                table: 'users',
                img_field: 'img_bg',
                data
            });

        }

        // If user found, send the user details in the response
        res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: newUser // Send the user object in the response,
            // token: req.session.token
        });

    } catch (err) {

        next(err); // Pass the error to the next middleware for handling
    }

}


async function destroy(req, res, next) {

    try {

        const { slug } = req.params; // Extract slug from request parameters

        // Find the user by slug in the database
        const user = await User.findOne({
            where: { slug } // Use the slug to find the user
        });

        if (!user) throw createHttpError(404, `User with slug '${slug}' not found`); // If user not found, throw a 404 error

        // delete the user
        await user.destroy();

        // delete user imgs
        if (user.img) await deleteFile(user.img);
        if (user.img_bg) await deleteFile(user.img_bg);


        // If user found, send the user details in the response
        res.status(200).json({
            message: "User deleted successfully",
        });

    } catch (error) {
        next(error);
    }
}


export async function create(req, res, next) {

    let transaction = null;

    try {

        const { name, title, roles, password, bio, img, img_bg, birthday, email } = req.body;
        console.log('create',req.body);  

        // check if user already exist
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) throw new createHttpError.Conflict('User Already Exists');

        // transaction
        transaction = await sequelize.transaction();

        // create user
        const newUser = await User.create({
            name, 
            email,
            slug: await makeSlug(name, 'users'),
            password: await makeHashPassword(password),
            title,
            bio,
            birthday,
        }, { transaction });

        // attach roles to user
        if (roles && roles?.length > 0) {
            for (const role of roles) {
                let checkRole = await Role.findOne({where:{id:role}})
                if (!checkRole) throw createHttpError(422, "Role not found");
                await RoleUser.create({ user_id: newUser.id, role_id: checkRole.id }, { transaction });
            }
        }

        const data = {
            id: newUser.id,
            slug: newUser.slug
        }

        // create user img
        if (img) {
            await UploadQueue.add('uploadFile', {
                file: img,
                table: 'users',
                img_field: 'img',
                data
            });
        }

        // create user img_bg
        if (img_bg) {
            await UploadQueue.add('uploadFile', {
                file: img_bg,
                table: 'users',
                img_field: 'img_bg',
                data
            });
        }

        // commit the transaction
        await transaction.commit();

        // send the response
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
            success: true
        });


    } catch (err) {

        // rollback the transaction
        if (transaction && transaction !== null) await transaction.rollback();

        console.log(err);
        next(err);
    }

}


export { index, show, changeStatus, update, updateInfo, destroy };