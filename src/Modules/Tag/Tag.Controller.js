import { makeSlug } from "../../Helpers/Helper";
import Tag from "./TagModel";
import { tagCreateSchema, tagUpdateSchema } from "./validation";


async function index(req, res, next) {

    try {

        const all = await Tag.findAll({where:{status:1}});
        res.status(200).json({message:'All tags',success:true,data:all});

    } catch (error) {
        next(error);
    }

}


async function create(req, res, next) {

    try {

        const {name,status} = req.body;
        await tagCreateSchema.validate({name,status});
        const slug = await makeSlug(name,'tags');
        const tag = await Tag.create({name,status,slug});
        res.status(201).json({message:'Tag created',success:true,data:tag});

    } catch (error) {
        next(error);
    }

}

async function show(req, res, next) {

    try {

        const {id} = req.params;
        const tag = await Tag.findOne({where:{id}});
        res.status(200).json({message:'Tag',success:true,data:tag});

    } catch (error) {
        next(error);
    }
}


async function update(req, res, next) {  

    try {

        const {id} = req.params;
        const {name,status} = req.body;
        await tagUpdateSchema.validate({name,status});
        const tag = await Tag.update({name,status},{where:{id}});
        res.status(200).json({message:'Tag updated',success:true,data:tag});

    } catch (error) {
        next(error);
    }
}


async function destroy(req, res, next) {

    try {

        const {id} = req.params;
        const tag = await Tag.update({status:0},{where:{id}});
        res.status(200).json({message:'Tag deleted',success:true,data:tag});

    } catch (error) {
        next(error);
    }
}


async function change_status(req, res, next) {
    
    try {

        const {id} = req.params;
        const tag = await Tag.findOne({where:{id}});
        tag.status = tag.status === 1 ? 0 : 1;
        await tag.save();
        res.status(200).json({message:'Tag status changed',success:true,data:tag});

    } catch (error) {
        next(error);
    }
}


exports = {
    show,
    create,
    index,
    destroy,
    change_status,
    update,
}