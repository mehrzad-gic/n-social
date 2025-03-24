import { makeSlug } from "../../Helpers/Helper.js";
import Tag from "./TagModel.js";
import { tagCreateSchema, tagUpdateSchema } from "./validation.js";
import Post from "../Post/PostModel.js";
import createHttpError from "http-errors";
import PostTag from "../PostTag/PostTagModel.js";


async function index(req, res, next) {

    try {

        const all = await Tag.findAll();
        res.status(200).json({ message: 'All tags', success: true, data: all });

    } catch (error) {
        next(error);
    }

}


async function create(req, res, next) {

    try {

        const { name, status } = req.body;

        await tagCreateSchema.validate({ name, status });
        const slug = await makeSlug(name, 'tags');

        const tag = await Tag.create({ name, status, slug });
        res.status(201).json({ message: 'Tag created', success: true, data: tag });

    } catch (error) {
        next(error);
    }

}


async function show(req, res, next) {

    try {

        const { slug } = req.params;

        const tag = await Tag.findOne({ where: { slug } });

        res.status(200).json({ message: 'Tag', success: true, data: tag });

    } catch (error) {
        next(error);
    }

}


async function update(req, res, next) {

    try {

        const { slug } = req.params;
        const { name, status } = req.body;
        await tagUpdateSchema.validate({ name, status });
        const tag = await Tag.update({ name, status }, { where: { slug } });
        res.status(200).json({ message: 'Tag updated', success: true, data: tag });

    } catch (error) {
        next(error);
    }

}

async function destroy(req, res, next) {

    try {

        const { slug } = req.params;
        const tag = await Tag.findOne({where:{slug:slug}});
        if(!tag) throw new createHttpError.NotFound('Tag Not Found');
        await tag.destroy();
        res.status(200).json({ message: 'Tag deleted', success: true, data: tag });

    } catch (error) {
        next(error);
    }

}


async function changeStatus(req, res, next) {

    try {

        const { slug } = req.params;
        const tag = await Tag.findOne({ where: { slug } });
        tag.status = tag.status === 1 ? 0 : 1;
        await tag.save();
        res.status(200).json({ message: 'Tag status changed', success: true, data: tag });

    } catch (error) {
        next(error);
    }
    
}


async function tag_posts(req,res,next){

    try {

        const {slug} = req.params;

        const tag = await Tag.findOne({where: {slug}});

        if(!tag) return next(createHttpError.NotFound('Tag not found'));
       
        const posts = await PostTag.findAll({
            where: {tag_id: tag.id},
            include: [{model: Post, attributes: ['id','name','slug','img','imgs','text']}]
        });
       
        res.status(200).json({message: 'Tag posts', success: true, data: posts});

    } catch (error) {
        next(error);
    }
}



export {
    show,
    create,
    index,
    destroy,
    update,
    changeStatus,
    tag_posts
};