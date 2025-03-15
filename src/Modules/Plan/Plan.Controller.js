import Plan from './PlanModel.js';
import { planSchema } from './validation.js';
import createHttpError from 'http-errors';



// create plan
async function create(req,res,next){

    try {

        const {name,description,price,request} = req.body;

        const {error} = planSchema.validate({name,description,price,request});
        if(error) return next(createHttpError.BadRequest(error.message));

        const plan = await Plan.create({name,description,price,request});

        res.status(201).json({
            success:true,
            message:'Plan created successfully',
            plan
        })

    } catch (error) {
        next(error);
    }

}


// show plan
async function show(req,res,next){

    try {

        const plan = await Plan.findByPk(req.params.id);
        if(!plan) return next(createHttpError.NotFound('Plan not found'));

        res.status(200).json({
            success:true,
            message:'Plan fetched successfully',
            plan
        })

    } catch (error) {
        next(error);
    }

}


// update plan
async function update(req,res,next){

    try {
        
        const plan = await Plan.findByPk(req.params.id);
        if(!plan) return next(createHttpError.NotFound('Plan not found'));

        const {name,description,price,request} = req.body;

        const {error} = planSchema.validate({name,description,price,request});
        if(error) return next(createHttpError.BadRequest(error.message));

        const updatedPlan = await Plan.update({
            name,description,price,request
        }, {where: {id:req.params.id}});

        res.status(200).json({
            success:true,
            message:'Plan updated successfully',
            updatedPlan
        })
        

    } catch (error) {
        next(error);
    }

}


// delete plan
async function destroy(req,res,next){

    try {
     
        const plan = await Plan.findByPk(req.params.id);
        if(!plan) return next(createHttpError.NotFound('Plan not found'));

        await plan.destroy();

        res.status(200).json({
            success:true,
            message:'Plan deleted successfully'
        })

    } catch (error) {
        next(error);
    }

}


// change plan status
async function changeStatus(req,res,next){

    try {

        const plan = await Plan.findByPk(req.params.id);
        if(!plan) return next(createHttpError.NotFound('Plan not found'));

        const updatedPlan = await Plan.update({status:plan.status == 1 ? 0 : 1}, {where: {id:req.params.id}});

        res.status(200).json({
            success:true,
            message:'Plan status updated successfully',
            updatedPlan
        })

    } catch (error) {
        next(error);
    }

}

// all plans
async function index(req,res,next){

    try {
 
        const plans = await Plan.findAll();

        res.status(200).json({
            success:true,
            message:'Plans fetched successfully',
            plans
        })
        
    } catch (error) {
        next(error);
    }

}


export {create,show,update,destroy,changeStatus,index};
