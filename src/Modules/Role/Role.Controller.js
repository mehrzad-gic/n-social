import { roleSchema } from './validation.js';
import createHttpError from 'http-errors';
import Role from './RoleModel.js';
import PermissionRole from '../PermissionRole/PermissionRoleModel.js';
import Permission from '../Permission/PermissionModel.js';
import pool from '../../Configs/Mysql2.js';


// create role
async function create(req,res,next){

    try {
        
        const {error} = roleSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.details[0].message));

        const role = await Role.create(req.body);

        console.log(req.body.permissions);
        if(req.body.permissions && req.body.permissions.length > 0){
            
            // attach permissions[] to role
            req.body.permissions.forEach(async (permissionId) => {
                await PermissionRole.create({
                    role_id: role.id,
                    permission_id: permissionId
                });
            });
        }

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
 

        // get all roles with permissions with this structure
        /*
        [
            {
                id: 1,
                name: 'Admin',
                permissions: [
                    {
                        id: 1,
                        name: 'create',
                        description: 'create permission'
                    },
                    {
                        id: 2,
                        name: 'read',
                        description: 'read permission'
                    },
                    {
                        id: 3,
                        name: 'update',
                        description: 'update permission'
                    },
                    {
                        id: 4,
                        name: 'delete',
                        description: 'delete permission'
                    }
                ]
            }
        ]
        */

        const sql = `
            SELECT 
                r.id,
                r.name,
                r.status,
                p.name as permission_name,
                p.id as permission_id
            FROM roles r
            LEFT JOIN permission_role pr ON r.id = pr.role_id
            LEFT JOIN permissions p ON pr.permission_id = p.id
        `;

        const result = await pool.query(sql); /*
        [
            [
                { id: 4, name: 'role 3', permission_name: 'per 1' },
                { id: 4, name: 'role 3', permission_name: 'nnnnnnnn' },
                { id: 4, name: 'role 3', permission_name: 'permission 1' },
                { id: 2, name: 'role 1', permission_name: null },
                { id: 3, name: 'role 2', permission_name: null }
            ],
            [
                `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                `name` VARCHAR(255) NOT NULL,
                `permission_name` VARCHAR(255)
            ]
        ]
        */


        // reduce the result to the desired structure
        /*
        [
            {
                id: 1,
                name: 'Admin',
                permissions: [ 
                    {
                        id: 1,
                        name: 'create',
                        description: 'create permission'
                    },
                ]
        */

        let roles = []
        result[0].forEach(role => {

            const existingRole = roles.find(r => r.id == role.id);

            if(existingRole){
                existingRole.permissions.push({
                    id: role.permission_id,
                    name: role.permission_name,
                    description: role.permission_description
                });
            }else{
                roles.push({
                    id: role.id,
                    name: role.name,
                    status: role.status,
                    permissions: []
                });
            }

        });

        console.log('--------------------------------✅✅✅✅✅✅----------------------------------------');
        console.log(roles,result);
        console.log('--------------------------------✅✅✅✅✅✅----------------------------------------');

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
