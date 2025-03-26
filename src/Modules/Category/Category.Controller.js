import createHttpError from 'http-errors';
import Category from './CategoryModel.js';
import { createCategorySchema,updateCategorySchema } from "./validation.js";
import { makeSlug } from '../../Helpers/Helper.js';


async function index(req,res,next) {
    try {
 
        const categories = await Category.findAll();

        res.json({
            success:true,
            categories,
            message:"Categories fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error)
    }
}


async function create(req,res,next) {

    try {
        
        const {error} = createCategorySchema.validate(req.body);

        if(error) {
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }

        const slug = await makeSlug(req.body.name,'categories');

        const category = await Category.create({
            name:req.body.name,
            icon:req.body.icon, 
            slug:slug,
            status:1,
        });

        res.json({
            success:true,
            category,
            message:"Category created successfully",
        })

    } catch (error) {
        next(error)       
    }

}


async function update(req,res,next) {

    try {
        
        const {slug} = req.params;

        const category = await Category.findOne({where: {slug:slug}});

        if(!category) throw new createHttpError.NotFound("Category not found");

        const {error} = updateCategorySchema.validate(req.body);

        if(error) {
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }

        category.name = req.body.name;
        category.status = req.body.status;
        await category.save();

        res.json({
            success:true,
            category,
            message:"Category updated successfully",
            token:req.session.token,
            user:req.session.user,
        })

    } catch (error) {
        next(error)       
    }

}


async function destroy(req,res,next) {

    try {

        const {slug} = req.params;  

        const category = await Category.findOne({where: {slug:slug}});

        if(!category) throw new createHttpError.NotFound("Category not found");
        
        await category.destroy();

        res.json({
            success:true,
            category,
            message:"Category deleted successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error)       
    }

}


async function show(req,res,next) {

    try {

        const {slug} = req.params;

        const category = await Category.findOne({where: {slug:slug}});

        if(!category) throw new createHttpError.NotFound("Category not found");

        res.json({
            success:true,
            category,
            message:"Category fetched successfully",
            token:req.session.token,
            user:req.session.user,
        }) 

    } catch (error) {
        next(error)       
    }
}


async function change_status(req,res,next) {
    try {
            
        const {slug} = req.params;

        const category = await Category.findOne({where: {slug:slug}});

        if(!category) throw new createHttpError.NotFound("Category not found");

        category.status = category.status == 1 ? 0 : 1;
        await category.save();

        res.json({
            success:true,
            category,
            message:"Category status changed successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error)       
    }
}


export {
    index,
    create,
    update,
    destroy,
    show,
    change_status,
}

