import Permission from './PermissionModel.js';
import { permissionSchema } from './validation.js';
import createHttpError from 'http-errors';


// create permission
async function create(req,res,next){

    try {

        const {error} = permissionSchema.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const permission = await Permission.create(req.body);

        res.status(201).json({
            success:true,
            message:'Permission created successfully',
            permission
        })

    } catch (error) {
        next(error);
    }

}


// all permissions
async function index(req,res,next){
 
    try {
 
        const permissions = await Permission.findAll();

        res.status(200).json({
            success:true,
            message:'Permissions fetched successfully',
            permissions
        });

    } catch (error) {
        next(error);
    }

}


// show permission
async function show(req,res,next){

    try {

        const permission = await Permission.findByPk(req.params.id);
        if(!permission) return next(createHttpError.NotFound('Permission not found'));

        res.status(200).json({
            success:true,
            message:'Permission fetched successfully',
            permission
        })

    } catch (error) {
        next(error);
    }

}


// update permission
async function update(req,res,next){
 
    try {
 
        const permission = await Permission.findByPk(req.params.id);
        if(!permission) return next(createHttpError.NotFound('Permission not found'));

        await permission.update(req.body);

        res.status(200).json({
            success:true,
            message:'Permission updated successfully',
            permission
        })

    } catch (error) {
        next(error);
    }

}


// delete permission
async function destroy(req,res,next){
    try {

        const permission = await Permission.findByPk(req.params.id);
        if(!permission) return next(createHttpError.NotFound('Permission not found'));

        await permission.destroy();
        
        res.status(200).json({
            success:true,
            message:'Permission deleted successfully'
        })

    } catch (error) {
        next(error);
    }
}



// change permission status
async function changeStatus(req,res,next){
    
    try {
    
        const permission = await Permission.findByPk(req.params.id);
        if(!permission) return next(createHttpError.NotFound('Permission not found'));

        await permission.update({status:permission.status == 1 ? 0 : 1});

        res.status(200).json({
            success:true,
            message:'Permission status updated successfully',
            permission
        })

    } catch (error) {
        next(error);
    }

}

export {create,index,show,update,destroy,changeStatus};

