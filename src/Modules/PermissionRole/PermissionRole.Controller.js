import PermissionRole from './PermissionRoleModel.js';
import createHttpError from 'http-errors';
import Permission from '../Permission/PermissionModel.js';
import Role from '../Role/RoleModel.js';


// create permission role
async function create(req,res,next){
    
    // role id
    const {id} = req.params;

    try {
        
        const {permissions} = req.body;

        // check if permissions is array
        if(!Array.isArray(permissions)) return next(createHttpError.BadRequest('Permissions must be an array'));
        // check if permissions is not empty
        if(permissions.length === 0) return next(createHttpError.BadRequest('Permissions cannot be empty'));
        // check if permissions is array of numbers
        if(permissions.some(permission => typeof permission !== 'number')) return next(createHttpError.BadRequest('Permissions must be an array of numbers'));
        // check if permissions is array of positive numbers
        if(permissions.some(permission => permission < 0)) return next(createHttpError.BadRequest('Permissions must be an array of positive numbers'));
        // check if permissions length is less than 10
        if(permissions.length > 10) return next(createHttpError.BadRequest('Permissions cannot be more than 10'));
        // check if role exists
        const role = await Role.findByPk(id);
        if(!role) return next(createHttpError.NotFound('Role not found'));


        // attach permissions to role
        for(const permission of permissions){

            // check if permission exists
            const isPermissionExists = await Permission.findByPk(permission);
            if(!isPermissionExists) return next(createHttpError.NotFound('Permission not found'));

            await PermissionRole.create({
                permission_id:isPermissionExists.id,
                role_id:role.id
            });
        }

        res.status(201).json({
            success:true,
            message:'Permissions attached to role successfully',
        })

    } catch (error) {
        next(error);
    }

}


//  update permission role
async function update(req,res,next){

    try {
    
        const {id} = req.params;
        const {permissions} = req.body;

       // check if permissions is array
       if(!Array.isArray(permissions)) return next(createHttpError.BadRequest('Permissions must be an array'));
       // check if permissions is not empty
       if(permissions.length === 0) return next(createHttpError.BadRequest('Permissions cannot be empty'));
       // check if permissions is array of numbers
       if(permissions.some(permission => typeof permission !== 'number')) return next(createHttpError.BadRequest('Permissions must be an array of numbers'));
       // check if permissions is array of positive numbers
       if(permissions.some(permission => permission < 0)) return next(createHttpError.BadRequest('Permissions must be an array of positive numbers'));
       // check if permissions length is less than 10
       if(permissions.length > 10) return next(createHttpError.BadRequest('Permissions cannot be more than 10'));
       // check if role exists
       const role = await Role.findByPk(id);
       if(!role) return next(createHttpError.NotFound('Role not found'));


        // delete all permissions from role
        await PermissionRole.destroy({where: {role_id:id}});

        // attach new permissions to role
        for(const permission of permissions){

            // check if permission exists
            const isPermissionExists = await Permission.findByPk(permission);
            if(!isPermissionExists) return next(createHttpError.NotFound('Permission not found'));

            await PermissionRole.create({
                permission_id:isPermissionExists.id,
                role_id:role.id
            });

        }

        res.status(200).json({
            success:true,
            message:'Permissions updated successfully',
        })

    } catch (error) {
        next(error);
    }

}

export {create,update};
