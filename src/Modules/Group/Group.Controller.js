import Group from './GroupModel.js';
import { Op } from 'sequelize';
import UploadQueue from '../../Queues/UpoladQueue.js';
import createHttpError from 'http-errors';
import { createGroupSchema,updateGroupSchema } from './validation.js';



async function index(req,res,next) {

    try {
    
        const {page,limit,status,search} = req.query;
        const offset = (page - 1) * limit;

        const groups = await Group.findAll({
            limit:limit,
            offset:offset,
            attributes:['id','name','des','img','status','type','createdAt','updatedAt'],
            include:[
                {
                    model:User,
                    as:'user',
                    attributes:['id','name','email','slug','img']
                }
            ],
            where:{
                status:status ? parseInt(status) : {
                    [Op.in]:[0,1]
                },
                name:{
                    [Op.like]:`%${search}%`
                }
            }
        });

        res.json({
            success:true,
            groups,
            message:"Groups fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        
    }
}


async function create(req,res,next) {

    try {
        
        const {error} = createGroupSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const group = await Group.create({
            name:req.body.name,
            des:req.body.des,
            status:req.body.status ? parseInt(req.body.status) : 1,
            type:req.body.type ? parseInt(req.body.type) : 0,
            user_id:req.session.user.id,
        });

        if(req.file) await UploadQueue.add('uploadFile',{file:req.file,table:'groups',img_field:'img',data:group});

        res.json({
            success:true,
            group,
            message:"Group created successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error);
    }

}


async function update(req,res,next) {

    try {

        const {error} = updateGroupSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const group = await Group.findByPk(req.params.id);
        if(!group) return next(createHttpError.NotFound("Group not found"));

        await group.update({
            name:req.body.name,
            des:req.body.des,
            status:req.body.status ? parseInt(req.body.status) : 1,
            type:req.body.type ? parseInt(req.body.type) : 0,
        });

        if(req.file) {
            await UploadQueue.add('deleteFile',{file:group.img});
            await UploadQueue.add('uploadFile',{file:req.file,table:'groups',img_field:'img',data:group});
        }
        
        res.json({
            success:true,
            group,
            message:"Group updated successfully",
            token:req.session.token,
            user:req.session.user,
        })

    } catch (error) {
        next(error);
    }

}


async function destroy(req,res,next) {

    try {

        const group = await Group.findByPk(req.params.id);
        if(!group) return next(createHttpError.NotFound("Group not found"));

        await group.destroy();

        await UploadQueue.add('deleteFile',{file:group.img});

        res.json({
            success:true,
            message:"Group deleted successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
        
    } catch (error) {
        next(error)       
    }

}


async function show(req,res,next) {

    try {
        
        const group = await Group.findByPk(req.params.id,{
            attributes:['id','name','des','img','status','type','createdAt','updatedAt'],
            include:[
                {
                    model:User,
                    as:'user',
                    attributes:['id','name','email','slug','img']
                }
            ]
        });

        if(!group) return next(createHttpError.NotFound("Group not found"));
        res.json({
            success:true,
            group,
            message:"Group fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error)       
    }

}


async function change_status(req,res,next) {
    
    try {
    
        const group = await Group.findByPk(req.params.id);
        if(!group) return next(createHttpError.NotFound("Group not found"));

        await group.update({
            status:group.status == 1 ? 0 : 1,
        });

        res.json({
            success:true,
            group,
            message:"Group status updated successfully",
            token:req.session.token,
            user:req.session.user,
        })

    } catch (error) {
        next(error)       
    }

}


export default {
    index,
    create,
    update,
    destroy,
    show,
    change_status
}