import Faq from "./FaqModel.js";
import FaqCategory from "../FaqCategory/FaqCategoryModel.js";
import { FaqSchema } from "./validation.js";
import createHttpError from "http-errors";
import { makeSlug } from "../../Helpers/Helper.js";


async function index(req,res,next){

    try {
    
        const faqs = await Faq.findAll();

        res.status(200).json({
            success: true,
            message: "Faqs fetched successfully",
            faqs
        });
        
    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {

        const faq = await Faq.findOne({where: {slug: req.params.slug}});
        if(!faq) return next(createHttpError.NotFound("Faq not found"));

        res.status(200).json({
            success: true,
            message: "Faq fetched successfully",
            faq
        });

    } catch (error) {
        next(error);
    }
}


async function create(req,res,next){

    try {
     
        const {name,status,answer,category_id} = req.body;

        const { error } = FaqSchema.validate(req.body);
        
        if (error) throw new createHttpError.BadRequest(error.details[0].message);

        const faqCategory = await FaqCategory.findByPk(category_id);
        if(!faqCategory) return next(createHttpError.NotFound("Faq category not found"));

        const faq = await Faq.create({
            name,
            status,
            answer,
            category_id,
            slug: await makeSlug(name, "faqs")
        });

        res.status(201).json({
            success: true,
            faq,
            message: 'Faq Created Successfully'
        });

    } catch (error) {
        next(error);
    }

}


async function update(req,res,next){

    try {
 
        const {error} = FaqSchema.validate(req.body);
        if(error) {
            return res.status(400).json({
                success:false,
                message:error.message
            })
        }
        const faq = await Faq.findOne({where: {slug: req.params.slug}});
        if(!faq) return next(createHttpError.NotFound("Faq not found"));

        const faqCategory = await FaqCategory.findByPk(req.body.category_id);
        if(!faqCategory) return next(createHttpError.NotFound("Faq category not found"));

        await faq.update(req.body);

        res.status(200).json({
            success: true,
            message: "Faq updated successfully",
        });

    } catch (error) {
        next(error);
    }
}


async function destroy(req,res,next){

    try {
    
        const faq = await Faq.findOne({where: {slug: req.params.slug}});
        if(!faq) return next(createHttpError.NotFound("Faq not found"));

        await faq.destroy();

        res.status(200).json({
            success: true,
            message: "Faq deleted successfully",
        });

    } catch (error) {
        next(error);
    }
}


async function changeStatus(req,res,next){

    try {
        
        const faq = await Faq.findOne({where: {slug: req.params.slug}});
        if(!faq) return next(createHttpError.NotFound("Faq not found"));

        await faq.update({status: faq.status === 1 ? 0 : 1});

        res.status(200).json({
            success: true,
            message: "Faq status updated successfully",
        });

    } catch (error) {
        next(error);
    }
}


export {
    index,
    show,
    create,
    update,
    destroy,
    changeStatus 
}