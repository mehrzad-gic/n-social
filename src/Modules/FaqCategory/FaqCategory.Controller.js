import FaqCategory from "./FaqCategoryModel.js";
import { FaqCategorySchema } from "./validation.js";
import createHttpError from "http-errors";
import {makeSlug} from '../../Helpers/Helper.js';


async function index(req,res,next){

    try {
    
        const faqCategories = await FaqCategory.findAll();

        res.status(200).json({
            success: true,
            message: "Faq categories fetched successfully",
            faqCategories
        });

    } catch (error) {
        next(error);
    }
}


async function show(req,res,next){

    try {
        
        const faqCategory = await FaqCategory.findOne({where:{slug:req.params.slug}});
        if(!faqCategory) return next(createHttpError.NotFound("Faq category not found"));

        res.status(200).json({
            success: true,
            message: "Faq category fetched successfully",
            faqCategory
        });

    } catch (error) {
        next(error);
    }
}


async function create(req,res,next){

    try {
        
        await FaqCategorySchema.validate(req.body);

        const faqCategory = await FaqCategory.create({
            name: req.body.name,
            status: req.body.status,
            des: req.body.des,
            slug: await makeSlug(req.body.name,'faq_categories')
        });

        res.status(201).json({
            success: true,
            message: "Faq category created successfully",
            faqCategory
        });

    } catch (error) {
        next(error);
    }
}


async function update(req,res,next){

    try {
        
        await FaqCategorySchema.validate(req.body);

        const faqCategory = await FaqCategory.findOne({where:{slug:req.params.slug}});
        if(!faqCategory) return next(createHttpError.NotFound("Faq category not found"));

        await faqCategory.update(req.body);

        res.status(200).json({
            success: true,
            message: "Faq category updated successfully",
        });

    } catch (error) {
        next(error);
    }

}


async function destroy(req,res,next){

    try {

        const faqCategory = await FaqCategory.findOne({where:{slug:req.params.slug}});
        if(!faqCategory) return next(createHttpError.NotFound("Faq category not found"));

        await faqCategory.destroy();

        res.status(200).json({
            success: true,
            message: "Faq category deleted successfully",
        });

    } catch (error) {
        next(error);
    }

}


async function change_status(req,res,next){

    try {
    
        const faqCategory = await FaqCategory.findOne({where:{slug:req.params.slug}});
        if(!faqCategory) return next(createHttpError.NotFound("Faq category not found"));

        await faqCategory.update({status: faqCategory.status === 1 ? 0 : 1});

        res.status(200).json({
            success: true,
            message: "Faq category status updated successfully",
        });

    } catch (error) {
        next(error);
    }
};


export {
    index,
    show,
    create,
    update,
    destroy,
    change_status
}