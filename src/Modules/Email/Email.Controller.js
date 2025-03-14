import Email from "./EmailModel.js";
import { createEmailSchema } from "./validation.js";
import createHttpError from "http-errors";


async function index(req,res,next){

    try {
 
        const {page,limit} = req.query;

        const offset = (page - 1) * limit;

        const emails = await Email.findAll({
            offset,
            limit
        });

        res.status(200).json({
            success: true,
            message: "Emails fetched successfully",
            emails
        });
        
    } catch (error) {
        next(error);
    }   

}


async function show(req,res,next){

    try {
        
        const email = await Email.findByPk(req.params.id);
        if(!email) return next(createHttpError.NotFound("Email not found"));

        res.status(200).json({
            success: true,
            message: "Email fetched successfully",
            email
        });

    } catch (error) {
        next(error);
    }
}


async function create(req,res,next){

    try {
 
        const {error} = createEmailSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const email = await Email.create(req.body);

        res.status(201).json({
            success: true,
            message: "Email created successfully",
            email
        });

    } catch (error) {
        next(error);
    }
}



async function update(req,res,next){

    try {

        const {error} = createEmailSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const email = await Email.findByPk(req.params.id);
        if(!email) return next(createHttpError.NotFound("Email not found"));

        await email.update(req.body);

    } catch (error) {
        next(error);
    }
}   


async function destroy(req,res,next){

    try {
    
        const email = await Email.findByPk(req.params.id);
        if(!email) return next(createHttpError.NotFound("Email not found"));

        await email.destroy();

        res.status(200).json({
            success: true,
            message: "Email deleted successfully",
        });

    } catch (error) {
        next(error);
    }
}


async function change_status(req,res,next){

    try {
        
        const email = await Email.findByPk(req.params.id);
        if(!email) return next(createHttpError.NotFound("Email not found"));

        await email.update({status: email.status === 1 ? 0 : 1});

        res.status(200).json({
            success: true,
            message: "Email status updated successfully",
        });

    } catch (error) {
        next(error);
    }
}


export{
    index,
    show,
    create,
    update,
    destroy,
    change_status
}



