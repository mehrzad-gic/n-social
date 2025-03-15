import GroupRequest from './GroupRequestModel.js';
import createHttpError from 'http-errors';
import { Op } from 'sequelize';
import Group from '../Group/GroupModel.js';
import User from '../User/UserModel.js';
import groupRequestValidation from './validation.js';
import Reject from '../Reject/RejectModel.js';



async function index(req,res,next){

    try {
        
        const groupRequests = await GroupRequest.findAll({
            include:[
                {
                    model:Group,
                    as:'group',
                    attributes:['id','name','slug','img']
                },
                {
                    model:User,
                    as:'user',
                    attributes:['id','name','email','slug','img']
                },
                {
                    model:Reject,
                    as:'reject',
                    attributes:['id','reason']
                }
            ]
        })

        res.status(200).json({
            success:true,
            message:'Group requests fetched successfully',
            data:groupRequests
        })
        
    } catch (error) {
        next(error);
    }
}


async function show(req,res,next){
    
    try {

        const {id} = req.params;

        const groupRequest = await GroupRequest.findByPk(id,{
            include:[
                {model:Group,as:'group',attributes:['id','name','slug','img']},
                {model:User,as:'user',attributes:['id','name','email','slug','img']}
            ]
        })

        if(!groupRequest) return next(createHttpError.NotFound('Group request not found'));

        res.status(200).json({
            success:true,
            message:'Group request fetched successfully',
            data:groupRequest
        })
        
    } catch (error) {
        next(error);
    }

}


async function create(req,res,next){

    try {
        
        const {error} = groupRequestValidation.validate(req.body);

        if(error) return next(createHttpError.BadRequest(error.message));

        const {group_id,message} = req.body;

        const group = await Group.findByPk(group_id);

        if(!group) return next(createHttpError.NotFound('Group not found'));

        const groupRequest = await GroupRequest.create({
            group_id,message,user_id:req.session.user.id
        })

        res.status(201).json({
            success:true,
            message:'Group request created successfully',
            data:groupRequest
        })
        
    } catch (error) {
        next(error);
    }
}


async function answer(req,res,next){

    try {
     
        const {id} = req.params;
        const {status,reject_id} = req.body;

        const groupRequest = await GroupRequest.findByPk(id);
        if(!groupRequest) return next(createHttpError.NotFound('Group request not found'));
        
        if(status === 'reject'){
            await groupRequest.update({
                answer_by_id:req.session.user.id,
                status:2,
                reject_id:reject_id
            });
        } else if(status === 'resolve'){
            await groupRequest.update({
                answer_by_id:req.session.user.id,
                status:1
            });
        }

        res.status(200).json({
            success:true,
            message:'Group request answered successfully',
        })
        
    } catch (error) {
        next(error);
    }

}


export {index,show,create,answer};

