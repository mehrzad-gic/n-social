import JobOfferRequest from './JobOfferRequestModel.js';
import jobOfferRequestValidation from './validation.js';
import createHttpError from 'http-errors';
import Reject from '../Reject/RejectModel.js';
import JobOffer from '../JobOffer/JobOfferModel.js';


async function index(req,res,next){

    try {
        
        const jobOfferRequests = await JobOfferRequest.findAll({
            include:[
                {
                    model:JobOffer,
                    attributes:['name','slug']
                },
                {
                    model:JobOffer,
                    attributes:['name','slug']
                },
                {
                    model:Reject,
                    attributes:['reason']
                }
            ]
        });

        res.status(200).json({
            success:true,
            message:'Job offer requests fetched successfully',
            jobOfferRequests
        });

    } catch (error) {
        next(error);            
    }

}


async function create(req,res,next){

    try {
        
        const {id} = req.params;
        const {salary,des} = req.body;

        const {error} = jobOfferRequestValidation.validate(req.body);
        if(error) return next(createHttpError.BadRequest(error.message));

        const jobOffer = await JobOffer.findByPk(id);
        if(!jobOffer) return next(createHttpError.NotFound('Job offer not found'));

        const jobOfferRequest = await JobOfferRequest.create({
            salary,
            des,
            job_offer_id:id,
            user_id:req.session.user.id
        });

        res.status(200).json({
            success:true,
            message:'Job offer request created successfully',
            jobOfferRequest
        });

    } catch (error) {
        next(error);
    }

}


async function show(req,res,next){

    try {
 
        const {id} = req.params;

        const jobOfferRequest = await JobOfferRequest.findByPk(id,{
            include:[
                {model:JobOffer,attributes:['name','slug']},
                {model:Reject,attributes:['reason']},
                {model:User,attributes:['name','email','phone','img']}
            ]
        });

        if(!jobOfferRequest) return next(createHttpError.NotFound('Job offer request not found'));

        let answer_by_id = null;
        if(jobOfferRequest.answer_by_id) answer_by_id = await User.findByPk(jobOfferRequest.answer_by_id,{
            attributes:['name','email','slug','img']
        });

        res.status(200).json({
            success:true,
            message:'Job offer request fetched successfully',
            jobOfferRequest,
            answer_by_id
        });

    } catch (error) {
        next(error);
    }

}


async function answer(req,res,next){

    try {

        const {id} = req.params;
        const {status,reject_reason,resolve_message} = req.body;

        const jobOfferRequest = await JobOfferRequest.findByPk(id);
        if(!jobOfferRequest) return next(createHttpError.NotFound('Job offer request not found'));
        
        if(status === 'reject'){
            await jobOfferRequest.update({
                answer_by_id:req.session.user.id,
                reject_id:reject_reason,
                status:'rejected'
            });
        }else if(status === 'resolve'){
            await jobOfferRequest.update({
                answer_by_id:req.session.user.id,
                resolve_message:resolve_message,
                status:'accepted'
            });
        }

        res.status(200).json({
            success:true,
            message:'Job offer request answered successfully',
        });
        
        
    } catch (error) {
        next(error);
    }

}


export {index,create,show,answer};
