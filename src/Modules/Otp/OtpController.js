import Otp from './OtpModel.js';
import createHttpError from 'http-errors';
import { Op } from 'sequelize';


// all otps
async function index(req,res,next){
    try {
        
        const {page,limit,expire} = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const otps = await Otp.findAll({
            where:{
                expires_in:{$lte:expire}
            },
            offset:offset,
            limit:limit,
            order:[['createdAt','DESC']]
        });

        res.status(200).json({
            success:true,
            message:'Otp fetched successfully',
            data:otps
        })

    } catch (error) {
        next(error);
    }
}

// show otp
async function show(req,res,next){
    try {
        
        const {id} = req.params;

        const otp = await Otp.findByPk(id);

        if(!otp) return next(createHttpError.NotFound('Otp not found'));

        res.status(200).json({
            success:true,
            message:'Otp fetched successfully',
            data:otp
        })

    } catch (error) {
        next(error);
    }
}


// delete otps which are expired for 7 days
async function deleteExpiredOtp(req,res,next){

    try {
    
        await Otp.destroy({
            where:{
                expires_in:{$lte:Date.now() - 7 * 24 * 60 * 60 * 1000}
            }
        });
        
        res.status(200).json({
            success:true,
            message:'Expired otps deleted successfully'
        })
        
    } catch (error) {
        next(error);
    }
}


export {index,show,deleteExpiredOtp};
