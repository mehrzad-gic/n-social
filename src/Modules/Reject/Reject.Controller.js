import Reject from './RejectModel.js';
import rejectValidation from './validation.js';
import createHttpError from 'http-errors';
import { Op } from 'sequelize';

async function index(req,res,next){

    try {

        const {type} = req.query;

        const rejects = await Reject.findAll({
            where:{
                type:type ? parseInt(type) : {
                    [Op.in]:[0,1,2]
                }
            }
        });

        res.status(200).json({
            success:true,
            message:'Rejects fetched successfully',
            data:rejects
        })

    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {

        const {id} = req.params;

        const reject = await Reject.findByPk(id);

        if(!reject) return next(createHttpError.NotFound('Reject not found'));

        res.status(200).json({
            success:true,
            message:'Reject fetched successfully',
            data:reject
        })

    } catch (error) {
        next(error);
    }

}



async function create(req,res,next){

    try {
        
        const {error} = rejectValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const {name,status,type} = req.body;
        
        const reject = await Reject.create({
            name,status,type
        })

        res.status(201).json({
            success:true,
        })
    } catch (error) {
        next(error);
    }
}


async function update(req,res,next){

    try {
        
        const {id} = req.params;

        const {error} = rejectValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const {name,status,type} = req.body;  

        const reject = await Reject.findByPk(id);

        if(!reject) return next(createHttpError.NotFound('Reject not found'));

        await reject.update({name,status,type});

        res.status(200).json({
            success:true,
            message:'Reject updated successfully',
            data:reject
        })

    } catch (error) {
        next(error);
    }

}


async function destroy(req,res,next){

    try {
        
        const {id} = req.params;

        const reject = await Reject.findByPk(id);

        if(!reject) return next(createHttpError.NotFound('Reject not found'));

        await reject.destroy();
    
        res.status(200).json({
            success:true,
            message:'Reject deleted successfully',
        })  

    } catch (error) {
        next(error);
    }
}


async function changeStatus(req,res,next){

    try {
        
        const {id} = req.params;

        const reject = await Reject.findByPk(id);

        if(!reject) return next(createHttpError.NotFound('Reject not found'));

        await reject.update({status : reject.status == 0 ? 1 : 0});

        res.status(200).json({
            success:true,
            message:'Reject status changed successfully',
            data:reject
        })

    } catch (error) {
        next(error);
    }

}

export {index,show,create,update,destroy,changeStatus};
