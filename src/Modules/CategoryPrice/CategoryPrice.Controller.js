import CategoryPrice from "./CategoryPriceModel.js";
import { categoryPriceSchema } from "./validation.js";
import createError from "http-errors";
import Category from "../Category/CategoryModel.js";


async function create(req, res, next) {

    try {
        
        const {name, min, max, status, category_id} = req.body;

        const {error} = categoryPriceSchema.validate(req.body);
        if(error) throw createError.BadRequest(error.message);

        const category = await Category.findByPk(category_id);
        if(!category) throw createError.NotFound("Category not found");

        const categoryPrice = await CategoryPrice.create({name, min, max, status, category_id});

        res.status(200).json({
            message: "Category price created successfully",
            categoryPrice,
            status: true
        });

    } catch (error) {
        next(error);
    }

}


async function update(req, res, next) {

    try {
    
        const {id} = req.params;
        const {name, min, max, status, category_id} = req.body;
        const {error} = categoryPriceSchema.validate(req.body);
        if(error) throw createError.BadRequest(error.message);

        const categoryPrice = await CategoryPrice.findByPk(id);
        if(!categoryPrice) throw createError.NotFound("Category price not found");

        const category = await Category.findByPk(category_id);
        if(!category) throw createError.NotFound("Category not found");

        await categoryPrice.update({name, min, max, status, category_id});

        res.status(200).json({
            message: "Category price updated successfully",
            status: true
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
        });
   
    } catch (error) {
        next(error);
    }

}


async function index(req, res, next) {

    try {
        
        const {page, limit,status} = req.query;
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
            status: true
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
            status: true
        });

    } catch (error) {
        next(error);
    }
}


export { create, update, show, index, destroy, changeStatus };

