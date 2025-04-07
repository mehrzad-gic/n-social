import Group from './GroupModel.js';
import { Op } from 'sequelize';
import UploadQueue from '../../Queues/UpoladQueue.js';
import createHttpError from 'http-errors';
import { createGroupSchema,updateGroupSchema } from './validation.js';
import { makeSlug } from '../../Helpers/Helper.js';
import User from '../User/UserModel.js';
import Post from '../Post/PostModel.js';
import GroupMember from '../GroupMember/GroupMemberModel.js';


async function index(req,res,next) {

    try {
    
        const {page,limit,status,search} = req.query;
        const offset = (page - 1) * limit;

        const groups = await Group.findAll({
            limit:limit ? parseInt(limit) : 20,
            offset:offset ? parseInt(offset) : 0,
            attributes:['id','name','members','des','img','status','slug','type','createdAt','updatedAt'],
            where:{
                status:status ? parseInt(status) : {
                    [Op.in]:[0,1]
                },
                name:{
                    [Op.like]:`%${search || ''}%`
                }
            },
        });
        console.log(groups);
        
        res.json({
            success:true,
            groups,
            message:"Groups fetched successfully",
        })
        
    } catch (error) {
        
    }
}


async function create(req,res,next) {

    try {
        
        const {error} = createGroupSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.details[0].message));

        let slug = null;
        if(req.body.slug) {
            const group = await Group.findOne({where:{slug:req.body.slug}});
            if(group) return next(createHttpError.BadRequest("Slug already exists"));
            slug = req.body.slug;
        } else {
            slug = await makeSlug(req.body.name,'groups');
        }

        const group = await Group.create({
            name:req.body.name,
            slug:slug,
            des:req.body.des,
            status:req.body.status ? parseInt(req.body.status) : 1,
            type:req.body.type ? parseInt(req.body.type) : 0,
            user_id:req.session.user.id,
        });

        if(req.file){
            await UploadQueue.add('uploadFile',{
                files:req.file,table:'groups',img_field:'img',data:group
            });
        } else {
            throw createHttpError.BadRequest("Image is required");
        }

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
        if(error) return next(createHttpError.BadRequest(error.details[0].message));

        const group = await Group.findOne({where:{slug:req.params.slug}});
        if(!group) return next(createHttpError.NotFound("Group not found"));

        let slug = group.slug;
        if(req.body.slug && req.body.slug != group.slug) {
            const group = await Group.findOne({where:{slug:req.body.slug}});
            if(group) return next(createHttpError.BadRequest("Slug already exists"));
            slug = req.body.slug;
        }

        if(!slug) throw createHttpError.BadRequest("Slug is required");

        await group.update({
            slug:slug,
            name:req.body.name,
            des:req.body.des,
            status:req.body.status ? parseInt(req.body.status) : 1,
            type:req.body.type ? parseInt(req.body.type) : 0,
        });

        if(req.file) {
            await UploadQueue.add('deleteFile',{file:group.img});
            await UploadQueue.add('uploadFile',{files:req.file,table:'groups',img_field:'img',data:group});
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

        const group = await Group.findOne({where:{slug:req.params.slug}});
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
        
        const group = await Group.findOne({
            where:{slug:req.params.slug},
            attributes:['id','name','des','img','status','slug','type','createdAt','updatedAt'],
            include:[
                {
                    model:User,
                    attributes:['id','name','email','slug','img']
                }
            ]
        });

        if(!group) return next(createHttpError.NotFound("Group not found"));
        res.json({
            success:true,
            group,
            message:"Group fetched successfully",
        })
        
    } catch (error) {
        next(error)       
    }

}


async function change_status(req,res,next) {
    
    try {
    
        const group = await Group.findOne({where:{slug:req.params.slug}});
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


async function posts(req,res,next) {

    try {
     
        const group = await Group.findOne({where:{slug:req.params.slug}});
        if(!group) return next(createHttpError.NotFound("Group not found"));

        const posts = await Post.findAll({where:{group_id:group.id}});

        res.json({  
            success:true,
            posts,
            message:"Posts fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error)
    }
}


async function members(req,res,next) {

    try {
        
        const group = await Group.findOne({where:{slug:req.params.slug}});
        if(!group) return next(createHttpError.NotFound("Group not found"));

        const members = await GroupMember.findAll({where:{group_id:group.id}});
        
        res.json({
            success:true,
            members,
            message:"Members fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error)
    }
}


async function add_member(req,res,next) {

    try {

        const {user_slug} = req.body;
        if(!user_slug) return next(createHttpError.BadRequest("User slug is required"));

        const user = await User.findOne({where:{slug:user_slug}});
        if(!user) return next(createHttpError.NotFound("User not found"));

        const group = await Group.findOne({where:{slug:req.params.slug}});
        if(!group) return next(createHttpError.NotFound("Group not found"));

        const member = await GroupMember.create({
            user_id:user.id,
            group_id:group.id,
            status:1,
        });

        res.json({
            success:true,
            member,
            message:"Member added successfully",
        })
        

    } catch (error) {
        next(error)
    }
}


async function remove_member(req,res,next) {

    try {

        const {user_slug} = req.body;
        if(!user_slug) return next(createHttpError.BadRequest("User slug is required"));

        const user = await User.findOne({where:{slug:user_slug}});
        if(!user) return next(createHttpError.NotFound("User not found"));

        const group = await Group.findOne({where:{slug:req.params.slug}});
        if(!group) return next(createHttpError.NotFound("Group not found"));

        await GroupMember.destroy({where:{user_id:user.id,group_id:group.id}});
        
        res.json({
            success:true,
            message:"Member removed successfully",
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
    posts,
    members,
    add_member,
    remove_member
}