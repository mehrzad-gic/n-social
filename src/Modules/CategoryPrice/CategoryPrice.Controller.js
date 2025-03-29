import CategoryPrice from "./CategoryPriceModel.js";
import { categoryPriceSchema } from "./validation.js";
import createError from "http-errors";
import Category from "../Category/CategoryModel.js";


async function create(req, res, next) {

    try {
        
        const {category} = req.params;
        if(!category) throw createError.BadRequest("Category id is required");
        const categoryExists = await Category.findOne({where: {slug: category}});
        if(!categoryExists) throw createError.NotFound("Category not found");

        const {name, min, max, status} = req.body;

        const {error} = categoryPriceSchema.validate(req.body);
        if(error) throw createError.BadRequest(error.message);

        const categoryPrice = await CategoryPrice.create({name, min, max, status, category_id: categoryExists.id});

        res.status(200).json({
            message: "Category price created successfully",
            categoryPrice,
            success: true
        });

    } catch (error) {
        next(error);
    }

}


async function update(req, res, next) {

    try {
    
        const {id} = req.params;
        const {name, min, max, status} = req.body;
        const {error} = categoryPriceSchema.validate(req.body);
        if(error) throw createError.BadRequest(error.message);

        const categoryPrice = await CategoryPrice.findByPk(id);
        if(!categoryPrice) throw createError.NotFound("Category price not found");

        await categoryPrice.update({name, min, max, status});

        res.status(200).json({
            message: "Category price updated successfully",
            success: true
        });
        
    } catch (error) {
        next(error);
    }

}   



async function show(req, res, next) {

    try {
        
        const {id} = req.params;
        const categoryPrice = await CategoryPrice.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: Category,
                    attributes: ["id", "name", "slug"]
                }
            ]
        });
        if(!categoryPrice) throw createError.NotFound("Category price not found");

        res.status(200).json({
            message: "Category price fetched successfully",
            categoryPrice,
            success: true
        });
   
    } catch (error) {
        next(error);
    }

}


async function index(req, res, next) {

    try {

        const { category } = req.params;
        if(!category) throw createError.BadRequest("Category id is required");
        const categoryExists = await Category.findOne({where: {slug: category}});
        if(!categoryExists) throw createError.NotFound("Category not found");

        const {page = 1, limit = 10, status = 1} = req.query;
        const offset = (page - 1) * limit;

        const categoryPrices = await CategoryPrice.findAll({
            where: {
                status: status
            },
            include: [
                {
                    model: Category,
                    attributes: ["id", "name", "slug"]
                }
            ],
            offset,
            limit,
            order: [
                ['createdAt', 'DESC']
            ]
        });

        res.status(200).json({
            message: "Category prices fetched successfully",
            categoryPrices,
            success: true,
        });

    } catch (error) {
        next(error);
    }

}



async function destroy(req, res, next) {

    try {
     
        const {id} = req.params;
        const categoryPrice = await CategoryPrice.findByPk(id);
        if(!categoryPrice) throw createError.NotFound("Category price not found");

        await categoryPrice.destroy();
        
        res.status(200).json({
            message: "Category price deleted successfully",
            success: true
        });
        
    } catch (error) {
        next(error);
    }

}



async function changeStatus(req, res, next) {

    try {
 
        const {id} = req.params;

        const categoryPrice = await CategoryPrice.findByPk(id);
        if(!categoryPrice) throw createError.NotFound("Category price not found");

        await categoryPrice.update({status:categoryPrice.status === 1 ? 0 : 1});

        res.status(200).json({
            message: "Category price status updated successfully",
            success: true,
        });

    } catch (error) {
        next(error);
    }
}


export { create, update, show, index, destroy, changeStatus };

