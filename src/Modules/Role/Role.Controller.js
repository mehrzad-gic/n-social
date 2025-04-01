import { roleSchema } from './validation.js';
import createHttpError from 'http-errors';
import Role from './RoleModel.js';
import PermissionRole from '../PermissionRole/PermissionRoleModel.js';
import Permission from '../Permission/PermissionModel.js';


// create role
async function create(req,res,next){

    try {
        
        const {error} = roleSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.details[0].message));

        const role = await Role.create(req.body);

        res.status(201).json({
            success:true,
            message:'Role created successfully',
            role
        })

    } catch (error) {
        next(error);
    }

}


// all roles
async function index(req,res,next){

    try {
 
        const roles = await Role.findAll();

        res.status(200).json({
            success:true,
            message:'Roles fetched successfully',
            roles
        })
    } catch (error) {
        next(error);
    }

}


// show role
async function show(req,res,next){

    try {
 
        const role = await Role.findByPk(req.params.id);
        if(!role) return next(createHttpError.NotFound('Role not found'));

        res.status(200).json({
            success:true,
            message:'Role fetched successfully',    
            role
        })

    } catch (error) {
        next(error);
    }

}


// update role
async function update(req,res,next){

    try {

        const role = await Role.findByPk(req.params.id);
        if(!role) return next(createHttpError.NotFound('Role not found'));

        const {error} = roleSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.details[0].message));

        await role.update(req.body);

        res.status(200).json({
            success:true,
            message:'Role updated successfully',
            role
        });

    } catch (error) {
        next(error);
    }

}


// delete role
async function destroy(req,res,next){

    try {

        const role = await Role.findByPk(req.params.id);
        if(!role) return next(createHttpError.NotFound('Role not found'));

        await role.destroy();

        res.status(200).json({
            success:true,
            message:'Role deleted successfully'
        })

    } catch (error) {
        next(error);
    }


}


// change role status
async function changeStatus(req,res,next){

    try {
 
        const role = await Role.findByPk(req.params.id);
        if(!role) return next(createHttpError.NotFound('Role not found'));

        const updatedRole = await role.update({status:role.status == 1 ? 0 : 1});

        res.status(200).json({
            success:true,
            message:'Role status updated successfully',
            role : updatedRole
        })

    } catch (error) {
        next(error);
    }

}


// get permissions by role id
async function permissions(req,res,next){

    try {
        
        const role = await Role.findByPk(req.params.id);
        if(!role) return next(createHttpError.NotFound('Role not found'));

        const permissions = await PermissionRole.findAll({
            where: {role_id:role.id},
            include: [{
                model: Permission,
                attributes: ['id', 'name','des']
            }]
        });

        res.status(200).json({
            success:true,
            message:'Permissions fetched successfully',
            permissions
        })

    } catch (error) {
        next(error);
    }

}

export {create,index,show,update,destroy,changeStatus,permissions};
