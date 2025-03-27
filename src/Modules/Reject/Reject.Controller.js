import Reject from './RejectModel.js';
import rejectValidation from './validation.js';
import createHttpError from 'http-errors';
import { Op } from 'sequelize';
import {makeSlug} from '../../Helpers/Helper.js';


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
            rejects
        })

    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {

        const {slug} = req.params;

        const reject = await Reject.findOne({where:{slug:slug}});

        if(!reject) return next(createHttpError.NotFound('Reject not found'));

        res.status(200).json({
            success:true,
            message:'Reject fetched successfully',
            reject
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
            name,status,type,slug: await makeSlug(name,'rejects')
        })

        res.status(201).json({
            success:true,
            reject
        })

    } catch (error) {
        next(error);
    }
}


async function update(req,res,next){

    try {
        
        const {slug} = req.params;

        const reject = await Reject.findOne({where:{slug:slug}});

        const {error} = rejectValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const {name,status,type} = req.body;  

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
        
        const {slug} = req.params;

        const reject = await Reject.findOne({where:{slug:slug}});

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
        
        const {slug} = req.params;

        const reject = await Reject.findOne({where:{slug:slug}});

        if(!reject) return next(createHttpError.NotFound('Reject not found'));

        await reject.update({status : reject.status == 0 ? 1 : 0});

        res.status(200).json({
            success:true,
            message:'Reject status changed successfully',
            reject
        })

    } catch (error) {
        next(error);
    }

}

export {index,show,create,update,destroy,changeStatus};
