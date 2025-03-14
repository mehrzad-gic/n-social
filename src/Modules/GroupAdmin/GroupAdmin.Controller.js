import GroupAdmin from './GroupAdminModel.js';
import { groupAdminSchema } from './validation.js';
import createHttpError from 'http-errors';
import { Op } from 'sequelize';
import Group from '../Group/GroupModel.js';
import User from '../User/UserModel.js';


async function index(req,res,next){

    try {
        
        const groupAdmins = await GroupAdmin.findAll({
            include:[
                {
                    model:User,
                    as:'user'
                },
                {
                    model:Group,
                    as:'group'
                }
            ]
        })
        
        res.json({
            success:true,
            groupAdmins,
            message:"Group admins fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error);
    }
}



async function create(req,res,next){

    try {
        
        const {error} = groupAdminSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const group = await Group.findByPk(req.body.group_id);
        if(!group) return next(createHttpError.NotFound("Group not found"));

        const user = await User.findByPk(req.body.user_id);
        if(!user) return next(createHttpError.NotFound("User not found"));

        const groupAdmin = await GroupAdmin.create({
            user_id:req.session.user.id,
            type:req.body.type ? parseInt(req.body.type) : 0,
            status:req.body.status ? parseInt(req.body.status) : 1,
            group_id:req.body.group_id,
        });

        res.json({
            success:true,
            groupAdmin,
            message:"Group admin created successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error);
    }
}


async function update(req,res,next){

    try {
        
        const {error} = groupAdminSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const groupAdmin = await GroupAdmin.findByPk(req.params.id);
        if(!groupAdmin) return next(createHttpError.NotFound("Group admin not found"));

        await groupAdmin.update({
            type:req.body.type ? parseInt(req.body.type) : 0,
            status:req.body.status ? parseInt(req.body.status) : 1,
        });

        res.json({
            success:true,
            groupAdmin,
            message:"Group admin updated successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error);
    }
}


async function destroy(req,res,next){

    try {
        
        const groupAdmin = await GroupAdmin.findByPk(req.params.id);
        if(!groupAdmin) return next(createHttpError.NotFound("Group admin not found"));

        await groupAdmin.destroy();

        res.json({
            success:true,
            message:"Group admin deleted successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error);
    }
}


async function show(req,res,next){

    try {
        
        const groupAdmin = await GroupAdmin.findByPk(req.params.id,{
            include:[
                {
                    model:User,
                    as:'user'
                },
                {
                    model:Group,
                    as:'group'
                }
            ]
        });

        if(!groupAdmin) return next(createHttpError.NotFound("Group admin not found"));

        res.json({
            success:true,
            groupAdmin,
            message:"Group admin fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error);       
    }
}


async function change_status(req,res,next){

    try {
        
        const groupAdmin = await GroupAdmin.findByPk(req.params.id);
        if(!groupAdmin) return next(createHttpError.NotFound("Group admin not found"));

        await groupAdmin.update({
            status:groupAdmin.status == 1 ? 0 : 1,
        });

        res.json({
            success:true,
            groupAdmin,
            message:"Group admin status updated successfully",
            token:req.session.token,
            user:req.session.user,
        })

    } catch (error) {
        next(error);
    }
}


async function get_group_admins(req,res,next){

    try {
 
        const group = await Group.findByPk(req.params.id);
        if(!group) return next(createHttpError.NotFound("Group not found"));

        const groupAdmins = await GroupAdmin.findAll({
            where:{
                group_id:req.params.id,
                status:1
            },
            include:[
                {
                    model:User,
                    as:'user',
                    attributes:['id','name','email','slug','img']
                }
            ]
        })
        
        res.json({
            success:true,
            groupAdmins,
            group,
            message:"Group admins fetched successfully",
            token:req.session.token,
            user:req.session.user,
        })
        
    } catch (error) {
        next(error);
    }
}


async function change_type(req,res,next){

    try {

        const groupAdmin = await GroupAdmin.findByPk(req.params.id);
        if(!groupAdmin) return next(createHttpError.NotFound("Group admin not found"));

        await groupAdmin.update({
            type:groupAdmin.type < 2 ?  groupAdmin.type + 1 : 0,
        });

        res.json({
            success:true,
            groupAdmin,
            message:"Group admin type updated successfully",
            token:req.session.token,
            user:req.session.user,
        })

    } catch (error) {
        next(error);
    }

}


export default {
    index,
    create,
    update,
    destroy,
    show,
    change_status,
    get_group_admins,
    change_type,
}